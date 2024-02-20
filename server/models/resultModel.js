const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questions: [
    {
      questionId: { type: String},
      answer: { type: Number}, 
    },
  ],
  totalScore: { type: Number,  default: 0 },
  correctCount: { type: Number,  default: 0 },
  incorrectCount: { type: Number, default: 0 },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
