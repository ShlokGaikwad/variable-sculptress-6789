// quizUtils.js
const QuestionModel = require('./models/questionModel'); // Adjust the path accordingly

async function getQuizQuestions() {
    try {
        const questions = await QuestionModel.find({ languageName: "python" }).exec();
        return questions;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        return [];
    }
}

module.exports = { getQuizQuestions };
