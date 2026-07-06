const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// ==========================================
// 1. Heading Endpoints
// ==========================================

// GET /api/alumni-assist - Fetch heading and note information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_assist_heading ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('GET /api/alumni-assist error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/alumni-assist - Upsert heading and note information
router.put('/', async (req, res) => {
  const {
    title_en,
    title_hn,
    sub_title_en,
    sub_title_hn,
    note_title_en,
    note_title_hn,
    note_desc_en,
    note_desc_hn,
    fees_title_en,
    fees_title_hn
  } = req.body;

  try {
    const check = await pool.query('SELECT id FROM alumni_assist_heading');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE alumni_assist_heading 
         SET title_en = $1, title_hn = $2, sub_title_en = $3, sub_title_hn = $4, 
             note_title_en = $5, note_title_hn = $6, note_desc_en = $7, note_desc_hn = $8,
             fees_title_en = $9, fees_title_hn = $10 
         WHERE id = $11 RETURNING *`,
        [
          title_en,
          title_hn,
          sub_title_en,
          sub_title_hn,
          note_title_en,
          note_title_hn,
          note_desc_en,
          note_desc_hn,
          fees_title_en,
          fees_title_hn,
          check.rows[0].id
        ]
      );
    } else {
      result = await pool.query(
        `INSERT INTO alumni_assist_heading (
          title_en, title_hn, sub_title_en, sub_title_hn, 
          note_title_en, note_title_hn, note_desc_en, note_desc_hn,
          fees_title_en, fees_title_hn
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          title_en,
          title_hn,
          sub_title_en,
          sub_title_hn,
          note_title_en,
          note_title_hn,
          note_desc_en,
          note_desc_hn,
          fees_title_en,
          fees_title_hn
        ]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-assist error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// 2. Procedures Endpoints
// ==========================================

// GET /api/alumni-assist/procedures - Fetch all procedure steps
router.get('/procedures', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_assist_procedures ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/alumni-assist/procedures error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/alumni-assist/procedures - Add a new procedure step
router.post('/procedures', async (req, res) => {
  const { section_title_en, section_title_hn, step_order, step_text_en, step_text_hn } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO alumni_assist_procedures (section_title_en, section_title_hn, step_order, step_text_en, step_text_hn) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [section_title_en, section_title_hn, step_order, step_text_en, step_text_hn]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/alumni-assist/procedures error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/alumni-assist/procedures/:id - Update an existing procedure step
router.put('/procedures/:id', async (req, res) => {
  const { id } = req.params;
  const { section_title_en, section_title_hn, step_order, step_text_en, step_text_hn } = req.body;
  try {
    const result = await pool.query(
      `UPDATE alumni_assist_procedures 
       SET section_title_en = $1, section_title_hn = $2, step_order = $3, step_text_en = $4, step_text_hn = $5 
       WHERE id = $6 RETURNING *`,
      [section_title_en, section_title_hn, step_order, step_text_en, step_text_hn, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-assist/procedures/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/alumni-assist/procedures/:id - Delete a procedure step
router.delete('/procedures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alumni_assist_procedures WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/alumni-assist/procedures/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// 3. Fees Endpoints
// ==========================================

// GET /api/alumni-assist/fees - Fetch all fee items
router.get('/fees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_assist_fees ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/alumni-assist/fees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/alumni-assist/fees - Add a new fee item
router.post('/fees', async (req, res) => {
  const { sl_no, name_en, name_hn, fee } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO alumni_assist_fees (sl_no, name_en, name_hn, fee) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sl_no, name_en, name_hn, fee]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/alumni-assist/fees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/alumni-assist/fees/:id - Update an existing fee item
router.put('/fees/:id', async (req, res) => {
  const { id } = req.params;
  const { sl_no, name_en, name_hn, fee } = req.body;
  try {
    const result = await pool.query(
      `UPDATE alumni_assist_fees 
       SET sl_no = $1, name_en = $2, name_hn = $3, fee = $4 
       WHERE id = $5 RETURNING *`,
      [sl_no, name_en, name_hn, fee, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-assist/fees/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/alumni-assist/fees/:id - Delete a fee item
router.delete('/fees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alumni_assist_fees WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/alumni-assist/fees/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
