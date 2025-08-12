// routes/auth.js
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// POST /auth/google/token
// Body: { token: '<id_token_from_google>' }
router.post('/auth/google/token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Missing token' });

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // contains sub, email, name, picture, etc.
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      // If user with same email exists (signed up earlier), attach googleId
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        avatar: picture,
        provider: 'google'
      });
    } else if (!user.googleId) {
      // Existing email-only user -> attach googleId
      user.googleId = googleId;
      user.avatar = user.avatar || picture;
      await user.save();
    }

    // Create app JWT
    const appToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      token: appToken
    });
  } catch (err) {
    console.error('Google token verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
