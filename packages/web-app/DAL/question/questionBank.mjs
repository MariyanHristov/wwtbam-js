import {query} from "../../mysql.mjs";

const DAL = {
    insertQuestionBank: function (questionBank, createUser) {
        return query(
            "INSERT INTO question_banks (title, description, create_user) VALUES (?, ?, ?)",
            [questionBank.title, questionBank.description, createUser]
        );
    },
    getById: function (questionBankId) {
        return query("SELECT * FROM question_banks WHERE id = ?", [
            questionBankId,
        ]);
    },
};

export default DAL;
