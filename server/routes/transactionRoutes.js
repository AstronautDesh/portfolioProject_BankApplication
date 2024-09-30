// server/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route for fetching recipient name based on account number
router.get('/recipient-name/:accountNumber', transactionController.getRecipientName);

// Route for submitting a transaction
router.post('/submit-transaction', transactionController.processTransaction);

// Route for fetching the latest transaction
router.get('/latest-transaction', transactionController.getLatestTransaction);

// Route for fetching transactions by account number
router.get('/transactions/:accountNumber', transactionController.getTransactionsByAccountNumber);

// Route for fetching all transactions (if needed, otherwise can be omitted)
router.get('/all-transactions', transactionController.getTransactions);

module.exports = router;