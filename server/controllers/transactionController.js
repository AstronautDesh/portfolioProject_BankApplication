// server/controllers/transactionController.js
const { User } = require('../models/User');
const Transaction = require('../models/Transaction');

// Utility function to handle errors
const handleError = (res, message, status = 500) => {
  console.error(message);
  return res.status(status).json({ message });
};

// Controller to process the transaction
const processTransaction = async (req, res) => {
  console.log('Submit Transaction Route Hit');

  try {
    const {
      senderAccountNumber,
      recipientAccountNumber,
      fullname,
      amount,
      currency,
      transferMethod,
      memo,
    } = req.body;

    // Log the received request body to ensure all fields are being passed correctly
    console.log('Received Transaction Details:', req.body);

    // Check if any required fields are missing
    if (!senderAccountNumber || !recipientAccountNumber || !fullname || !amount || !currency || !transferMethod) {
      console.log('Missing required fields');
      return handleError(res, 'Missing required transaction details', 400);
    }
    if (!senderAccountNumber || !recipientAccountNumber || !fullname || !amount || !currency || !transferMethod) {
      console.log('Missing field:', { senderAccountNumber, recipientAccountNumber, fullname, amount, currency, transferMethod });
      return handleError(res, 'Missing required transaction details', 400);
    }
    

    // Log the search for recipient and sender
    console.log('Searching for recipient with account number:', recipientAccountNumber);
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    console.log('Recipient found:', recipient ? recipient.fullname : 'Recipient not found');

    console.log('Searching for sender with account number:', senderAccountNumber);
    const sender = await User.findOne({ accountNumber: senderAccountNumber });
    console.log('Sender found:', sender ? sender.fullname : 'Sender not found');

    // Error handling for non-existent users
    if (!recipient) {
      console.log('Recipient not found');
      return handleError(res, 'Recipient not found', 404);
    }
    if (!sender) {
      console.log('Sender not found');
      return handleError(res, 'Sender not found', 404);
    }

    // Check for sufficient balance
    if (sender.currentBalance < amount) {
      console.log('Insufficient balance:', sender.currentBalance, 'Requested amount:', amount);
      return handleError(res, 'Insufficient balance', 400);
    }

    // Log balance updates for both sender and recipient
    console.log('Deducting amount from sender:', sender.currentBalance, 'New balance:', sender.currentBalance - amount);
    sender.currentBalance -= amount;

    console.log('Adding amount to recipient:', recipient.currentBalance, 'New balance:', recipient.currentBalance + amount);
    recipient.currentBalance += amount;

    // Save updated balances
    await sender.save();
    await recipient.save();

    // Log transaction creation
    console.log('Creating new transaction record');
    await Transaction.create({
      sender: {
        accountNumber: sender.accountNumber,
        fullname: sender.fullname,
      },
      recipient: {
        accountNumber: recipient.accountNumber,
        fullname: recipient.fullname,
      },
      amount,
      currency,
      transferMethod,
      memo,
      type: 'sent', // You might want to adjust the type based on your logic
    });

    console.log('Transaction processed successfully');
    return res.status(200).json({ message: 'Transaction successful' });
  } catch (error) {
    // Log the error to understand what happened
    console.error('Error processing transaction:', error);
    return handleError(res, 'Error processing transaction', 500);
  }
};

// Controller to fetch recipient name based on account number
const getRecipientName = async (req, res) => {
  console.log('Recipient Name Route Hit');
  try {
    const { accountNumber } = req.params;
    console.debug(`Searching for recipient with account number: ${accountNumber}`);

    // Find the user with the given account number
    const user = await User.findOne({ accountNumber });

    if (user) {
      console.debug('Recipient found:', user.fullname);
      res.json({ fullname: user.fullname });
    } else {
      console.debug('Recipient not found');
      res.status(404).json({ message: 'Recipient not found' });
    }
  } catch (error) {
    console.error('Error fetching recipient name:', error);
    res.status(500).json({ message: 'Internal Server Error' });
}
};

// Get latest transaction data
const getLatestTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne().sort({ createdAt: -1 }).select({
      'recipient.fullname': 1,
      'recipient.accountNumber': 1,
      transactionId: 1,
      sessionId: 1,
      createdAt: 1,
    });

    if (!transaction) return handleError(res, 'No transaction found', 404);

    return res.json({
      recipientFullName: transaction.recipient.fullname,
      recipientAccountNumber: transaction.recipient.accountNumber,
      transactionId: transaction.transactionId,
      sessionId: transaction.sessionId,
      transactionTime: transaction.createdAt,
    });
  } catch (error) {
    return handleError(res, 'Error fetching transaction data');
  }
};

// Controller to fetch transactions involving a given account number
const getTransactionsByAccountNumber = async (req, res) => {
  console.log('Received request params:', req.params);
  const { accountNumber } = req.params;

  if (!accountNumber) {
    console.log('Account number is missing');
    return handleError(res, 'Account number is required', 400);
  }

  console.log('Fetching transactions for account:', accountNumber);

  try {
    const transactions = await Transaction.find({
      $or: [
        { 'sender.accountNumber': accountNumber },
        { 'recipient.accountNumber': accountNumber },
      ],
    });

    console.log('Found transactions:', transactions.length);

    const formattedTransactions = transactions.map((transaction) => {
      const isSender = transaction.sender.accountNumber === accountNumber;
      return {
        type: isSender ? 'sent' : 'received',
        otherParty: isSender ? transaction.recipient : transaction.sender,
        transactionId: transaction.transactionId,
        sessionId: transaction.sessionId,
        transactionTime: transaction.createdAt,
        amount: transaction.amount,
        currency: transaction.currency,
        transferMethod: transaction.transferMethod,
        memo: transaction.memo,
        status: transaction.status
      };
    });

    console.log('Formatted transactions:', formattedTransactions.length);
    return res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error('Error in getTransactionsByAccountNumber:', error);
    return handleError(res, 'Error fetching transaction data');
  }
};


const getTransactions = async (req, res) => {
  try {
      const transactions = await Transaction.find({});
      res.status(200).json(transactions);
  } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Server error while fetching transactions' });
  }
};

// Export the functions
module.exports = {
  getRecipientName,
  processTransaction,
  getLatestTransaction,
  getTransactionsByAccountNumber,
  getTransactions
};
