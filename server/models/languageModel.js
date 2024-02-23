const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  languageTitle: { type: String, required: true },
  languageImage: { type: String, required: true },
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
