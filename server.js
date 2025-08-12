const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// CORS Setup
// =====================
const allowedOrigins = [
  'http://localhost:3000',               // Local frontend
  'https://rd-form-builder.vercel.app'   // Production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., server-to-server or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// =====================
// Body parsers
// =====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// =====================
// Session setup (for Passport)
// =====================
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
}));

// =====================
// Passport config
// =====================
require('./backend/config/passport');
app.use(passport.initialize());
app.use(passport.session());

// =====================
// MongoDB Connection
// =====================
mongoose.connect(process.env.REACT_APP_MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =====================
// Routes
// =====================
app.get('/', (req, res) => {
  res.send('🚀 Backend is up and running!');
});

// Auth routes
app.use('/', require('./backend/routes/auth'));   // Google OAuth routes
app.use('/', require('./backend/routes/forms'));  // Form routes

// Add these headers to your backend responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

const authMiddleware = require('./backend/middleware/auth');
app.get('/middleware/auth', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// =====================
// Error handling middleware
// =====================
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

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
