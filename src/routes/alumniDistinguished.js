const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// ==========================================
// 1. Heading Endpoints
// ==========================================

// GET /api/alumni-distinguished - Fetch page heading
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_distinguished_heading ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('GET /api/alumni-distinguished error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/alumni-distinguished - Upsert page heading
router.put('/', async (req, res) => {
  const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
  try {
    const check = await pool.query('SELECT id FROM alumni_distinguished_heading');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE alumni_distinguished_heading 
         SET title_en = $1, title_hn = $2, sub_title_en = $3, sub_title_hn = $4 
         WHERE id = $5 RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO alumni_distinguished_heading (title_en, title_hn, sub_title_en, sub_title_hn) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-distinguished error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// 2. Distinguished Alumni List Endpoints
// ==========================================

// GET /api/alumni-distinguished/list - Fetch all distinguished alumni records
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_distinguished_list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/alumni-distinguished/list error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/alumni-distinguished/list - Add a new alumnus record
router.post('/list', async (req, res) => {
  const { name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO alumni_distinguished_list (name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/alumni-distinguished/list error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/alumni-distinguished/list/:id - Update an existing alumnus record
router.put('/list/:id', async (req, res) => {
  const { id } = req.params;
  const { name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin } = req.body;
  try {
    const result = await pool.query(
      `UPDATE alumni_distinguished_list 
       SET name_en = $1, name_hn = $2, batch_en = $3, batch_hn = $4, photo = $5, achievement_en = $6, achievement_hn = $7, department_en = $8, department_hn = $9, linkedin = $10 
       WHERE id = $11 RETURNING *`,
      [name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-distinguished/list/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/alumni-distinguished/list/:id - Delete an alumnus record
router.delete('/list/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alumni_distinguished_list WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/alumni-distinguished/list/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
