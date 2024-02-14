import DAL from '../../DAL/question/question.mjs';

class Question {
    constructor(id, questionTitle, questionAnswerA, questionAnswerB, questionAnswerC, questionAnswerD,
                questionCorrectAnswer, questionBankId, questionTypeId) {
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
            console.error('Err');
            throw error;
        }
    }
}

module.exports = Question;