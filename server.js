const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

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
app.use('/', formRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});


// {
//     "title": "THE TITLE",
//     "_id": "68974ae40c265de7bcd70618",
//     "questions": [],
//     "createdAt": "2025-08-09T13:19:32.790Z",
//     "updatedAt": "2025-08-09T13:19:32.792Z",
//     "__v": 0
// }