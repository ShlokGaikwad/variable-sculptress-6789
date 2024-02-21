const express = require('express');
const router = express.Router();
const Language = require('../models/languageModel');
const uploadMiddleware = require('../middleware/uploadImage');

router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.get('/languages/:languageId', async (req, res) => {
  const { languageId } = req.params;

  try {
    const language = await Language.findOne({ languageId });

    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.post('/languages', uploadMiddleware, async (req, res) => {
  const { languageTitle } = req.body;
  const languageImage = req.imagePath;

  try {
    const newLanguage = new Language({
      languageTitle,
      languageImage,
    });

    await newLanguage.save();

    res.status(201).json(newLanguage); 
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

module.exports = router;
