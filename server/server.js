require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

// Import routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Import Winston Logger
const logger = require('./utils/logger'); // Import the logger

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the React app
}));
app.use(morgan('common'));

// MongoDB connection
mongoose.connect(process.env.DB_URL)
  .then(() => {
    logger.info('MongoDB connection successful');
    logger.info('Connected to database:', mongoose.connection.name);
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/users', transactionRoutes);

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
