const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all connectivity data and page info
exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_connectivity_modes ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM connectivity_page ORDER BY id DESC LIMIT 1');

    res.json({
      success: true,
      data: data.rows,
      page: page.rows[0] || {},
    });
  } catch (error) {
    console.error('Error fetching connectivity:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM connectivity_page ORDER BY id DESC LIMIT 1');
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
      travel_options_label_en, travel_options_label_hi, travel_options_heading_en, travel_options_heading_hi, travel_options_subtitle_en, travel_options_subtitle_hi
    } = req.body;

    const check = await sql.query('SELECT id FROM connectivity_page ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE connectivity_page 
         SET hero_heading_en=$1, hero_heading_hi=$2, hero_description_en=$3, hero_description_hi=$4,
             travel_options_label_en=$5, travel_options_label_hi=$6, travel_options_heading_en=$7, travel_options_heading_hi=$8, travel_options_subtitle_en=$9, travel_options_subtitle_hi=$10,
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$11 RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          travel_options_label_en, travel_options_label_hi, travel_options_heading_en, travel_options_heading_hi, travel_options_subtitle_en, travel_options_subtitle_hi,
          check.rows[0].id
        ]
      );
    } else {
      result = await sql.query(
        `INSERT INTO connectivity_page (
           hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
           travel_options_label_en, travel_options_label_hi, travel_options_heading_en, travel_options_heading_hi, travel_options_subtitle_en, travel_options_subtitle_hi
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          travel_options_label_en, travel_options_label_hi, travel_options_heading_en, travel_options_heading_hi, travel_options_subtitle_en, travel_options_subtitle_hi
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
    const data = await sql.query('SELECT * FROM about_nith_connectivity_modes WHERE id = $1', [id]);
    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// CREATE connectivity mode
exports.create = async (req, res) => {
  try {
    const { icon, title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi, travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi } = req.body;
    const result = await sql.query(
      `INSERT INTO about_nith_connectivity_modes (
        icon, title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi,
        travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        icon || 'Bus', title_en, title_hi || title_en, nearest_point_en, nearest_point_hi || nearest_point_en, distance_en, distance_hi || distance_en,
        travel_time_en, travel_time_hi || travel_time_en, services_en, services_hi || services_en, additional_info_en, additional_info_hi || additional_info_en
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE connectivity mode
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi, travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi } = req.body;
    const result = await sql.query(
      `UPDATE about_nith_connectivity_modes 
       SET icon=$1, title_en=$2, title_hi=$3, nearest_point_en=$4, nearest_point_hi=$5, distance_en=$6, distance_hi=$7,
           travel_time_en=$8, travel_time_hi=$9, services_en=$10, services_hi=$11, additional_info_en=$12, additional_info_hi=$13
       WHERE id=$14 RETURNING *`,
      [
        icon || 'Bus', title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi,
        travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi, id
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// DELETE connectivity mode
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_connectivity_modes WHERE id = $1 RETURNING *', [id]);
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
