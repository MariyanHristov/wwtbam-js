import { Set as ImmutableSet } from "immutable";

export class Player {
    id;
    data;
    isHost = false;
    isPlaying = true;
    money = 0;
    points = 0;
    usedLifelines = new ImmutableSet();

    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    serialize() {
        return {
            id: this.id,
            data: this.data,
            isHost: this.isHost,
            isPlaying: this.isPlaying,
            money: this.money,
            points: this.points,
            usedLifelines: [...this.usedLifelines],
        };
    }
}
