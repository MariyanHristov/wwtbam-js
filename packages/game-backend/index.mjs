import { createBus } from "../bus/index.mjs";
import { Game } from "./Game.mjs";

const games = new Map();

const bus = createBus();

bus.on("message", (message) => {
    if (message.type === "newGame") {
        const game = new Game(bus, message.id, Game.selectQuestions(message.questions));

        games.set(message.id, game);

        setInterval(() => {
            game.onTick();
        }, 1500);
    } else {
        games.get(message.gameID)?.onMessage(message);
    }
});

await bus.connect();
