import express from "express";

import QuestionBank from "../models/question/QuestionBank.mjs";

const router = express.Router();

router.get("/", async (req, res) => {

    let questionBanks = await QuestionBank.getAllQuestionBanks();

    if (!questionBanks) {
        questionBanks = [];
    }

    res.render("question/questionBankBrowse", {questionBanks});
});

export default router;
