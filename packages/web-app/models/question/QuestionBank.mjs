import DAL from '../../DAL/question/questionBank.mjs';

class QuestionBank {
    constructor(id, title, description, createUser) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createUser = createUser;
    }

    setQuestionBank(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.createUser = data.createUser;
        this.questions = data.questions;
    }

    static async getById(id, callback) {
        try {
            const result = await DAL.getById(id);
            if (result.length === 0) {
                return null;
            }

            const { title, description, createUser } = result[0];
            return new QuestionBank(id, title, description, createUser);
        } catch (error) {
            console.error('Err');
            throw error;
        }
    }
}

module.exports = QuestionBank;