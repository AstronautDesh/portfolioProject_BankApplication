const multer = require('multer');
const path = require('path');

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where the uploaded files will be stored
  },
  filename: (req, file, cb) => {
    // Ensure the file has a unique name by appending the current timestamp
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  // Only accept certain file types (e.g., images)
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;