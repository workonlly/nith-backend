const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all city info, cards, descriptions, and page info
exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_city_info ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM about_city ORDER BY id DESC LIMIT 1');
    const cards = await sql.query('SELECT * FROM about_city_info_cards ORDER BY id ASC');
    const descriptions = await sql.query('SELECT * FROM about_city_descriptions ORDER BY id ASC');

    res.json({
      success: true,
      data: data.rows,
      page: page.rows[0] || {},
      cards: cards.rows,
      descriptions: descriptions.rows,
    });
  } catch (error) {
    console.error('Error fetching about city:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM about_city ORDER BY id DESC LIMIT 1');
    const cards = await sql.query('SELECT * FROM about_city_info_cards ORDER BY id ASC');
    const descriptions = await sql.query('SELECT * FROM about_city_descriptions ORDER BY id ASC');
    res.json({ success: true, data: page.rows[0] || {}, cards: cards.rows, descriptions: descriptions.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE page details
exports.updatePage = async (req, res) => {
  try {
    const {
      heading_en, heading_hi, introduction_en, introduction_hi,
      overview_title_en, overview_title_hi, overview_subtitle_en, overview_subtitle_hi
    } = req.body;

    const check = await sql.query('SELECT id FROM about_city ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE about_city 
         SET heading_en=$1, heading_hi=$2, introduction_en=$3, introduction_hi=$4,
             overview_title_en=$5, overview_title_hi=$6, overview_subtitle_en=$7, overview_subtitle_hi=$8,
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$9 RETURNING *`,
        [
          heading_en, heading_hi, introduction_en, introduction_hi,
          overview_title_en, overview_title_hi, overview_subtitle_en, overview_subtitle_hi,
          check.rows[0].id
        ]
      );
    } else {
      result = await sql.query(
        `INSERT INTO about_city (
           heading_en, heading_hi, introduction_en, introduction_hi,
           overview_title_en, overview_title_hi, overview_subtitle_en, overview_subtitle_hi
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          heading_en, heading_hi, introduction_en, introduction_hi,
          overview_title_en, overview_title_hi, overview_subtitle_en, overview_subtitle_hi
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
    const data = await sql.query('SELECT * FROM about_nith_city_info WHERE id = $1', [id]);
    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// CREATE city info item
exports.create = async (req, res) => {
  try {
    const { icon, title_en, title_hi, description_en, description_hi, image_url } = req.body;
    const result = await sql.query(
      'INSERT INTO about_nith_city_info (icon, title_en, title_hi, description_en, description_hi, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [icon || 'Landmark', title_en, title_hi || title_en, description_en, description_hi || description_en, image_url || '']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE city info item
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title_en, title_hi, description_en, description_hi, image_url } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_city_info SET icon=$1, title_en=$2, title_hi=$3, description_en=$4, description_hi=$5, image_url=$6 WHERE id=$7 RETURNING *',
      [icon || 'Landmark', title_en, title_hi, description_en, description_hi, image_url || '', id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// DELETE city info item
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_city_info WHERE id = $1 RETURNING *', [id]);
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
