const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('profilePic'), (req, res) => {
  try {
    const filePath = req.file.path;
    
    // Convert backslashes to forward slashes for proper URL format
    const forwardSlashPath = filePath.replace(/\\/g, '/');
    
    res.status(200).json({ message: 'File uploaded successfully', filePath: forwardSlashPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
