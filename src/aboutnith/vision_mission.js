const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all vision mission data and pillars
exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_missions ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM vision_mission ORDER BY id DESC LIMIT 1');
    const stats = await sql.query('SELECT * FROM vision_mission_legacy_stats ORDER BY id ASC');

    res.json({
      success: true,
      data: data.rows,
      page: page.rows[0] || {},
      stats: stats.rows,
    });
  } catch (error) {
    console.error('Error fetching vision mission:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM vision_mission ORDER BY id DESC LIMIT 1');
    const stats = await sql.query('SELECT * FROM vision_mission_legacy_stats ORDER BY id ASC');
    res.json({ success: true, data: page.rows[0] || {}, stats: stats.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE page details
exports.updatePage = async (req, res) => {
  try {
    const {
      guiding_principles_heading_en, guiding_principles_heading_hi,
      guiding_principles_description_en, guiding_principles_description_hi,
      vision_heading_en, vision_heading_hi,
      vision_subtitle_en, vision_subtitle_hi,
      vision_description_en, vision_description_hi,
      strategic_objectives_heading_en, strategic_objectives_heading_hi,
      mission_heading_en, mission_heading_hi,
      mission_subtitle_en, mission_subtitle_hi,
      tagline_en, tagline_hi,
      tagline_description_en, tagline_description_hi,
      legacy_heading_en, legacy_heading_hi,
      legacy_subheading_en, legacy_subheading_hi
    } = req.body;

    const check = await sql.query('SELECT id FROM vision_mission ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE vision_mission 
         SET guiding_principles_heading_en=$1, guiding_principles_heading_hi=$2,
             guiding_principles_description_en=$3, guiding_principles_description_hi=$4,
             vision_heading_en=$5, vision_heading_hi=$6,
             vision_subtitle_en=$7, vision_subtitle_hi=$8,
             vision_description_en=$9, vision_description_hi=$10,
             strategic_objectives_heading_en=$11, strategic_objectives_heading_hi=$12,
             mission_heading_en=$13, mission_heading_hi=$14,
             mission_subtitle_en=$15, mission_subtitle_hi=$16,
             tagline_en=$17, tagline_hi=$18,
             tagline_description_en=$19, tagline_description_hi=$20,
             legacy_heading_en=$21, legacy_heading_hi=$22,
             legacy_subheading_en=$23, legacy_subheading_hi=$24,
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$25 RETURNING *`,
        [
          guiding_principles_heading_en, guiding_principles_heading_hi,
          guiding_principles_description_en, guiding_principles_description_hi,
          vision_heading_en, vision_heading_hi,
          vision_subtitle_en, vision_subtitle_hi,
          vision_description_en, vision_description_hi,
          strategic_objectives_heading_en, strategic_objectives_heading_hi,
          mission_heading_en, mission_heading_hi,
          mission_subtitle_en, mission_subtitle_hi,
          tagline_en, tagline_hi,
          tagline_description_en, tagline_description_hi,
          legacy_heading_en, legacy_heading_hi,
          legacy_subheading_en, legacy_subheading_hi,
          check.rows[0].id
        ]
      );
    } else {
      result = await sql.query(
        `INSERT INTO vision_mission (
           guiding_principles_heading_en, guiding_principles_heading_hi,
           guiding_principles_description_en, guiding_principles_description_hi,
           vision_heading_en, vision_heading_hi,
           vision_subtitle_en, vision_subtitle_hi,
           vision_description_en, vision_description_hi,
           strategic_objectives_heading_en, strategic_objectives_heading_hi,
           mission_heading_en, mission_heading_hi,
           mission_subtitle_en, mission_subtitle_hi,
           tagline_en, tagline_hi,
           tagline_description_en, tagline_description_hi,
           legacy_heading_en, legacy_heading_hi,
           legacy_subheading_en, legacy_subheading_hi
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`,
        [
          guiding_principles_heading_en, guiding_principles_heading_hi,
          guiding_principles_description_en, guiding_principles_description_hi,
          vision_heading_en, vision_heading_hi,
          vision_subtitle_en, vision_subtitle_hi,
          vision_description_en, vision_description_hi,
          strategic_objectives_heading_en, strategic_objectives_heading_hi,
          mission_heading_en, mission_heading_hi,
          mission_subtitle_en, mission_subtitle_hi,
          tagline_en, tagline_hi,
          tagline_description_en, tagline_description_hi,
          legacy_heading_en, legacy_heading_hi,
          legacy_subheading_en, legacy_subheading_hi
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
    const data = await sql.query('SELECT * FROM about_nith_missions WHERE id = $1', [id]);
    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// CREATE mission pillar
exports.create = async (req, res) => {
  try {
    const { icon, title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql.query(
      'INSERT INTO about_nith_missions (icon, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [icon || 'BookOpen', title_en, title_hi || title_en, description_en, description_hi || description_en]
    );

    const page = await sql.query('SELECT id FROM vision_mission ORDER BY id DESC LIMIT 1');
    if (page.rows.length > 0) {
      await sql.query(
        'INSERT INTO vision_mission_pillars (reference_id, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5)',
        [page.rows[0].id, title_en, title_hi || title_en, description_en, description_hi || description_en]
      );
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// UPDATE mission pillar
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_missions SET icon=$1, title_en=$2, title_hi=$3, description_en=$4, description_hi=$5 WHERE id=$6 RETURNING *',
      [icon || 'BookOpen', title_en, title_hi, description_en, description_hi, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// DELETE mission pillar
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_missions WHERE id = $1 RETURNING *', [id]);
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
