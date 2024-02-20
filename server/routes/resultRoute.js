const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Result = require('../models/resultModel');
const access = require("../middleware/access.middleware");

// Route to get results
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
router.post('/add', auth,access("Admin" , "User") , async (req, res) => {
  try {
    const {questions, totalScore, correctCount, incorrectCount } = req.body;
    const userId = req.id; // From jwt auth middleware
    console.log(userId)
    console.log("sfgsf");
    const newResult = new Result({
      userId,
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
router.delete('/:resultId', auth, access("Admin" , "User") , async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.id;

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

router.patch('/update', auth, access("Admin" , "User") , async (req, res) => {
    try {
      const { resultId, questionId, answer } = req.body;
      const userId = req.id; // From jwt authmiddleware
  
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
