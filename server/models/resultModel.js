const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  resultTitle: {
    type: String,
    enum: ["perfect", "good", "pending", "average", "poor"],
    default: "pending"
  },
  userId: { type: String, required: true },
  questions: [{ type: String }], // Array of strings for questions
  answers: [{ type: String }],   // Array of strings for answers
  correctAnswers: [{ type: String }], 
  totalScore: { type: Number, default: 0 },
  correctCount: { type: String, default: 0 },
  incorrectCount: { type: String, default: 0 },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;


