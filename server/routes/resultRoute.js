const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Result = require('../models/resultModel');

// Route to get user's quiz results
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ userId }).populate('quizId');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { quizId, questions, totalScore, correctCount, incorrectCount } = req.body;
    const userId = req.user.id; // from auth jwt middleware

    const newResult = new Result({
      resultId: generateUniqueResultId(), // You need to implement a function to generate unique result IDs
      userId,
      quizId,
      questions,
      totalScore,
      correctCount,
      incorrectCount,
      // Add other fields as needed
    });

    await newResult.save();
    res.json({ msg: 'Quiz result added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to delete a quiz result by resultId
router.delete('/:resultId', authMiddleware, async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.user.id;

    // Check if the result belongs to the authenticated user
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

// Function to generate a unique result ID (you may use a more robust method)
function generateUniqueResultId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = router;
