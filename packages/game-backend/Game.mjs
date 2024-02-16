import { Set as ImmutableSet } from "immutable";
import { LobbyState } from "./states/LobbyState.mjs";
import { Player } from "./Player.mjs";
import { choose, shuffle } from "./random.mjs";

export class Game {
    id;
    questions;
    reserveQuestions;
    nextReserve = 0;

    state = null;
    players = new ImmutableSet();
    host = null;
    isProcessingMessage = false;

    lastUpdate = null;
    nextUpdate = null;

    constructor(bus, id, { questions, reserveQuestions }) {
        this.id = id;
        this.questions = questions;
        this.reserveQuestions = reserveQuestions;
        this.bus = bus;

        this.#setState(LobbyState);
    }

    static selectQuestions(banks) {
        const num = Math.min(...banks.map((bank) => bank.length));

        const questions = new Array(num).fill(null).map((_, index) => choose(banks)[index]);

        const reserveQuestions = banks
            .flat()
            .filter((candidate) => questions.find((existing) => existing.question === candidate.question) == null);

        return {
            questions,
            reserveQuestions: shuffle(reserveQuestions).slice(0, 10),
        };
    }

    onMessage(message) {
        this.isProcessingMessage = true;

        try {
            if (message.type === "joinGame") {
                // New players have to be handled specially as they also update the Game
                this.#joinGame(
                    message.playerID,
                    Object.fromEntries(
                        ["name", "family_name", "city", "country"].map((key) => [key, message.data[key]]),
                    ),
                );
            } else {
                const callbackName = `on${message.type.slice(0, 1).toUpperCase()}${message.type.slice(1)}Message`;
                const player = this.players.find((player) => player.id === message.playerID);

                this.state[callbackName]?.(player, message);
            }

            this.#sendUpdate();
        } finally {
            this.isProcessingMessage = false;
        }
    }

    onTick() {
        // Periodically refresh game state for all clients
        if (this.lastUpdate) {
            this.bus.send({
                type: "gameState",
                ...this.lastUpdate,
            });
        }
    }

    #setState(ctor, ...args) {
        const state = new ctor(
            {
                questions: this.questions,
                reserveQuestions: this.reserveQuestions,
                nextReserve: this.nextReserve,
                players: this.players,
            },
            ...args,
        );

        state.on("update", (data) => {
            this.#scheduleUpdate();
        });

        state.on("transition", (ctor, ...args) => {
            this.#setState(ctor, ...args);
        });

        state.on("send", (type, body) => {
            this.bus.send({
                type,
                gameID: this.id,
                ...body,
            });
        });

        state.on("useReserve", () => {
            this.nextReserve = (this.nextReserve + 1) % this.reserveQuestions.length;
        });

        this.state = state;

        this.state.onActivated();

        this.#scheduleUpdate();
    }

    #scheduleUpdate() {
        // state updates may happen spontaneously or during message processing
        // if the latter, defer the update message until the entire update is over

        this.nextUpdate ??= {
            gameID: this.id,
            sequence: -1,
        };

        Object.assign(this.nextUpdate, {
            players: [...this.players].map((player) => player.serialize()),
            state: {
                type: this.state.name,
                ...this.state.serialize(),
            },
        });

        if (!this.isProcessingMessage) {
            this.#sendUpdate();
        }
    }

    #sendUpdate() {
        if (!this.nextUpdate) {
            return;
        }

        this.nextUpdate.sequence = this.lastUpdate ? this.lastUpdate.sequence + 1 : 1;

        this.bus.send({
            type: "gameState",
            ...this.nextUpdate,
        });

        this.lastUpdate = this.nextUpdate;
        this.nextUpdate = null;
    }

    #joinGame(playerID, playerData) {
        if (this.state.canJoinGame(playerID)) {
            const existing = this.players.find((player) => player.id == playerID);

            if (existing != null) {
                this.state.onJoinGame?.(existing);
                return;
            }

            const player = new Player(playerID, playerData);

            if (this.players.size === 0) {
                player.isHost = true;

                this.host = player;
            }

            this.players = this.players.add(player);

            this.state.onJoinGame?.(player);
        }
    }
}
