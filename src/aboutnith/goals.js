const express = require('express');
const router = express.Router();
const sql = require('../db/db');

// Goals CRUD
exports.getGoals = async (req, res) => {
  try { const data = await sql.query('SELECT * FROM about_nith_goals ORDER BY id ASC'); res.json({ success: true, data: data.rows }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.createGoal = async (req, res) => {
  try { const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body; const result = await sql.query('INSERT INTO about_nith_goals (icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value]); res.status(201).json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.updateGoal = async (req, res) => {
  try { const { id } = req.params; const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body; const result = await sql.query('UPDATE about_nith_goals SET icon=$1, title_en=$2, title_hi=$3, text_en=$4, text_hi=$5, stats_label_en=$6, stats_label_hi=$7, stats_value=$8 WHERE id=$9 RETURNING *', [icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value, id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.deleteGoal = async (req, res) => {
  try { const { id } = req.params; const result = await sql.query('DELETE FROM about_nith_goals WHERE id=$1 RETURNING *', [id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};

// Roadmap CRUD
exports.getRoadmaps = async (req, res) => {
  try { const data = await sql.query('SELECT * FROM about_nith_roadmap ORDER BY id ASC'); res.json({ success: true, data: data.rows }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.createRoadmap = async (req, res) => {
  try { const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body; const result = await sql.query('INSERT INTO about_nith_roadmap (year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [year, title_en, title_hi, focus_en, focus_hi, JSON.stringify(items_en), JSON.stringify(items_hi)]); res.status(201).json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.updateRoadmap = async (req, res) => {
  try { const { id } = req.params; const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body; const result = await sql.query('UPDATE about_nith_roadmap SET year=$1, title_en=$2, title_hi=$3, focus_en=$4, focus_hi=$5, items_en=$6, items_hi=$7 WHERE id=$8 RETURNING *', [year, title_en, title_hi, focus_en, focus_hi, JSON.stringify(items_en), JSON.stringify(items_hi), id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};
exports.deleteRoadmap = async (req, res) => {
  try { const { id } = req.params; const result = await sql.query('DELETE FROM about_nith_roadmap WHERE id=$1 RETURNING *', [id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }
};

router.get('/goals', exports.getGoals);
router.post('/goals', exports.createGoal);
router.put('/goals/:id', exports.updateGoal);
router.delete('/goals/:id', exports.deleteGoal);
router.get('/roadmap', exports.getRoadmaps);
router.post('/roadmap', exports.createRoadmap);
router.put('/roadmap/:id', exports.updateRoadmap);
router.delete('/roadmap/:id', exports.deleteRoadmap);

module.exports = router;
