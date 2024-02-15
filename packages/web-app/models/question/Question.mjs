import DAL from "../../DAL/question/question.mjs";
import QuestionBankWithQuestions from "./QuestionBankWithQuestions.mjs";

class Question {
    constructor(
        id,
        questionTitle,
        questionAnswerA,
        questionAnswerB,
        questionAnswerC,
        questionAnswerD,
        questionCorrectAnswer,
        questionBankId,
        questionTypeId,
    ) {
        this.id = id;
        this.questionTitle = questionTitle;
        this.questionAnswerA = questionAnswerA;
        this.questionAnswerB = questionAnswerB;
        this.questionAnswerC = questionAnswerC;
        this.questionAnswerD = questionAnswerD;
        this.questionCorrectAnswer = questionCorrectAnswer;
        this.questionTypeId = questionTypeId;
    }

    static async getAllByQuestionBankId(questionBankId, callback) {
        try {
            const result = await DAL.getQuestionsByQuestionBankId(questionBankId);

            if (result.length === 0) {
                return null;
            }

            return result;
        } catch (error) {
            console.error("Err");
            throw error;
        }
    }

    static async updateQuestion(question, questionBankId, createUser) {
        try {
            DAL.updateQuestion(question, questionBankId, createUser);
        } catch (error) {
            console.error("Err");
            throw error;
        }
    }

    static async insertQuestion(question, questionBankId, createUser) {
        try {
            DAL.insertQuestion(question, questionBankId, createUser);
        } catch (error) {
            console.error("Err");
            throw error;
        }
    }
}

export default Question;
