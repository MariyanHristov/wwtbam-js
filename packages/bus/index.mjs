import { REDIS_CHANNEL, REDIS_PATH, REDIS_URL } from "../env/index.mjs";
import { RedisBus } from "./redis.mjs";

function createRedisBus() {
    const redis = REDIS_PATH
        ? {
              socket: {
                  path: REDIS_PATH,
              },
          }
        : { url: REDIS_URL };

    const config = {
        server: redis,
        channel: REDIS_CHANNEL,
    };

    return new RedisBus(config);
}

export function createBus() {
    // Only Redis is implemented, but we could use any message broker
    // (MQ, Azure Service Bus, etc. would all likely work)
    return createRedisBus();
}
