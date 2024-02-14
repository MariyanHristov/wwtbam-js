import DAL from "../../DAL/question/questionType.mjs";

class QuestionType {
    constructor(id, type_title) {
        this.id = id;
        this.typeTitle = type_title;
    }

    static async getAllQuestionTypes(callback) {
        try {
            const result = await DAL.getAllQuestionTypes();

            if (result.length === 0) {
                return null;
            }

            return result;
        } catch (error) {
            console.error("Err");
            throw error;
        }
    }
}
