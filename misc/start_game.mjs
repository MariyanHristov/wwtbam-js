import fs from "fs";
import { v4 as uuid } from "uuid";
import { RedisBus } from "../packages/bus/redis.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const bus = new RedisBus({
    server: {
        socket: {
            path: "/var/run/redis/redis-server.sock",
        },
    },
    channel: "wwtbam",
});

await bus.connect();

const dir = dirname(fileURLToPath(import.meta.url));

// const id = uuid();
const id = "efa12e37-43e6-47f5-a3fd-a05ff3c0a583";

await bus.send({
    type: "newGame",
    id,
    questions: fs
        .readdirSync(`${dir}/questions`)
        .map((name) => JSON.parse(String(fs.readFileSync(`${dir}/questions/${name}`)))),
});

console.log(id);

await bus.disconnect();
