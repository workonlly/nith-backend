const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'aboutnith');

const createController = (tableName, fields) => 
"const sql = require('../db/db');\n\n" +
"exports.getAll = async (req, res) => {\n" +
"  try {\n" +
"    const data = await sql.query('SELECT * FROM " + tableName + " ORDER BY id ASC');\n" +
"    res.json({ success: true, data: data.rows });\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ success: false, error: 'Failed' });\n" +
"  }\n" +
"};\n\n" +
"exports.getById = async (req, res) => {\n" +
"  try {\n" +
"    const { id } = req.params;\n" +
"    const data = await sql.query('SELECT * FROM " + tableName + " WHERE id = $1', [id]);\n" +
"    if (data.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });\n" +
"    res.json({ success: true, data: data.rows[0] });\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ success: false, error: 'Failed' });\n" +
"  }\n" +
"};\n\n" +
"exports.create = async (req, res) => {\n" +
"  try {\n" +
"    const data = req.body;\n" +
"    const fieldsArr = [" + fields.map(f => "'" + f + "'").join(', ') + "];\n" +
"    const keys = Object.keys(data).filter(k => fieldsArr.includes(k));\n" +
"    const vals = keys.map(k => data[k]);\n" +
"    if (keys.length === 0) return res.status(400).json({ success: false, error: 'No valid fields' });\n" +
"    const query = 'INSERT INTO " + tableName + " (' + keys.join(', ') + ') VALUES (' + keys.map((_, i) => '$' + (i + 1)).join(', ') + ') RETURNING *';\n" +
"    const result = await sql.query(query, vals);\n" +
"    res.status(201).json({ success: true, data: result.rows[0] });\n" +
"  } catch (error) {\n" +
"    console.error(error);\n" +
"    res.status(500).json({ success: false, error: 'Failed' });\n" +
"  }\n" +
"};\n\n" +
"exports.update = async (req, res) => {\n" +
"  try {\n" +
"    const { id } = req.params;\n" +
"    const data = req.body;\n" +
"    const fieldsArr = [" + fields.map(f => "'" + f + "'").join(', ') + "];\n" +
"    const keys = Object.keys(data).filter(k => fieldsArr.includes(k));\n" +
"    if (keys.length === 0) return res.status(400).json({ success: false, error: 'No fields' });\n" +
"    const setString = keys.map((k, i) => k + ' = $' + (i + 1)).join(', ');\n" +
"    const vals = keys.map(k => data[k]);\n" +
"    vals.push(id);\n" +
"    const query = 'UPDATE " + tableName + " SET ' + setString + ' WHERE id = $' + vals.length + ' RETURNING *';\n" +
"    const result = await sql.query(query, vals);\n" +
"    res.json({ success: true, data: result.rows[0] });\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ success: false, error: 'Failed' });\n" +
"  }\n" +
"};\n\n" +
"exports.remove = async (req, res) => {\n" +
"  try {\n" +
"    const { id } = req.params;\n" +
"    const result = await sql.query('DELETE FROM " + tableName + " WHERE id = $1 RETURNING *', [id]);\n" +
"    res.json({ success: true, data: result.rows[0] });\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ success: false, error: 'Failed' });\n" +
"  }\n" +
"};\n";

const generateRouter = (controllerFile, tableName, fields) => 
"const express = require('express');\n" +
"const router = express.Router();\n" +
createController(tableName, fields) + "\n" +
"router.get('/', exports.getAll);\n" +
"router.get('/:id', exports.getById);\n" +
"router.post('/', exports.create);\n" +
"router.put('/:id', exports.update);\n" +
"router.delete('/:id', exports.remove);\n\n" +
"module.exports = router;\n";

