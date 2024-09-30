//server/Models/transaction.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from the uuid package

// Define the schema for transactions
const transactionSchema = new mongoose.Schema({
  sender: {
    accountNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Validate 10-digit account number
        },
        message: props => `${props.value} is not a valid sender account number!`
      }
    },
    fullname: {
      type: String,
      required: true
    }
  },
  recipient: {
    accountNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Validate 10-digit account number
        },
        message: props => `${props.value} is not a valid recipient account number!`
      }
    },
    fullname: {
      type: String,
      required: true
    }
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: props => `${props.value} is not a valid transaction amount!`
    }
  },
  currency: {
    type: String,
    required: true,
    default: 'NGR'
  },
  transferMethod: {
    type: String,
    required: true,
    enum: ['instant', 'scheduled', 'international']
  },
  memo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true,
    default: function() {
      return new mongoose.Types.ObjectId(); // Generate a new transaction ID
    }
  },
  sessionId: {
    type: String,
    required: true,
    default: uuidv4 // Generate a UUID for sessionId when a new transaction is created
  },
  type: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;