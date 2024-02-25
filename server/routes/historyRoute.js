const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const History = require('../models/historyModel');

/**
 * @swagger
 * tags:
 *   name: History
 *   description: API operations related to user history
 */

/**
 * @swagger
 * /history/user/{userId}:
 *   get:
 *     tags: [History]
 *     summary: Get user's history by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - userId: "123"
 *                 resultId: "456"
 *                 languageId: "789"
 *                 date: "2022-02-25T10:30:00.000Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Server Error
 */
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

/**
 * @swagger
 * /history:
 *   get:
 *     tags: [History]
 *     summary: Get all user histories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - userId: "123"
 *                 resultId: "456"
 *                 languageId: "789"
 *                 date: "2022-02-25T10:30:00.000Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Server Error
 */
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

/**
 * @swagger
 * /history/add:
 *   post:
 *     tags: [History]
 *     summary: Add a new history entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             resultId: "456"
 *             languageId: "789"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: History entry added successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Server Error
 */
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
/**
 * @swagger
 * /history/{historyId}:
 *   delete:
 *     tags: [History]
 *     summary: Delete a history entry by ID
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the history entry.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History entry deleted successfully
 *       404:
 *         description: History entry not found
 *         content:
 *           application/json:
 *             example:
 *               msg: History entry not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               msg: Server Error
 */
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
