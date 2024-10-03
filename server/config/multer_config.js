const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/User');

// Multer storage configuration
// Configures multer to store files in the 'uploads/' folder and ensures unique filenames by appending a timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName); // Append timestamp to avoid file name clashes
  }
});

// Initializes the upload middleware
const upload = multer({ storage });


const deletePreviousImage = async (userId) => {
  console.log('Attempting to delete previous image for user:', userId);
  try {
    const user = await User.findById(userId);
    if (user && user.image) {
      fs.unlink(user.image, (err) => {
        if (err) {
          console.error('Failed to delete old image:', err);
        } else {
          console.log('Old image deleted successfully:', user.image);
        }
      });
    } else {
      console.log('No previous image found for user');
    }
  } catch (error) {
    console.error('Error finding user:', error);
  }
};

// ... rest of the file remains the same ...

// File validation
// Ensures that only image files are allowed (JPEG, PNG, GIF, etc.)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/; // Define acceptable file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Error: Images only!')); // Reject non-image files
  }
};

module.exports = { upload, deletePreviousImage, fileFilter };
