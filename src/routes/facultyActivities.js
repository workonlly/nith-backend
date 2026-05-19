const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// ==================================================
// TABLE 1: faculties_activities_heading (Singleton)
// Operations: GET, PUT
// ==================================================

// GET /api/faculty-activities/ — fetch heading
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculties_activities_heading ORDER BY id ASC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({ title_en: '', title_hn: '', sub_title_en: '', sub_title_hn: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /faculty-activities error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/faculty-activities/ — update or create heading
router.put('/', async (req, res) => {
  try {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    const check = await pool.query('SELECT id FROM faculties_activities_heading LIMIT 1');

    let result;
    if (check.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO faculties_activities_heading (title_en, title_hn, sub_title_en, sub_title_hn) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn]
      );
    } else {
      const id = check.rows[0].id;
      result = await pool.query(
        `UPDATE faculties_activities_heading 
         SET title_en = $1, title_hn = $2, sub_title_en = $3, sub_title_hn = $4 
         WHERE id = $5 RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn, id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /faculty-activities error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================================================
// TABLE 2: faculties_activities_subtext (Multiple rows)
// Operations: GET, POST, PUT, DELETE
// ==================================================

// GET /api/faculty-activities/subtext — fetch all subtexts
router.get('/subtext', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculties_activities_subtext ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /faculty-activities/subtext error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/faculty-activities/subtext — add new subtext
router.post('/subtext', async (req, res) => {
  try {
    const { heading_en, heading_hn, subheading_en, subheading_hn, small_text } = req.body;
    const result = await pool.query(
      `INSERT INTO faculties_activities_subtext (heading_en, heading_hn, subheading_en, subheading_hn, small_text) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [heading_en, heading_hn, subheading_en, subheading_hn, small_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /faculty-activities/subtext error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/faculty-activities/subtext/:id — update a subtext
router.put('/subtext/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { heading_en, heading_hn, subheading_en, subheading_hn, small_text } = req.body;
    const result = await pool.query(
      `UPDATE faculties_activities_subtext 
       SET heading_en = $1, heading_hn = $2, subheading_en = $3, subheading_hn = $4, small_text = $5 
       WHERE id = $6 RETURNING *`,
      [heading_en, heading_hn, subheading_en, subheading_hn, small_text, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtext not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /faculty-activities/subtext/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/faculty-activities/subtext/:id — delete a subtext
router.delete('/subtext/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM faculties_activities_subtext WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtext not found' });
    }
    res.json({ message: 'Subtext deleted successfully' });
  } catch (err) {
    console.error('DELETE /faculty-activities/subtext/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
