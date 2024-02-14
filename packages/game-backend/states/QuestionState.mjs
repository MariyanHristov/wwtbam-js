import { Map as ImmutableMap, OrderedMap as ImmutableOrderedMap, Set as ImmutableSet } from "immutable";

import { State } from "./State.mjs";
import { LeaderboardState } from "./LeaderboardState.mjs";
import { ResultsState } from "./ResultsState.mjs";

import { LIFELINES, LIFELINE_DOUBLE_DIP, LIFELINE_FIFTY_FIFTY, LIFELINE_SWITCH } from "../const.mjs";

import { shuffle } from "../random.mjs";

const PAYOUT = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

const SAFETY_NETS = [32000, 1000, 0];

export class QuestionState extends State {
    constructor(gameData, number) {
        const question = number < 0 ? gameData.reserveQuestions[gameData.nextReserve] : gameData.questions[number - 1];

        super(gameData, "question", {
            number,
            question: question.question,
            options: question.options,
            correctOption: question.correctOption,
            answers: new ImmutableOrderedMap(),
            additionalAnswers: new ImmutableMap(),
            usedDoubleDip: new ImmutableSet(),
        });

        if (number < 0) {
            this.emit("useReserve");
        }
    }

    serialize() {
        return {
            number: Math.abs(this.data.number),
            isReserve: this.data.number < 0,
            question: this.data.question,
            options: this.data.options,
            answeredPlayers: [...this.data.answers.keys()].map((player) => player.id),
        };
    }

    onAnswerQuestionMessage(player, message) {
        if (!this.data.answers.has(player)) {
            this.update({
                answers: (answers) => answers.set(player, message.answer),
            });

            if (message.additionalAnswer && this.data.usedDoubleDip.has(player)) {
                this.update({
                    additionalAnswers: (answers) => answers.set(player, message.additionalAnswer),
                });
            }
        }

        if (this.data.answers.size === this.gameData.players.size) {
            this.#conclude();
        }
    }

    #conclude() {
        const currentQuestion = Math.abs(this.data.number);

        // scoring:
        // - 1 point per dollar earned (double dip means no earnings for that question)
        // - with question switch, players who've already answered correctly get the question's worth in points
        // - first to answer gets 10*players points, next to answer gets half of that, etc.
        //   always a multiple of 5, no points if it would be below 5
        // - if the game is lost, you lose 5 points per dollar earned after safety net, rounded to 5
        // - after losing, you get 10 points per correct answer

        let earlyBirdPoints = 10 * this.gameData.players.size;

        for (const player of this.gameData.players) {
            if (player.isPlaying) {
                player.points += earlyBirdPoints;

                earlyBirdPoints /= 2;
                earlyBirdPoints = Math.floor(earlyBirdPoints / 5) * 5;
            }

            const correctAnswer =
                this.data.answers.get(player) === this.data.correctOption ||
                this.data.additionalAnswers.get(player) === this.data.correctOption;

            if (correctAnswer) {
                if (player.isPlaying) {
                    const payout = PAYOUT[Math.min(currentQuestion, PAYOUT.length) - 1];

                    player.money += payout;
                    player.points += payout;
                } else {
                    player.points += 10;
                }
            } else if (player.isPlaying) {
                const oldMoney = player.money;

                player.money = SAFETY_NETS.find((net) => net <= oldMoney) ?? 0;
                player.points -= 5 * (oldMoney - player.money);
                player.isPlaying = false;
            }
        }

        const anyPlayersLeft = this.gameData.players.find((player) => player.isPlaying) != null;

        const targetState =
            currentQuestion === this.gameData.questions.length || !anyPlayersLeft ? ResultsState : LeaderboardState;

        this.transition(targetState, {
            number: currentQuestion,
            question: this.data.question,
            options: this.data.options,
            correctOption: this.data.correctOption,
            answers: this.data.answers,
            additionalAnswers: this.data.additionalAnswers,
        });
    }

    onUseLifelineMessage(player, message) {
        const lifeline = message.lifeline;

        if (LIFELINES.includes(lifeline) && !player.usedLifelines.has(lifeline) && !this.data.answers.has(player)) {
            player.usedLifelines = player.usedLifelines.add(lifeline);

            const callbacks = {
                [LIFELINE_FIFTY_FIFTY]: this.#onUseFiftyFifty,
                [LIFELINE_SWITCH]: this.#onUseSwitch,
                [LIFELINE_DOUBLE_DIP]: this.#onUseDoubleDip,
            };

            callbacks[lifeline].call?.(this, player);

            this.update();
        }
    }

    #onUseFiftyFifty(player) {
        const possibleToRemove = this.data.options.filter((option) => option !== this.data.correctOption);

        this.emit("send", "removeAnswers", {
            playerID: player.id,
            answers: shuffle(possibleToRemove).slice(0, 2),
        });
    }

    #onUseSwitch() {
        for (const player of this.gameData.players) {
            const correctAnswer =
                this.data.answers.get(player) === this.data.correctOption ||
                this.data.additionalAnswers.get(player) === this.data.correctOption;

            if (player.isPlaying && correctAnswer) {
                player.points += PAYOUT[Math.min(Math.abs(this.data.number), PAYOUT.length) - 1];
            }
        }

        this.transition(QuestionState, -Math.abs(this.data.number));
    }

    #onUseDoubleDip(player) {
        this.update({
            usedDoubleDip: (usedDoubleDip) => usedDoubleDip.add(player),
        });
    }
}
