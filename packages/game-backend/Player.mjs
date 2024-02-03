import {Set as ImmutableSet} from "immutable";

export class Player {
    id;
    isHost = false;
    isPlaying = true;
    money = 0;
    points = 0;
    usedLifelines = new ImmutableSet();

    constructor(id) {
        this.id = id;
    }

    serialize() {
        return {
            id: this.id,
            isHost: this.isHost,
            isPlaying: this.isPlaying,
            money: this.money,
            points: this.points,
            usedLifelines: [...this.usedLifelines],
        };
    }
}
