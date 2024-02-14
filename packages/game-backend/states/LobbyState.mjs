import { State } from "./State.mjs";
import { QuestionState } from "./QuestionState.mjs";

export class LobbyState extends State {
    constructor(gameData) {
        super(gameData, "lobby", {});
    }

    serialize() {
        return {};
    }

    canJoinGame(playerID) {
        return true;
    }

    onJoinGame(player) {
        this.update();
    }

    onStartGameMessage(player) {
        if (player.isHost) {
            this.transition(QuestionState, 1);
        }
    }
}
