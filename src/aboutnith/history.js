const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all history timeline data and main page info
exports.getAll = async (req, res) => {
  try {
    const timeline = await sql.query('SELECT * FROM about_nith_timeline ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM aboutnith_history ORDER BY id DESC LIMIT 1');
    const detailedTimeline = await sql.query('SELECT * FROM aboutnith_history_timeline ORDER BY id ASC');

    res.json({
      success: true,
      data: timeline.rows,
      page: page.rows[0] || {},
      detailedTimeline: detailedTimeline.rows,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM aboutnith_history ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: page.rows[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE page details
exports.updatePage = async (req, res) => {
  try {
    const { description1_en, description2_en, legacy_en, description1_hi, description2_hi, legacy_hi } = req.body;
    const check = await sql.query('SELECT id FROM aboutnith_history ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE aboutnith_history 
         SET description1_en=$1, description2_en=$2, legacy_en=$3, description1_hi=$4, description2_hi=$5, legacy_hi=$6, updated_at=CURRENT_TIMESTAMP 
         WHERE id=$7 RETURNING *`,
        [description1_en, description2_en, legacy_en, description1_hi, description2_hi, legacy_hi, check.rows[0].id]
      );
    } else {
      result = await sql.query(
        `INSERT INTO aboutnith_history (description1_en, description2_en, legacy_en, description1_hi, description2_hi, legacy_hi)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [description1_en, description2_en, legacy_en, description1_hi, description2_hi, legacy_hi]
      );
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sql.query('SELECT * FROM about_nith_timeline WHERE id = $1', [id]);
    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// CREATE timeline event
exports.create = async (req, res) => {
  try {
    const { year, title_en, title_hi, description_en, description_hi, event_date, subtitle_en, subtitle_hi } = req.body;
    
    // Insert into about_nith_timeline
    const result = await sql.query(
      'INSERT INTO about_nith_timeline (year, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [year, title_en, title_hi || title_en, description_en, description_hi || description_en]
    );

    // Also sync to aboutnith_history_timeline
    const page = await sql.query('SELECT id FROM aboutnith_history ORDER BY id DESC LIMIT 1');
    if (page.rows.length > 0) {
      await sql.query(
        `INSERT INTO aboutnith_history_timeline (reference_id, year, event_date, subtitle_en, title_en, description_en, subtitle_hi, title_hi, description_hi)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [page.rows[0].id, year, event_date || year, subtitle_en || '', title_en, description_en, subtitle_hi || subtitle_en || '', title_hi || title_en, description_hi || description_en]
      );
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE timeline event
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_timeline SET year=$1, title_en=$2, title_hi=$3, description_en=$4, description_hi=$5 WHERE id=$6 RETURNING *',
      [year, title_en, title_hi, description_en, description_hi, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// DELETE timeline event
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_timeline WHERE id = $1 RETURNING *', [id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

router.get('/page', exports.getPage);
router.put('/page', exports.updatePage);
router.get('/', exports.getAll);
router.get('/:id', exports.getById);
router.post('/', exports.create);
router.put('/:id', exports.update);
router.delete('/:id', exports.remove);

module.exports = router;
