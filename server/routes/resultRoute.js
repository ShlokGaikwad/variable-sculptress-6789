const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Result = require('../models/resultModel');

// Route to get results
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ userId });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to add result
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { quizId, questions, totalScore, correctCount, incorrectCount } = req.body;
    const userId = req.user.id; // From jwt auth middelware

    const newResult = new Result({
      userId,
      quizId,
      questions,
      totalScore,
      correctCount,
      incorrectCount,
    });

    const savedResult = await newResult.save();
    res.json({ msg: 'Quiz result added successfully', result: savedResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to delete result
router.delete('/:resultId', authMiddleware, async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.user.id;

    const result = await Result.findOne({ _id: resultId, userId });

    if (!result) {
      return res.status(404).json({ msg: 'Quiz result not found' });
    }

    await result.remove();
    res.json({ msg: 'Quiz result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
