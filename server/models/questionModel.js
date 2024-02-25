const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      enum: ["code", "theory", "codeblock"],
    },
    languageName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    answerIndex: {
      type: Number,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
  },
  {
    versionKey: false,
  }
);

const QuestionModel = mongoose.model("Question", questionSchema);

module.exports = QuestionModel;
