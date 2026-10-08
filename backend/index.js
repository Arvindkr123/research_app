const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const researchRoutes = require('./routes/researchRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Routes
app.use('/api/research', researchRoutes);
app.use('/api/research', libraryRoutes); // Library routes share the same base path

// Global Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
