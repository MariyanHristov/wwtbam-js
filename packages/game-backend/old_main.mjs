import {RedisBus} from "../bus/redis.mjs";
import {Game} from "./Game.mjs";
import {createClient} from "redis";

const bus = new RedisBus({
    server: {
        socket: {
            path: "/var/run/redis/redis-server.sock"
        }
    },
    channel: "wwtbam"
});

const redis = createClient({
    socket: {
        path: "/var/run/redis/redis-server.sock"
    }
});

const games = new Map();

bus.on("message", (message) => {
    // console.log(message);

    if(message.type === "new_game") {
        games.set(
            message.id,
            new Game(bus, redis.duplicate(), message.id, Game.selectQuestions(message.questions)),
        );

        return;
    }

    if(message.type === "join_game") {
        games.get(message.game_id)?.addPlayer(message.player_id);

        return;
    }

    if(message.type === "start_game") {
        games.get(message.game_id)?.start(message.player_id);

        return;
    }

    if(message.type === "get_game_state") {
        games.get(message.game_id)?.resendLastState();

        return;
    }

    if(message.type === "answer_question") {
        games.get(message.game_id)?.answerQuestion(message.player_id, message.answer);

        return;
    }

    if(message.type === "use_lifeline") {
        games.get(message.game_id)?.useLifeline(message.player_id, message.lifeline);

        return;
    }

    // messages sent: game_state, remove_answers
});

await bus.connect();
