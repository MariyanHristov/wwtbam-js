import { query } from "../../mysql.mjs";

const DAL = {
    getAllQuestionTypes: function () {
        return query("SELECT * FROM question_types");
    },
};

export default DAL;
