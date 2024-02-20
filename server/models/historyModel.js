const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  resultId: { type: String,  required: true },
  date: { type: Date, default: Date.now, required: true },
  languageId: { type: String, required: true },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
