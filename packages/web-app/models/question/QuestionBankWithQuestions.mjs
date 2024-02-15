import QuestionBankDAL from "../../DAL/question/questionBank.mjs";
import QuestionsDAL from "../../DAL/question/question.mjs";
import QuestionTypeDAL from "../../DAL/question/questionType.mjs";

class QuestionBankWithQuestions {
    constructor(id, title, description, questions) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.questions = questions;
    }

    static async getEmptyQuestionBank(callback) {
        return new QuestionBankWithQuestions(null, "asd", null, []);
    }

    static async getById(id, callback) {
        try {
            const questionBank = await QuestionBankDAL.getById(id);

            const { title, description } = questionBank[0];

            const questions = await QuestionsDAL.getQuestionsByQuestionBankId(id);

            const parsedQuestions = Object.values(JSON.parse(JSON.stringify(questions)));

            return new QuestionBankWithQuestions(id, title, description, parsedQuestions);
        } catch (error) {
            console.error("ERR");
            throw error;
        }
    }
}

export default QuestionBankWithQuestions;
