// server/models/User.js
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// User schema definition
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.length >= 3,
      message: (props) => `${props.value} is not a valid fullname!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  tel: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{11}/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.length >= 8,
      message: (props) => `${props.value} is not a valid password!`,
    },
  },
  image: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (v === '') return true;
        return validator.isURL(v) || /^\/uploads\/.*/.test(v);
      },
      message: props => `${props.value} is not a valid image path or URL!`,
    },
  },
  pin: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^\d{4}$/.test(v),
      message: (props) => `${props.value} is not a valid PIN!`,
    },
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v), // Validate 10-digit number
      message: (props) => `${props.value} is not a valid account number!`,
    },
    default: async function () {
      return await generateAccountNumber(); // Use the function to generate the account number
    },
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 200000.00,
    validate: {
      validator: (v) => v >= 0,
      message: (props) => `${props.value} is not a valid current balance!`,
    },
  },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ tel: 1 });
userSchema.index({ pin: 1 });
userSchema.index({ accountNumber: 1 });

// Function to generate a random PIN with retry logic
const generatePIN = async () => {
  let pin;
  let retries = 0;
  try {
    do {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      retries++;
    } while (await User.exists({ pin }) && retries < 10);
    return pin;
  } catch (error) {
    console.error('Error generating PIN:', error);
    throw error;
  }
};

// Function to generate a unique account number with retry logic
const generateAccountNumber = async () => {
  let accountNumber;
  let retries = 0;
  try {
    do {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number
      retries++;
    } while (await User.exists({ accountNumber }) && retries < 10);
    return accountNumber;
  } catch (error) {
    console.error('Error generating account number:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = { User, generatePIN, generateAccountNumber };