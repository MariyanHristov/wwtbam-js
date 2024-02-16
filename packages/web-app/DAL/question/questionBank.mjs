import {query} from "../../mysql.mjs";

const DAL = {
    insertQuestionBank: function (questionBank, createUser) {
        return query("INSERT INTO question_banks (title, description, create_user) VALUES (?, ?, ?)", [
            questionBank.title,
            questionBank.description,
            createUser,]);

    },
    updateQuestionBank: function (questionBank, createUser) {
        return query(
            `UPDATE question_banks
                SET title = ?,
                    description = ?,
                    create_user = ?
                WHERE id = ?`,
            [questionBank.title, questionBank.description, createUser, questionBank.id],
        );
    },

    getById: function (questionBankId) {
        return query("SELECT * FROM question_banks WHERE id = ?", [questionBankId]);
    },

    getAllQuestionBanks: function () {
        return query("SELECT * FROM question_banks");
    },
};

export default DAL;
