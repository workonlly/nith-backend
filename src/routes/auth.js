// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Login - email only
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if faculty exists with this email
    const result = await db.query(
      'SELECT id, faculty_id, name, email, department FROM faculty WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email not found. Only registered faculty can access.' });
    }

    const faculty = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        id: faculty.id,
        faculty_id: faculty.faculty_id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: faculty.id,
        faculty_id: faculty.faculty_id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, faculty_id, name, email, department FROM faculty WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token (optional - for frontend to check if token is valid)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