const filesToGenerate = {
  'history.js': ['about_nith_timeline', ['year', 'title_en', 'title_hi', 'description_en', 'description_hi']],
  'core_values.js': ['about_nith_core_values', ['icon', 'title_en', 'title_hi', 'description_en', 'description_hi']],
  'vision_mission.js': ['about_nith_missions', ['icon', 'title_en', 'title_hi', 'description_en', 'description_hi']],
  'connectivity.js': ['about_nith_connectivity_modes', ['icon', 'title_en', 'title_hi', 'nearest_point_en', 'nearest_point_hi', 'distance_en', 'distance_hi', 'travel_time_en', 'travel_time_hi', 'services_en', 'services_hi', 'additional_info_en', 'additional_info_hi']],
  'aboutcity.js': ['about_nith_city_info', ['icon', 'title_en', 'title_hi', 'description_en', 'description_hi', 'image_url']],
};

for (const [filename, [tableName, fields]] of Object.entries(filesToGenerate)) {
  fs.writeFileSync(path.join(controllersDir, filename), generateRouter(filename, tableName, fields), 'utf8');
}

// Special case for Goals since it has two tables (goals and roadmap)
const goalsContent = 
"const express = require('express');\n" +
"const router = express.Router();\n" +
"const sql = require('../db/db');\n\n" +
"// Goals CRUD\n" +
"exports.getGoals = async (req, res) => {\n" +
"  try { const data = await sql.query('SELECT * FROM about_nith_goals ORDER BY id ASC'); res.json({ success: true, data: data.rows }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.createGoal = async (req, res) => {\n" +
"  try { const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body; const result = await sql.query('INSERT INTO about_nith_goals (icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value]); res.status(201).json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.updateGoal = async (req, res) => {\n" +
"  try { const { id } = req.params; const { icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value } = req.body; const result = await sql.query('UPDATE about_nith_goals SET icon=$1, title_en=$2, title_hi=$3, text_en=$4, text_hi=$5, stats_label_en=$6, stats_label_hi=$7, stats_value=$8 WHERE id=$9 RETURNING *', [icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value, id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.deleteGoal = async (req, res) => {\n" +
"  try { const { id } = req.params; const result = await sql.query('DELETE FROM about_nith_goals WHERE id=$1 RETURNING *', [id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n\n" +
"// Roadmap CRUD\n" +
"exports.getRoadmaps = async (req, res) => {\n" +
"  try { const data = await sql.query('SELECT * FROM about_nith_roadmap ORDER BY id ASC'); res.json({ success: true, data: data.rows }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.createRoadmap = async (req, res) => {\n" +
"  try { const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body; const result = await sql.query('INSERT INTO about_nith_roadmap (year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [year, title_en, title_hi, focus_en, focus_hi, JSON.stringify(items_en), JSON.stringify(items_hi)]); res.status(201).json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.updateRoadmap = async (req, res) => {\n" +
"  try { const { id } = req.params; const { year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi } = req.body; const result = await sql.query('UPDATE about_nith_roadmap SET year=$1, title_en=$2, title_hi=$3, focus_en=$4, focus_hi=$5, items_en=$6, items_hi=$7 WHERE id=$8 RETURNING *', [year, title_en, title_hi, focus_en, focus_hi, JSON.stringify(items_en), JSON.stringify(items_hi), id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n" +
"exports.deleteRoadmap = async (req, res) => {\n" +
"  try { const { id } = req.params; const result = await sql.query('DELETE FROM about_nith_roadmap WHERE id=$1 RETURNING *', [id]); res.json({ success: true, data: result.rows[0] }); } catch (e) { res.status(500).json({ success: false, error: 'Failed' }); }\n" +
"};\n\n" +
"router.get('/goals', exports.getGoals);\n" +
"router.post('/goals', exports.createGoal);\n" +
"router.put('/goals/:id', exports.updateGoal);\n" +
"router.delete('/goals/:id', exports.deleteGoal);\n" +
"router.get('/roadmap', exports.getRoadmaps);\n" +
"router.post('/roadmap', exports.createRoadmap);\n" +
"router.put('/roadmap/:id', exports.updateRoadmap);\n" +
"router.delete('/roadmap/:id', exports.deleteRoadmap);\n\n" +
"module.exports = router;\n";
fs.writeFileSync(path.join(controllersDir, 'goals.js'), goalsContent, 'utf8');

console.log("All controllers regenerated");
