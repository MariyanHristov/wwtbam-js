import { Set as ImmutableSet } from "immutable";
import { State } from "./State.mjs";
import { QuestionState } from "./QuestionState.mjs";

export class LeaderboardState extends State {
    constructor(gameData, data) {
        super(gameData, "leaderboard", {
            ...data,
            continuedPlayers: new ImmutableSet(),
        });
    }

    serialize() {
        return {
            number: this.data.number,
            question: this.data.question,
            options: this.data.options,
            correctOption: this.data.correctOption,
            answers: Object.fromEntries(
                [...this.data.answers.entries()].map(([player, answer]) => [player.id, answer]),
            ),
            additionalAnswers: Object.fromEntries(
                [...this.data.additionalAnswers.entries()].map(([player, answer]) => [player.id, answer]),
            ),
            continuedPlayers: [...this.data.continuedPlayers].map((player) => player.id),
        };
    }

    onContinueMessage(player) {
        this.update({
            continuedPlayers: (players) => players.add(player),
        });

        if (this.data.continuedPlayers.size === this.gameData.players.size) {
            this.transition(QuestionState, this.data.number + 1);
        }
    }
}
