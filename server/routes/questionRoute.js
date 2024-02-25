const express = require("express");
const QuestionModel = require("../models/questionModel");
const auth = require("../middleware/auth.middleware");
const access = require("../middleware/access.middleware");

const questionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API operations related to questions
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     tags: [Questions]
 *     summary: Get questions based on filters
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: The level of the questions.
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: The language of the questions.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               msg: [ {question1}, {question2} ]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
questionRouter.get("/", async (req, res) => {
    try {
        const { level, lang } = req.query;
        const filter = {};

        if (level) {
            filter.level = level;
        }

        if (lang) {
            filter.languageName = lang;
        }

        const question = await QuestionModel.find(filter);
        res.status(200).send({ "msg": question });
    } catch (error) {
        res.status(500).send({ "msg": error.message });
        console.log(error.message);
    }
});


/**
 * @swagger
 * /questions/create:
 *   post:
 *     tags: [Questions]
 *     summary: Create a new question
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "code"
 *             languageName: "JavaScript"
 *             description: "What is the meaning of life?"
 *             code: "console.log('42');"
 *             answerIndex: 0
 *             options: ["42", "24", "Undefined"]
 *             level: "easy"
 *     responses:
 *       201:
 *         description: New question created successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
questionRouter.post("/create", auth, access("Admin"), async (req, res) => {
  try {
    const question = new QuestionModel(req.body);
    await question.save();
    res.status(201).send({ msg: "New question has been created" });
  } catch (error) {
    res.status(500).send("Internal Error");
    console.log("Error while creating new question : ", error.message);
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     tags: [Questions]
 *     summary: Delete a question by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to be deleted.
 *     responses:
 *       201:
 *         description: Question deleted successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
questionRouter.delete("/:id", auth, access("Admin"), async (req, res) => {
  try {
    const questionID = req.params.id;
    await QuestionModel.findByIdAndDelete(questionID);
    res
      .status(201)
      .send({ msg: `Question with id : ${questionID} has been deleted` });
  } catch (error) {
    res.status(500).send("Internal Error");
    console.log("Error while creating new question : ", error.message);
  }
});

/**
 * @swagger
 * /questions/update/{id}:
 *   patch:
 *     tags: [Questions]
 *     summary: Update a question by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to be updated.
 *     responses:
 *       201:
 *         description: Question updated successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
questionRouter.patch("/update/:id", auth, access("Admin"), async (req, res) => {
  try {
    const questionID = req.params.id;
    await QuestionModel.findByIdAndUpdate(questionID);
    res
      .status(201)
      .send({ msg: `Question with id : ${questionID} has been updated` });
  } catch (error) {
    res.status(500).send("Internal Error");
    console.log("Error while creating new question : ", error.message);
  }
});

module.exports = questionRouter;


