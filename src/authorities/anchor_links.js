const express = require('express');
const router = express.Router();
const sql = require('../db/db');
const crypto = require('crypto');

// Get all anchor links
exports.getAll = async (req, res) => {
  try {
    const data = await sql.query('SELECT * FROM anchor_links ORDER BY created_at DESC');
    res.json({ success: true, data: data.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to fetch anchor links' });
  }
};

// Get single anchor link by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sql.query('SELECT * FROM anchor_links WHERE id = $1', [id]);
    if (data.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Anchor link not found' });
    }
    res.json({ success: true, data: data.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to fetch anchor link' });
  }
};

// Create or Upsert an anchor link
exports.create = async (req, res) => {
  try {
    const { id, link_text, link_url } = req.body;
    const finalId = id || crypto.randomBytes(8).toString('hex');
    
    const result = await sql.query(
      `INSERT INTO anchor_links (id, link_text, link_url, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (id) 
       DO UPDATE SET link_text = EXCLUDED.link_text, link_url = EXCLUDED.link_url, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [finalId, link_text, link_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to create anchor link' });
  }
};

// Update an anchor link
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { link_text, link_url } = req.body;
    
    const result = await sql.query(
      `INSERT INTO anchor_links (id, link_text, link_url, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (id) 
       DO UPDATE SET link_text = EXCLUDED.link_text, link_url = EXCLUDED.link_url, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [id, link_text, link_url]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Anchor link not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to update anchor link' });
  }
};

// Delete an anchor link
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query('DELETE FROM anchor_links WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Anchor link not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to delete anchor link' });
  }
};

router.get('/', exports.getAll);
router.get('/:id', exports.getById);
router.post('/', exports.create);
router.put('/:id', exports.update);
router.delete('/:id', exports.remove);

module.exports = router;
