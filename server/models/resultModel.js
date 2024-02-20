const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  quizId: { type: String, required: true },
  questions: [
    {
      questionId: { type: String, required: true },
      answer: { type: Number, required: true }, 
    },
  ],
  totalScore: { type: Number, required: true , default: 0 },
  correctCount: { type: Number, required: true,  default: 0 },
  incorrectCount: { type: Number, required: true,  default: 0 },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
