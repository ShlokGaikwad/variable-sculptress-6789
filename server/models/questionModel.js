const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title : {
    type : String ,
    enum:["code","theory","codeblock"]
  },
  questionID: {
    type: String,
    required: true,
    unique: true
  },
  languageName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  answerIndex: {
    type: Number,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  level : {
    type : String ,
    enum : ["easy","medium","hard"]
  },
   code : {
    type : String
  }
},{
    versionKey : false
});

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
