import { query } from "../../mysql.mjs";

const DAL = {
    insertQuestion: function (question, questionBankId, createUser) {
        return query(
            `INSERT INTO questions (question_title, question_answer_a, question_answer_b,
                question_answer_c, question_answer_d, question_correct_answer, question_bank_id,
                question_type_id, create_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                question.question_title,
                question.question_answer_a,
                question.question_answer_b,
                question.question_answer_c,
                question.question_answer_d,
                question.question_correct_answer,
                questionBankId,
                1,
                createUser,
            ],
        );
    },

    updateQuestion: function (question, questionBankId, createUser) {
        return query(
            `UPDATE questions
                SET question_title = ?,
                    question_answer_a = ?,
                    question_answer_b = ?,
                    question_answer_c = ?,
                    question_answer_d = ?,
                    question_correct_answer = ?,
                    question_bank_id = ?,
                    question_type_id = ?,
                    create_user = ?
                WHERE id = ?`,
            [
                question.question_title,
                question.question_answer_a,
                question.question_answer_b,
                question.question_answer_c,
                question.question_answer_d,
                question.question_correct_answer,
                questionBankId,
                1,
                createUser,
                question.id,
            ],
        );
    },

    getQuestionsByQuestionBankId: function (questionBankId) {
        return query("SELECT * FROM questions WHERE question_bank_id = ?", [questionBankId]);
    },
};

export default DAL;
