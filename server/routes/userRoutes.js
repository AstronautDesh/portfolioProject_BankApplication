//routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt'); 
const router = express.Router();
const { signup } = require('../controllers/userController');
const { User } = require('../models/User'); 
const logger = require('../utils/logger'); // Import the logger
const { uploadUserImage } = require('../controllers/userController'); // Importing the controller and upload middleware
//const { protect } = require('../middleware/authMiddleware'); // Assuming you have authentication middleware
const upload = require('../config/multer_config');  


// POST /signup - Register a new user
router.post('/signup', signup);

// POST route to upload user image
router.post('/upload-image', upload.single('image'), uploadUserImage);

// POST /check-user - Check if a user exists
router.post('/check-user', async (req, res) => {
  const { type, inputValue } = req.body;

  try {
    let user;
    if (type === 'PIN') {
      user = await User.findOne({ pin: inputValue });
    } else if (type === 'Password') {
      user = await User.findOne({ password: inputValue });
    }

    if (user) {
      logger.info(`User found for type ${type}: ${inputValue}`);
      res.json({ success: true, user });
    } else {
      logger.info(`User not found for type ${type}: ${inputValue}`);
      res.json({ success: false });
    }
  } catch (error) {
    logger.error(`Error checking user: ${error.message}`);
    res.status(500).json({ error: 'Error checking user' });
  }
});


// POST /login - Authenticate user using PIN or Password
router.post('/login', async (req, res) => {
  const { pin, accountNumber, password } = req.body;

  // Ensure that either PIN or both Account Number and Password are provided
  if (!pin && (!accountNumber || !password)) {
    logger.warn('Login attempt failed: No PIN or Account Number and Password provided');
    return res.status(400).json({ error: 'Please provide either PIN or both Account Number and Password' });
  }

  try {
    let user;

    // If PIN is provided, find user by PIN
    if (pin) {
      logger.info(`Login attempt using PIN: ${pin}`);
      user = await User.findOne({ pin });

      // If user is not found, return an error
      if (!user) {
        logger.warn(`User not found for PIN: ${pin}`);
        return res.status(404).json({ error: 'User not found' });
      }
    }

    // If Account Number and Password are provided, find user by Account Number and verify Password
    if (accountNumber && password) {
      logger.info(`Login attempt using Account Number: ${accountNumber}`);
      user = await User.findOne({ accountNumber });

      // If user is not found by Account Number, return an error
      if (!user) {
        logger.warn(`User not found for Account Number: ${accountNumber}`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn('Password does not match');
        return res.status(400).json({ error: 'Invalid password' });
      }
    }

    console.log("User data being sent to Redux:", {
      //_id: user._id.toString(),
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      tel: user.tel,
      pin: user.pin,
      accountNumber: user.accountNumber,
      currentBalance: user.currentBalance,
      image: user.image,
    });

    // If user is found and authentication is successful, return user details
    logger.info('Login successful');
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        tel: user.tel,
        pin: user.pin,
        accountNumber: user.accountNumber,
        currentBalance: user.currentBalance,
        image: user.image,
      },
    });
  } catch (err) {
    logger.error(`Error logging in user: ${err.message}`);
    res.status(500).json({ error: 'Error logging in user' });
  }
});



module.exports = router;