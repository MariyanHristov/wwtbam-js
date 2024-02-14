import EventEmitter from "events";
import { Record } from "immutable";

export class State extends EventEmitter {
    name;
    data;
    gameData;

    constructor(gameData, name, initialData) {
        super();

        const DataFactory = Record(initialData);

        this.name = name;
        this.data = DataFactory();
        this.gameData = gameData;
    }

    serialize() {
        return {};
    }

    canJoinGame(playerID) {
        return false;
    }

    onActivated() {
        // no operation
    }

    update(values = {}) {
        for (const [key, value] of Object.entries(values)) {
            this.data = value instanceof Function ? this.data.update(key, value) : this.data.set(key, value);
        }

        this.#sendUpdate();
    }

    transition(ctor, ...args) {
        this.emit("transition", ctor, ...args);
    }

    #sendUpdate() {
        this.emit("update");
    }
}
