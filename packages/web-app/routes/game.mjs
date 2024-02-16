import express from "express";

import { verifyUser } from "../auth/verify-user.mjs";

// TEMP:
import fs from "fs";
import { v4 as uuid } from "uuid";
import { createBus } from "../../bus/index.mjs";
import { fileURLToPath } from "url";
import { dirname, format } from "path";
import Question from "../models/question/Question.mjs";

const router = express.Router();

router.get("/", verifyUser, (req, res) => {
    res.render("game/enter-code");
});

router.post("/new", verifyUser, async (req, res) => {
    const questions = await Promise.all(
        req.body.questionBankIds.map(Number).map(async (id) => {
            const rows = await Question.getAllByQuestionBankId(id);

            return rows.map((row) => {
                const options = [
                    row.question_answer_a,
                    row.question_answer_b,
                    row.question_answer_c,
                    row.question_answer_d,
                ];

                return {
                    question: row.question_title,
                    options,
                    correctOption: options[row.question_correct_answer - 1],
                };
            });
        }),
    );

    const bus = createBus();
    await bus.connect();

    const id = uuid();

    await bus.send({
        type: "newGame",
        id,
        questions,
    });

    res.redirect(303, `/game/${id}`);

    await bus.disconnect();
});

router.get("/:id", verifyUser, (req, res) => {
    res.render("game/play", {
        auth: req.cookies.auth,
        playerID: req.loggedInUserID,
    });
});

export default router;
