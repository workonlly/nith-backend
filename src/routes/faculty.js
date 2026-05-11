// routes/faculty.js
const express = require('express');
const db = require('../db/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Get all faculty (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, faculty_id, name, email, department FROM faculty');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's role assignments (protected)
router.get('/my-roles', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        fra.id, fra.start_date, fra.end_date, fra.role_email, fra.role_phone, fra.is_active,
        rp.title AS position_title, rp.priority_number,
        c.name AS category_name
      FROM faculty_role_assignment fra
      JOIN role_position rp ON fra.position_id = rp.id
      JOIN category c ON fra.category_id = c.id
      WHERE fra.faculty_id = $1 AND fra.is_active = true
      ORDER BY rp.priority_number
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
