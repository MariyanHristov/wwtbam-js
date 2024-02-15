import { State } from "./State.mjs";

export class ResultsState extends State {
    constructor(gameData, data) {
        super(gameData, "results", data);
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
        };
    }

    onActivated() {
        this.emit("send", "playerScores", {
            scores: Object.fromEntries([...this.gameData.players].map((player) => [player.id, player.points])),
        });
    }
}
