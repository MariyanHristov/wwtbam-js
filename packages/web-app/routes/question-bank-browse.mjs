import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    res.render("question/questionBankBrowse");
});

export default router;
