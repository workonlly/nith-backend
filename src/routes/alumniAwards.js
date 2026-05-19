const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 1. GET all Awards Initiatives page data in a single request (highly optimized for frontend rendering)
router.get('/', async (req, res) => {
  try {
    const headingRes = await db.query('SELECT * FROM alumni_award_heading LIMIT 1');
    const categoriesRes = await db.query('SELECT * FROM alumni_award_categories ORDER BY id ASC');
    const initiativesRes = await db.query('SELECT * FROM alumni_award_initiatives ORDER BY id ASC');
    const eligibilityRes = await db.query('SELECT * FROM alumni_award_eligibility ORDER BY id ASC');
    const benefitsRes = await db.query('SELECT * FROM alumni_award_benefits ORDER BY id ASC');

    const heading = headingRes.rows.length > 0 ? headingRes.rows[0] : null;

    res.json({
      heading,
      categories: categoriesRes.rows,
      initiatives: initiativesRes.rows,
      eligibility: eligibilityRes.rows,
      benefits: benefitsRes.rows
    });
  } catch (err) {
    console.error('Error fetching all alumni awards data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. PUT update page headings & copy
router.put('/heading', async (req, res) => {
  const fields = [
    'title_en', 'title_hn', 'sub_title_en', 'sub_title_hn',
    'about_title_en', 'about_title_hn', 'about_desc_en', 'about_desc_hn',
    'join_title_en', 'join_title_hn', 'join_desc_en', 'join_desc_hn',
    'join_btn1_en', 'join_btn1_hn', 'join_btn2_en', 'join_btn2_hn',
    'inquiries_text_en', 'inquiries_text_hn'
  ];

  try {
    const check = await db.query('SELECT id FROM alumni_award_heading LIMIT 1');
    if (check.rows.length > 0) {
      const setClause = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f]);
      values.push(check.rows[0].id);

      await db.query(`
        UPDATE alumni_award_heading SET
          ${setClause}
        WHERE id = $${values.length}
      `, values);
    } else {
      const colNames = fields.map(f => `"${f}"`).join(', ');
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f]);

      await db.query(`
        INSERT INTO alumni_award_heading (${colNames})
        VALUES (${placeholders})
      `, values);
    }
    res.json({ success: true, message: 'Alumni awards headings updated successfully' });
  } catch (err) {
    console.error('Error updating alumni awards headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- CATEGORIES ---
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_award_categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/categories', async (req, res) => {
  const { title_en, title_hn, description_en, description_hn, icon } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_award_categories (title_en, title_hn, description_en, description_hn, icon)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [title_en, title_hn, description_en, description_hn, icon]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { title_en, title_hn, description_en, description_hn, icon } = req.body;
  try {
    await db.query(`
      UPDATE alumni_award_categories SET
        title_en = $1, title_hn = $2, description_en = $3, description_hn = $4, icon = $5
      WHERE id = $6
    `, [title_en, title_hn, description_en, description_hn, icon, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_award_categories WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- INITIATIVES ---
router.get('/initiatives', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_award_initiatives ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/initiatives', async (req, res) => {
  const { name_en, name_hn, initiated_by_en, initiated_by_hn, year_introduced, frequency_en, frequency_hn, description_en, description_hn } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_award_initiatives (
        name_en, name_hn, initiated_by_en, initiated_by_hn, year_introduced, frequency_en, frequency_hn, description_en, description_hn
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [name_en, name_hn, initiated_by_en, initiated_by_hn, year_introduced, frequency_en, frequency_hn, description_en, description_hn]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/initiatives/:id', async (req, res) => {
  const { id } = req.params;
  const { name_en, name_hn, initiated_by_en, initiated_by_hn, year_introduced, frequency_en, frequency_hn, description_en, description_hn } = req.body;
  try {
    await db.query(`
      UPDATE alumni_award_initiatives SET
        name_en = $1, name_hn = $2, initiated_by_en = $3, initiated_by_hn = $4, year_introduced = $5,
        frequency_en = $6, frequency_hn = $7, description_en = $8, description_hn = $9
      WHERE id = $10
    `, [name_en, name_hn, initiated_by_en, initiated_by_hn, year_introduced, frequency_en, frequency_hn, description_en, description_hn, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/initiatives/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_award_initiatives WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- ELIGIBILITY ---
router.get('/eligibility', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_award_eligibility ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/eligibility', async (req, res) => {
  const { step, title_en, title_hn, points_en, points_hn } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_award_eligibility (step, title_en, title_hn, points_en, points_hn)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [step, title_en, title_hn, points_en, points_hn]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/eligibility/:id', async (req, res) => {
  const { id } = req.params;
  const { step, title_en, title_hn, points_en, points_hn } = req.body;
  try {
    await db.query(`
      UPDATE alumni_award_eligibility SET
        step = $1, title_en = $2, title_hn = $3, points_en = $4, points_hn = $5
      WHERE id = $6
    `, [step, title_en, title_hn, points_en, points_hn, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/eligibility/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_award_eligibility WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- BENEFITS ---
router.get('/benefits', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_award_benefits ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/benefits', async (req, res) => {
  const { title_en, title_hn, description_en, description_hn, icon } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_award_benefits (title_en, title_hn, description_en, description_hn, icon)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [title_en, title_hn, description_en, description_hn, icon]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/benefits/:id', async (req, res) => {
  const { id } = req.params;
  const { title_en, title_hn, description_en, description_hn, icon } = req.body;
  try {
    await db.query(`
      UPDATE alumni_award_benefits SET
        title_en = $1, title_hn = $2, description_en = $3, description_hn = $4, icon = $5
      WHERE id = $6
    `, [title_en, title_hn, description_en, description_hn, icon, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/benefits/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_award_benefits WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
