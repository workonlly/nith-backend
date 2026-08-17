const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// GET all goals, roadmaps, and page data
exports.getAll = async (req, res) => {
  try {
    const goals = await sql.query('SELECT * FROM about_nith_goals ORDER BY id ASC');
    const roadmaps = await sql.query('SELECT * FROM about_nith_roadmap ORDER BY id ASC');
    const page = await sql.query('SELECT * FROM goals ORDER BY id DESC LIMIT 1');
    const actionSteps = await sql.query('SELECT * FROM action_steps ORDER BY id ASC');

    res.json({
      success: true,
      data: goals.rows,
      goals: goals.rows,
      roadmaps: roadmaps.rows,
      page: page.rows[0] || {},
      actionSteps: actionSteps.rows,
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// GET page details
exports.getPage = async (req, res) => {
  try {
    const page = await sql.query('SELECT * FROM goals ORDER BY id DESC LIMIT 1');
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
      goals_heading_en, goals_heading_hi, goals_subtitle_en, goals_subtitle_hi,
      tagline_en, tagline_hi, tagline_description_en, tagline_description_hi,
      strategy_heading_en, strategy_heading_hi, strategy_subheading_en, strategy_subheading_hi,
      strategy_description_en, strategy_description_hi,
      cta_heading_en, cta_heading_hi, cta_description_en, cta_description_hi
    } = req.body;

    const check = await sql.query('SELECT id FROM goals ORDER BY id DESC LIMIT 1');
    let result;
    if (check.rows.length > 0) {
      result = await sql.query(
        `UPDATE goals 
         SET hero_heading_en=$1, hero_heading_hi=$2, hero_description_en=$3, hero_description_hi=$4,
             goals_heading_en=$5, goals_heading_hi=$6, goals_subtitle_en=$7, goals_subtitle_hi=$8,
             tagline_en=$9, tagline_hi=$10, tagline_description_en=$11, tagline_description_hi=$12,
             strategy_heading_en=$13, strategy_heading_hi=$14, strategy_subheading_en=$15, strategy_subheading_hi=$16,
             strategy_description_en=$17, strategy_description_hi=$18,
             cta_heading_en=$19, cta_heading_hi=$20, cta_description_en=$21, cta_description_hi=$22,
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$23 RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          goals_heading_en, goals_heading_hi, goals_subtitle_en, goals_subtitle_hi,
          tagline_en, tagline_hi, tagline_description_en, tagline_description_hi,
          strategy_heading_en, strategy_heading_hi, strategy_subheading_en, strategy_subheading_hi,
          strategy_description_en, strategy_description_hi,
          cta_heading_en, cta_heading_hi, cta_description_en, cta_description_hi,
          check.rows[0].id
        ]
      );
    } else {
      result = await sql.query(
        `INSERT INTO goals (
           hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
           goals_heading_en, goals_heading_hi, goals_subtitle_en, goals_subtitle_hi,
           tagline_en, tagline_hi, tagline_description_en, tagline_description_hi,
           strategy_heading_en, strategy_heading_hi, strategy_subheading_en, strategy_subheading_hi,
           strategy_description_en, strategy_description_hi,
           cta_heading_en, cta_heading_hi, cta_description_en, cta_description_hi
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
        [
          hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
          goals_heading_en, goals_heading_hi, goals_subtitle_en, goals_subtitle_hi,
          tagline_en, tagline_hi, tagline_description_en, tagline_description_hi,
          strategy_heading_en, strategy_heading_hi, strategy_subheading_en, strategy_subheading_hi,
          strategy_description_en, strategy_description_hi,
          cta_heading_en, cta_heading_hi, cta_description_en, cta_description_hi
        ]
      );
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// Goals CRUD
exports.getGoals = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_goals ORDER BY id ASC');
    res.json({ success: true, data: data.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body;
    const result = await sql.query(
      'INSERT INTO about_nith_goals (icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [icon || 'Target', title_en, title_hi || title_en, text_en, text_hi || text_en, stats_label_en, stats_label_hi || stats_label_en, stats_value]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_goals SET icon=$1, title_en=$2, title_hi=$3, text_en=$4, text_hi=$5, stats_label_en=$6, stats_label_hi=$7, stats_value=$8 WHERE id=$9 RETURNING *',
      [icon || 'Target', title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_goals WHERE id=$1 RETURNING *', [id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

// Roadmap CRUD
exports.getRoadmaps = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_roadmap ORDER BY id ASC');
    res.json({ success: true, data: data.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.createRoadmap = async (req, res) => {
  try {
    const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body;
    const result = await sql.query(
      'INSERT INTO about_nith_roadmap (year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [year, title_en, title_hi || title_en, focus_en, focus_hi || focus_en, JSON.stringify(items_en || []), JSON.stringify(items_hi || [])]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body;
    const result = await sql.query(
      'UPDATE about_nith_roadmap SET year=$1, title_en=$2, title_hi=$3, focus_en=$4, focus_hi=$5, items_en=$6, items_hi=$7 WHERE id=$8 RETURNING *',
      [year, title_en, title_hi, focus_en, focus_hi, JSON.stringify(items_en || []), JSON.stringify(items_hi || []), id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_roadmap WHERE id=$1 RETURNING *', [id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

router.get('/page', exports.getPage);
router.put('/page', exports.updatePage);
router.get('/', exports.getAll);
router.get('/goals', exports.getGoals);
router.post('/goals', exports.createGoal);
router.put('/goals/:id', exports.updateGoal);
router.delete('/goals/:id', exports.deleteGoal);
router.get('/roadmap', exports.getRoadmaps);
router.post('/roadmap', exports.createRoadmap);
router.put('/roadmap/:id', exports.updateRoadmap);
router.delete('/roadmap/:id', exports.deleteRoadmap);

module.exports = router;
