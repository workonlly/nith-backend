const express = require('express');
const router = express.Router();
const sql = require('../db/db');

exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM about_nith_core_values ORDER BY id ASC');
    res.json({ success: true, data: data.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

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

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const fieldsArr = ['icon', 'title_en', 'title_hi', 'description_en', 'description_hi'];
    const keys = Object.keys(data).filter(k => fieldsArr.includes(k));
    const vals = keys.map(k => data[k]);
    if (keys.length === 0) return res.status(400).json({ success: false, error: 'No valid fields' });
    const query = 'INSERT INTO about_nith_core_values (' + keys.join(', ') + ') VALUES (' + keys.map((_, i) => '$' + (i + 1)).join(', ') + ') RETURNING *';
    const result = await sql.query(query, vals);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fieldsArr = ['icon', 'title_en', 'title_hi', 'description_en', 'description_hi'];
    const keys = Object.keys(data).filter(k => fieldsArr.includes(k));
    if (keys.length === 0) return res.status(400).json({ success: false, error: 'No fields' });
    const setString = keys.map((k, i) => k + ' = $' + (i + 1)).join(', ');
    const vals = keys.map(k => data[k]);
    vals.push(id);
    const query = 'UPDATE about_nith_core_values SET ' + setString + ' WHERE id = $' + vals.length + ' RETURNING *';
    const result = await sql.query(query, vals);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM about_nith_core_values WHERE id = $1 RETURNING *', [id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

router.get('/', exports.getAll);
router.get('/:id', exports.getById);
router.post('/', exports.create);
router.put('/:id', exports.update);
router.delete('/:id', exports.remove);

module.exports = router;
