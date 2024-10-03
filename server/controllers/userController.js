// /controllers/userController.js
const { User, generatePIN, generateAccountNumber } = require("../models/User");
const path = require('path');
const fs = require('fs');
const { upload } = require('../config/multer_config');

const uploadUserImage = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the previous image, if any
    if (user.image) {
      const oldImagePath = path.join(__dirname, '..', user.image);
      if (fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      }
    }

    // Update user's image field with the new image's path
    const newImagePath = `/uploads/${req.file.filename}`;
    user.image = newImagePath;
    await user.save();

    console.log('New image uploaded:', newImagePath);
    return res.json({ success: true, imagePath: user.image });
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid image path', details: error.message });
    }
    return res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
};

// Delete user image controller
const deleteUserImage = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('Deleting image for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.image) {
      console.log('Image selected for delete:', user.image);
      const imagePath = path.join(__dirname, '..', user.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
        console.log('Image file deleted:', imagePath);
      }
    }

    // Update user's image field in the database to null
    user.image = '';
    await user.save();

    console.log('Image successfully deleted for user:', userId);
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Image deletion failed', details: error.message });
  }
};

// Serve the user’s image
const serverUserImage = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('Fetching image for user:', userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.image) {
      // If user has no image, send the placeholder
      return res.sendFile(path.join(__dirname, '..', 'uploads', 'placeholder', 'placeholder.jpg'));
    }
    
    const imagePath = path.join(__dirname, '..', user.image);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      // If image file doesn't exist, send the placeholder
      return res.sendFile(path.join(__dirname, '..', 'uploads', 'placeholder', 'placeholder.jpg'));
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
};


// Signup controller
const signup = async (req, res) => {
  console.log("Signup function called");
  console.log("Request body:", req.body);

  try {
    const { fullname, email, tel, password, image } = req.body;

    // Check if required fields are filled
    if (!fullname || !email || !tel || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullname,
      email,
      tel,
      password,
      image
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    console.log('User created successfully:', savedUser);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        tel: savedUser.tel,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Error creating user" });
  }
};

// Export controllers
module.exports = {
  signup,
  uploadUserImage,
  deleteUserImage,
  serverUserImage,
  upload
};
