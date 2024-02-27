const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  resultTitle: {
    type: String,
    default: "pending"
  },
  userId: { type: String, required: true },
  questions: [{ type: String }], 
  answers: [{ type: String }], 
  correctAnswers: [{ type: String }], 
  totalScore: { type: Number, default: 0 },
  correctCount: { type: String, default: 0 },
  incorrectCount: { type: String, default: 0 },
  date: { type: Date, default: Date.now }
},{
  versionKey : false 
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;


