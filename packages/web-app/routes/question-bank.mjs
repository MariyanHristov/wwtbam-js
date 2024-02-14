import express from "express";

import QuestionBankWithQuestions from "../models/question/QuestionBankWithQuestions.mjs";

const router = express.Router();

// router.get('/:id', async (req, res) => {
//     try {
//         const questionBankId = req.params.id;
//         const questionBankWithQuestions = QuestionBankWithQuestions.getById(questionBankId);
//     }
// });

router.get("/create", async (req, res) => {
    const questionBank = await QuestionBankWithQuestions.getEmptyQuestionBank();

    res.render("question/questionBankCreate", {questionBank});
});

router.get("/edit/:id", async (req, res) => {
    try {
        const questionBankId = req.params.id;
        const questionBank =
            await QuestionBankWithQuestions.getById(questionBankId);

        res.render("question/questionBankEdit", {questionBank});
    } catch (error) {
        console.error("questionBankController err");
        throw error;
    }
});

router.post("/edit", async (req, res) => {
    console.log(req.body);

    const questionBankId = req.body.id;
    const questionBank =
        await QuestionBankWithQuestions.getById(questionBankId);

    res.render("question/questionBankEdit", {questionBank});
});

export default router;
