import express from "express";

import QuestionBankWithQuestions from "../models/question/QuestionBankWithQuestions.mjs";
import QuestionBank from "../models/question/QuestionBank.mjs";
import Question from "../models/question/Question.mjs";

const router = express.Router();

router.get("/create", async (req, res) => {
    const questionBank = await QuestionBankWithQuestions.getEmptyQuestionBank();

    res.render("question/questionBankCreate", { questionBank });
});

router.get("/edit/:id", async (req, res) => {
    try {
        const questionBankId = req.params.id;
        const questionBank = await QuestionBankWithQuestions.getById(questionBankId);

        res.render("question/questionBankEdit", { questionBank });
    } catch (error) {
        console.error("questionBankController err");
        throw error;
    }
});

router.post("/edit", async (req, res) => {
    const questions = req.body.questions;
    const questionBankId = req.body.id;

    await QuestionBank.updateQuestionBank(new QuestionBank(req.body.id, req.body.title, req.body.description, 1)); //todo add user

    questions.forEach(function (question) {
        if (question.id) {
            Question.updateQuestion(question, questionBankId, 1); //todo add suer
        } else {
            Question.insertQuestion(question, questionBankId, 1); //todo add user
        }
    });

    const questionBank = await QuestionBankWithQuestions.getById(questionBankId);

    res.render("question/questionBankEdit", { questionBank });
});

export default router;
