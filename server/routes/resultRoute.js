const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Result = require('../models/resultModel');

// Route to get results
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ userId });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to add result
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { quizId, questions, totalScore, correctCount, incorrectCount } = req.body;
    const userId = req.user.id; // From jwt auth middleware

    const newResult = new Result({
      userId,
      quizId,
      questions,
      totalScore,
      correctCount,
      incorrectCount,
    });

    const savedResult = await newResult.save();
    res.status(201).json({ msg: 'Quiz result added successfully', result: savedResult });
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
    res.status(200).json({ msg: 'Quiz result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.patch('/update', authMiddleware, async (req, res) => {
    try {
      const { resultId, questionId, answer } = req.body;
      const userId = req.user.id; // From jwt authmiddleware
  
      // questions field is an array of objects with questionId and answer
      const result = await Result.findOneAndUpdate(
        { _id: resultId, userId, 'questions.questionId': questionId },
        {
          $set: {
            'questions.$.answer': answer,
          },
        },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({ msg: 'Quiz result not found' });
      }
  
      res.status(200).json({ msg: 'Quiz result updated successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });

module.exports = router;
