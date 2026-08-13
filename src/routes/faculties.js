const express = require('express');
const crypto = require('crypto');
const db = require('../db/db');

const router = express.Router();

// Get all faculties
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faculties_table ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new faculty
router.post('/', async (req, res) => {
  const {
    name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
    department_en, department_hi, email, phone_no,
    since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
  } = req.body;
  const faculty_id = req.body.faculty_id || ('FAC-' + crypto.randomUUID().split('-')[0].toUpperCase());
  try {
    const result = await db.query(
      `INSERT INTO faculties_table (
        name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
        department_en, department_hi, email, phone_no, faculty_id,
        since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        name_en || '', name_hi || '', role_en || '', role_hi || '', designation_en || '', designation_hi || '',
        department_en || '', department_hi || '', email || '', phone_no || '', faculty_id || '',
        since_date_en || '', since_date_hi || '', end_date_en || '', end_date_hi || '', status || '', tag || ''
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update faculty
router.put('/:faculty_id', async (req, res) => {
  const { faculty_id } = req.params;
  const {
    name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
    department_en, department_hi, email, phone_no,
    since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE faculties_table SET
        name_en = $1, name_hi = $2, role_en = $3, role_hi = $4,
        designation_en = $5, designation_hi = $6, department_en = $7, department_hi = $8,
        email = $9, phone_no = $10, since_date_en = $11, since_date_hi = $12,
        end_date_en = $13, end_date_hi = $14, status = $15, tag = $16,
        updated_at = CURRENT_TIMESTAMP
       WHERE faculty_id = $17 RETURNING *`,
      [
        name_en || '', name_hi || '', role_en || '', role_hi || '', designation_en || '', designation_hi || '',
        department_en || '', department_hi || '', email || '', phone_no || '',
        since_date_en || '', since_date_hi || '', end_date_en || '', end_date_hi || '', status || '', tag || '',
        faculty_id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete faculty
router.delete('/:faculty_id', async (req, res) => {
  const { faculty_id } = req.params;
  try {
    const result = await db.query('DELETE FROM faculties_table WHERE faculty_id = $1 RETURNING *', [faculty_id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
