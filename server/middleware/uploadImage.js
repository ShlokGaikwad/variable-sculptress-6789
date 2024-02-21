const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Error uploading file' });
    } else if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    req.imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/'); // Replace backslashes with forward slashes

    next();
  });
};

module.exports = uploadMiddleware;
