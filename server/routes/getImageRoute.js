/**
 * @swagger
 * tags:
 *   name: File Uploads
 *   description: API operations related to file uploads
 */

/**
 * @swagger
 * /uploads/{filename}:
 *   get:
 *     tags: [File Uploads]
 *     summary: Get a specific uploaded image by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the image.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             example:
 *               message: Image not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

const express = require("express");
const router = express.Router();
const path = require("path");

router.use('/', express.static(path.join(__dirname, '../uploads')));

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;

  res.type('image/jpeg');

  res.sendFile(path.join(__dirname, '../uploads', filename));
});

module.exports = router;
