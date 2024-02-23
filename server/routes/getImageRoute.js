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
