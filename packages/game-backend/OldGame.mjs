import {createClient} from "redis";

function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const STATE_NEW = "new";
const STATE_PLAYING = "playing";

// TODO: convert to state machine?

export class Game {
    constructor(bus, redis, id, questions) {
        this.bus = bus;
        // this.redis = redis;
        this.id = id;
        this.questions = questions;
        this.players = [];
        this.host = null;
        this.state = STATE_NEW;
        this.lastState = null;

        this.currentQuestion = 0;
        this.answers = new Map();
        this.availableLifelines = new Map();

        // console.log(questions);
    }

    static selectQuestions(banks) {
        const num = Math.min(...banks.map((bank) => bank.length));

        return new Array(num).fill(null).map((_, index) => choose(banks)[index]);
    }

    addPlayer(id) {
        if(this.state !== STATE_NEW) {
            return;
        }

        this.players.push(id);

        this.availableLifelines.set(id, {
            fiftyfifty: true,       // remove 2 wrong answers
            switch: true,           // replace the question with another one (for everyone!)
            doubledip: true,        // you can give two answers, but you don't win anything
        });

        if(this.host == null) {
            this.host = id;
        }

        this.sendState("new");
    }

    start(playerID) {
        if(this.state === STATE_NEW && this.host === playerID) {
            this.state = STATE_PLAYING;
            this.nextQuestion();
        }
    }

    nextQuestion() {
        this.currentQuestion += 1;
        this.answers = new Map();

        this.sendState("question");
    }

    answerQuestion(playerID, answer) {
        if(this.state === STATE_PLAYING) {
            this.answers.set(playerID, answer);

            if(this.answers.size === this.players.size) {
                this.evaluateAnswers();
            } else {
                this.sendState("question");
            }
        }
    }

    evaluateAnswers() {
        // check if player answers are correct
        // send state update with new answers

        this.nextQuestion();
    }

    sendState(state, rest = {}) {
        const newState = {
            type: "game_state",
            game: this.id,
            state,
            players: this.players,
            currentQuestion: this.currentQuestion,
            answers: this.answers.size,
            ...rest,
        };

        if(this.currentQuestion >= 1) {
            Object.assign(newState, {
                question: this.questions[this.currentQuestion - 1].question,
                options: this.questions[this.currentQuestion - 1].options,
            });
        }

        this.bus.send(newState);

        this.lastState = newState;
    }

    resendLastState() {
        if(this.lastState) {
            this.bus.send(this.lastState);
        }
    }
}
