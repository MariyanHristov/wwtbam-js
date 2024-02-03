import {RedisBus} from "../bus/redis.mjs";
import {Game} from "./Game.mjs";

const bus = new RedisBus({
    server: {
        socket: {
            path: "/var/run/redis/redis-server.sock"
        }
    },
    channel: "wwtbam"
});

const games = new Map();

bus.on("message", (message) => {
    if(message.type === "newGame") {
        games.set(
            message.id,
            new Game(bus, message.id, Game.selectQuestions(message.questions)),
        );
    } else {
        games.get(message.gameID)?.onMessage(message);
    }
});

await bus.connect();
