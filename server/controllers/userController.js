// /controllers/userController.js
const { User, generatePIN, generateAccountNumber } = require("../models/User");
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const upload = multer({ dest: 'uploads/' });

const signup = async (req, res) => {
  console.log("Signup function called");
  console.log("Request body:", req.body);
  try {
    const { fullname, email, tel, password, image } = req.body;

    // Validate request data
    if (!fullname || !email || !tel || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Generate unique PIN and account number for the user
    const pin = await generatePIN();
    const accountNumber = await generateAccountNumber();

    // Create a new user instance
    const newUser = new User({
      fullname,
      email,
      tel,
      password,
      image,
      pin,
      accountNumber,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return response with user data (excluding sensitive information)
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,  // Include the _id field
        fullname: savedUser.fullname,
        email: savedUser.email,
        tel: savedUser.tel,
        pin: savedUser.pin,
        accountNumber: savedUser.accountNumber,
        currentBalance: savedUser.currentBalance,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Error creating user" });
  }
};


// Image upload controller
const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.body.userId;
    console.log('Received user ID:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const imagePath = `${baseUrl}/uploads/${req.file.filename}`;

    // Verify file exists
    await fs.access(path.join(__dirname, '..', 'uploads', req.file.filename));

    user.image = imagePath;
    await user.save();

    res.json({ message: 'Image uploaded successfully', image: user.image });
  } catch (error) {
    console.error('Error in uploadUserImage:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};


// Exporting the controller functions
module.exports = { signup,
  uploadUserImage,
  upload
 };
