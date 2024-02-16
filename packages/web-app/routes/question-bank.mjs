import express from "express";

import QuestionBankWithQuestions from "../models/question/QuestionBankWithQuestions.mjs";
import QuestionBank from "../models/question/QuestionBank.mjs";
import Question from "../models/question/Question.mjs";
import {verifyUser} from "../auth/verify-user.mjs";

const router = express.Router();

router.get("/create", verifyUser, async (req, res) => {
    const questionBank = await QuestionBankWithQuestions.getEmptyQuestionBank();

    res.render("question/questionBankCreate", {questionBank});
});

router.post("/create", verifyUser, async (req, res) => {
    const questionBankCreate = req.body;
    const questions = req.body.questions;
    const userId = req.loggedInUserID;

    let { insertId } = await QuestionBank.insertQuestionBank(questionBankCreate, userId);

    if (questions) {
        questions.forEach(function (question) {
            Question.insertQuestion(question, insertId, userId);
        });
    }

    const questionBank = await QuestionBankWithQuestions.getById(insertId);

    res.render("question/questionBankEdit", {questionBank});
});

router.get("/edit/:id", verifyUser, async (req, res) => {
    try {
        const questionBankId = req.params.id;
        const questionBank = await QuestionBankWithQuestions.getById(questionBankId);

        res.render("question/questionBankEdit", {questionBank});
    } catch (error) {
        console.error("questionBankController err");
        throw error;
    }
});

router.post("/edit", verifyUser, async (req, res) => {
    const questions = req.body.questions;
    const questionBankId = req.body.id;
    const userId = req.loggedInUserID;

    await QuestionBank.updateQuestionBank(new QuestionBank(req.body.id, req.body.title, req.body.description, userId));

    if (questions) {
        questions.forEach(function (question) {
            if (question.id) {
                Question.updateQuestion(question, questionBankId, userId);
            } else {
                Question.insertQuestion(question, questionBankId, userId);
            }
        });
    }

    const questionBank = await QuestionBankWithQuestions.getById(questionBankId);

    res.render("question/questionBankEdit", {questionBank});
});

export default router;
