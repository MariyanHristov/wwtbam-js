import {createBus} from "../bus/index.mjs";
import {Game} from "./Game.mjs";

const games = new Map();

const bus = createBus();

bus.on("message", (message) => {
    if (message.type === "newGame") {
        games.set(
            message.id,
            new Game(bus, message.id, Game.selectQuestions(message.questions))
        );
    } else {
        games.get(message.gameID)?.onMessage(message);
    }
});

await bus.connect();
