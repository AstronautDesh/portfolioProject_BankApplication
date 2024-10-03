// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
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

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static placeholder images (if any)
app.use('/uploads/placeholder', express.static(path.join(__dirname, 'uploads/placeholder')));


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

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});