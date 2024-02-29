const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Result = require('../models/resultModel');
const access = require("../middleware/access.middleware");


/**
 * @swagger
 * tags:
 *   name: Results
 *   description: API operations related to quiz results
 */

/**
 * @swagger
 * /results/{userId}:
 *   get:
 *     tags: [Results]
 *     summary: Get quiz results by user ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to get quiz results for.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - result1
 *               - result2
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
router.get('/:userId', auth, access("Admin" , "User") ,async (req, res) => {
  try {
    const userId = req.id;
    console.log(userId)
    const results = await Result.find({ userId });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});


/**
 * @swagger
 * /results:
 *   get:
 *     tags: [Results]
 *     summary: Get all quiz results
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - result1
 *               - result2
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
router.get('/', auth,access("Admin" , "User") , async (req, res) => {
    try {
      const results = await Result.find({ });
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });

// Route to add result

/**
 * @swagger
 * /results/add:
 *   post:
 *     tags: [Results]
 *     summary: Add a new quiz result
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             questions: [{}]
 *             totalScore: 100
 *             correctCount: 10
 *             incorrectCount: 5
 *     responses:
 *       201:
 *         description: Quiz result added successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
router.post('/add', auth,access("Admin" , "User") , async (req, res) => {
  try {
    const {questions, totalScore, correctCount, incorrectCount , languageName } = req.body;
    const userId = req.id; // From jwt auth middleware
    console.log(userId)
    console.log("sfgsf");
    const newResult = new Result({
      userId, ...req.body
    });

    const savedResult = await newResult.save();
    res.status(201).json({ msg: 'Quiz result added successfully', result: savedResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to delete result
/**
 * @swagger
 * /results/{resultId}:
 *   delete:
 *     tags: [Results]
 *     summary: Delete a quiz result by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz result to be deleted.
 *     responses:
 *       200:
 *         description: Quiz result deleted successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
router.delete('/:resultId', auth, access("Admin" , "User") , async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.id;

    const result = await Result.findOne({ _id: resultId });

    if (!result) {
      return res.status(404).json({ msg: 'Quiz result not found' });
    } 

    await result.deleteOne();
    res.status(200).json({ msg: 'Quiz result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

/**
 * @swagger
 * /results/update:
 *   patch:
 *     tags: [Results]
 *     summary: Update a quiz result
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             resultId: "resultId"
 *             questionId: "questionId"
 *             answer: 1
 *             correctCount: 1
 *             incorrectCount: 1
 *     responses:
 *       200:
 *         description: Quiz result updated successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Internal Server Error
 */
router.patch('/update', async (req, res) => {
  try {
    const { resultId, questionId, answer, correctCount, incorrectCount } = req.body;
    const userId = req.id; 

    const result = await Result.findOneAndUpdate(
      { _id: resultId}, // Check if questionId exists in the array :, 'questions.questionId': questionId 
      {
        $set: {
          'questions.$.answer': answer,
        },
        $inc: {
          correctCount: correctCount,
          incorrectCount: incorrectCount,
        },
      },
      { new: true }
    );
    console.log('resultId:', resultId);
    console.log('questionId:', questionId);
    console.log('Update Result:', result);
    if (!result) {
      console.log('Quiz result not found or questionId not found in the array');
      return res.status(404).json({ msg: 'Quiz result not found or questionId not found in the array' });
    }

    console.log('Quiz result updated successfully');
    res.status(200).json({ msg: 'Quiz result updated successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});


module.exports = router;


