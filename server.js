const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares - Configure these FIRST
app.use(cors({
  origin: 'http://localhost:3000', // or whatever your frontend port is
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Increase payload size limit - THIS MUST COME BEFORE ROUTES
app.use(express.json({ limit: '50mb' }));  // For JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // For URL-encoded data

// Connect to MongoDB
mongoose.connect(process.env.REACT_APP_MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Backend is up and running!');
});

// Import routes
const formRoutes = require('./backend/routes/forms');

// Apply routes - NO express.raw() here unless specifically needed for file uploads
app.use('/', formRoutes);

// Error handling middleware (add this at the end)
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large. Maximum allowed size is 50MB'
    });
  }
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});