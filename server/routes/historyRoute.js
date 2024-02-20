const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const History = require('../models/historyModel');

// Route to get history
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await History.find({ userId });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to add history
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { resultId, languageId } = req.body;
    const userId = req.user.id; 

    const newHistory = new History({
      userId,
      resultId,
      languageId,
    });

    await newHistory.save();
    res.status(201).json({ msg: 'History entry added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to delete history
router.delete('/:resultId', authMiddleware, async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.user.id;

    const history = await History.findOne({ resultId, userId });

    if (!history) {
      return res.status(404).json({ msg: 'History entry not found' });
    }

    await history.remove();
    res.status(200).json({ msg: 'History entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
