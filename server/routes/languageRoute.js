const express = require('express');
const router = express.Router();
const Language = require('../models/languageModel');
const uploadMiddleware = require('../middleware/uploadImage');

router.get('/', async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.get('/:languageId', async (req, res) => {
  const { languageId } = req.params;

  try {
    const language = await Language.find({_id : languageId });

    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.post('/add', uploadMiddleware('languageImage'), async (req, res) => {
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
    console.error('Error:', error);
    res.status(400).json({ error: 'Bad Request' });
  }
});


module.exports = router;
