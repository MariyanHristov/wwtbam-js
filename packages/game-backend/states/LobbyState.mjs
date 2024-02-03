import {Set as ImmutableSet} from "immutable";
import {State} from "./State.mjs";
import {QuestionState} from "./QuestionState.mjs";

export class LobbyState extends State {
    constructor(gameData) {
        super(gameData, "lobby", {
            confirmedPlayers: new ImmutableSet()
        });
    }

    serialize() {
        return {
            confirmedPlayers: [...this.data.confirmedPlayers].map((player) => player.serialize())
        };
    }

    canJoinGame(playerID) {
        return true;
    }

    onJoinGame(player) {
        this.update({
            confirmedPlayers: (players) => players.add(player)
        });
    }

    onStartGameMessage(player) {
        if(player.isHost) {
            this.transition(QuestionState, 1);
        }
    }
}
