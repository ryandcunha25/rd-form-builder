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
mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Backend is up and running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
