import {query} from "../../mysql.mjs";

const DAL = {
    insertQuestion: function (question, createUser, questionBankId) {
        return query(
            "INSERT INTO question (question_title, question_answer_a, question_answer_b," +
                "question_answer_c, question_answer_d, question_correct_answer, question_bank_id," +
                "question_type_id, create_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                question.questionTitle,
                question.questionAnswerA,
                question.questionAnswerB,
                question.questionAnswerC,
                question.questionAnswerD,
                question.questionCorrectAnswer,
                questionBankId,
                question.questionTypeId,
                createUser,
            ]
        );
    },

    getQuestionsByQuestionBankId: function (questionBankId) {
        return query("SELECT * FROM questions WHERE question_bank_id = ?", [
            questionBankId,
        ]);
    },
};

export default DAL;
