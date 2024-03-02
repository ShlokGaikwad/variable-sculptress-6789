const express = require("express");
const router = express.Router();
const Language = require("../models/languageModel");
const uploadMiddleware = require("../middleware/uploadImage");

/**
 * @swagger
 * tags:
 *   name: Language
 *   description: API operations related to languages
 */

/**
 * @swagger
 * /languages:
 *   get:
 *     tags: [Language]
 *     summary: Get all languages
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - _id: "123"
 *                 languageTitle: "JavaScript"
 *                 languageImage: "path/to/image.jpg"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /languages/{languageId}:
 *   get:
 *     tags: [Language]
 *     summary: Get language by ID
 *     parameters:
 *       - in: path
 *         name: languageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the language.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - _id: "123"
 *                 languageTitle: "JavaScript"
 *                 languageImage: "path/to/image.jpg"
 *       404:
 *         description: Language not found
 *         content:
 *           application/json:
 *             example:
 *               error: Language not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.get("/:languageId", async (req, res) => {
  const { languageId } = req.params;

  try {
    const language = await Language.find({ _id: languageId });

    if (!language) {
      return res.status(404).json({ error: "Language not found" });
    }

    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/filter/:languageTitle', async (req, res) => {
  const { languageTitle } = req.params;

  try {
    const languages = await Language.find({ languageTitle });

    if (!languages || languages.length === 0) {
      return res.status(404).json({ error: 'No languages found' });
    }

    res.status(200).json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /languages/add:
 *   post:
 *     tags: [Language]
 *     summary: Add a new language
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             languageTitle: "Python"
 *             languageImage: "path/to/python-image.jpg"
 *     responses:
 *       201:
 *         description: Language added successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 */
router.post("/add", uploadMiddleware("languageImage"), async (req, res) => {
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
    console.error("Error:", error);
    res.status(400).json({ error: "Bad Request" });
  }
});

module.exports = router;
