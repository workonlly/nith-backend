const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all core values and page data
exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_core_values ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM core_values_page ORDER BY id DESC LIMIT 1');
    const practices = await sql.query('SELECT * FROM practice_paragraphs ORDER BY id ASC');

    res.json({
      success: true,
      data: data.rows,
      page: page.rows[0] || {},
      practices: practices.rows,
    });
  } catch (error) {
    console.error('Error fetching core values:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM core_values_page ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: page.rows[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE page details
exports.updatePage = async (req, res) => {
  try {
    const {
      hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
      pillars_label_en, pillars_label_hi, pillars_heading_en, pillars_heading_hi, pillars_subtitle_en, pillars_subtitle_hi,
      practice_label_en, practice_label_hi, practice_heading_en, practice_heading_hi, practice_subtitle_en, practice_subtitle_hi
    } = req.body;

    const check = await sql.query('SELECT id FROM core_values_page ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE core_values_page 
         SET hero_heading_en=$1, hero_heading_hi=$2, hero_description_en=$3, hero_description_hi=$4,
             pillars_label_en=$5, pillars_label_hi=$6, pillars_heading_en=$7, pillars_heading_hi=$8, pillars_subtitle_en=$9, pillars_subtitle_hi=$10,
             practice_label_en=$11, practice_label_hi=$12, practice_heading_en=$13, practice_heading_hi=$14, practice_subtitle_en=$15, practice_subtitle_hi=$16,
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$17 RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          pillars_label_en, pillars_label_hi, pillars_heading_en, pillars_heading_hi, pillars_subtitle_en, pillars_subtitle_hi,
          practice_label_en, practice_label_hi, practice_heading_en, practice_heading_hi, practice_subtitle_en, practice_subtitle_hi,
          check.rows[0].id
        ]
      );
    } else {
      result = await sql.query(
        `INSERT INTO core_values_page (
           hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
           pillars_label_en, pillars_label_hi, pillars_heading_en, pillars_heading_hi, pillars_subtitle_en, pillars_subtitle_hi,
           practice_label_en, practice_label_hi, practice_heading_en, practice_heading_hi, practice_subtitle_en, practice_subtitle_hi
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          pillars_label_en, pillars_label_hi, pillars_heading_en, pillars_heading_hi, pillars_subtitle_en, pillars_subtitle_hi,
          practice_label_en, practice_label_hi, practice_heading_en, practice_heading_hi, practice_subtitle_en, practice_subtitle_hi
        ]
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
    const data = await sql.query('SELECT * FROM about_nith_core_values WHERE id = $1', [id]);
    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// CREATE core value
exports.create = async (req, res) => {
  try {
    const { icon, title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql.query(
      'INSERT INTO about_nith_core_values (icon, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [icon || 'ShieldCheck', title_en, title_hi || title_en, description_en, description_hi || description_en]
    );

    const page = await sql.query('SELECT id FROM core_values_page ORDER BY id DESC LIMIT 1');
    if (page.rows.length > 0) {
      await sql.query(
        'INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5)',
        [page.rows[0].id, title_en, title_hi || title_en, description_en, description_hi || description_en]
      );
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE core value
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_core_values SET icon=$1, title_en=$2, title_hi=$3, description_en=$4, description_hi=$5 WHERE id=$6 RETURNING *',
      [icon || 'ShieldCheck', title_en, title_hi, description_en, description_hi, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// DELETE core value
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_core_values WHERE id = $1 RETURNING *', [id]);
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
