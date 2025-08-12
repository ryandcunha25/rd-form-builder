const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

router.post('auth/google/token', async (req, res) => {
  try {
    const { token } = req.body;
    
    // 1. Validate input
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing Google token' 
      });
    }

    // 2. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    });
    
    const { sub: googleId, email, name, picture, email_verified } = ticket.getPayload();

    if (!email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    // 3. Find or create user (atomic operation)
    const user = await User.findOneAndUpdate(
      { $or: [{ googleId }, { email }] },
      {
        $setOnInsert: {
          googleId,
          name,
          email,
          avatar: picture,
          provider: 'google'
        },
        $set: {
          lastLogin: new Date(),
          avatar: picture
        }
      },
      { 
        upsert: true,
        new: true,
        runValidators: true 
      }
    );

    // 4. Generate JWT
    const appToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Secure response
    res.cookie('auth_token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar 
      }
    });

  } catch (err) {
    console.error('Google auth error:', err);
    
    const message = err.message.includes('Token used too late') 
      ? 'Expired Google token - please sign in again'
      : 'Authentication failed';

    return res.status(401).json({ 
      success: false,
      message 
    });
  }
});

module.exports = router;