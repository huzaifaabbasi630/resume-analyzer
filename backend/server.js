const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const resume = require('./routes/resume');
const ai = require('./routes/ai');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/resume', resume);
app.use('/api/ai', ai);

// Root route
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API is running...');
});

// Error handler middleware
app.use(errorHandler);

// IMPORTANT: export app for serverless (Vercel)
module.exports = app;