const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const History = require('../models/historyModel');

// Route to get history
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const userId = req.id;
    const history = await History.find({ userId });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});
// All history
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
// Route to add history
router.post('/add', auth, async (req, res) => {
  try {
    const { resultId, languageId } = req.body;
    const userId = req.id; 

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
router.delete('/:historyId', auth, async (req, res) => {
  try {
    const historyId = req.params.resultId;

    const history = await History.findByIdAndDelete(historyId);

    if (!history) {
      return res.status(404).json({ msg: 'History entry not found' });
    }

    res.status(200).json({ msg: 'History entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
