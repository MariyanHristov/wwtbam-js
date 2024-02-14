import EventEmitter from "events";
import { createClient } from "redis";

export class RedisBus extends EventEmitter {
    constructor(options) {
        super();

        this.sender = createClient(options.server);

        this.receiver = this.sender.duplicate();
        this.channel = options.channel;

        this.onMessageReceived = this.onMessageReceived.bind(this);
    }

    async connect() {
        await Promise.all([this.sender.connect(), this.receiver.connect()]);

        await this.receiver.subscribe(this.channel, this.onMessageReceived);
    }

    async send(message) {
        await this.sender.publish("wwtbam", JSON.stringify(message));
    }

    async disconnect() {
        await this.receiver.unsubscribe();

        await Promise.all([this.sender.disconnect(), this.receiver.disconnect()]);
    }

    onMessageReceived(message) {
        this.emit("message", JSON.parse(message));
    }
}
