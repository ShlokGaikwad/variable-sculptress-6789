const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log(`File name is : ${file.originalname}`);
    cb(null, fileName);
  },
});

const createMulterInstance = (imageKey) => {
  return multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      cb(null, true);
    },
  }).single(imageKey);
};

const uploadMiddleware = (imageKey) => {
  return (req, res, next) => {
    const upload = createMulterInstance(imageKey);

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Error uploading file' });
      } else if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      // Check if req.file exists before accessing its properties
      if (req.file) {
        console.log("req.file",req.file);
        req.imagePath = path.join('uploads', req.file.filename);
      }

      next();
    });
  };
};

module.exports = uploadMiddleware;
