const express = require('express');
const pool = require('../db/db'); // Adjust path to your db connection
const router = express.Router();

// ==================================================
// TABLE 1: aboutnith_history (Main Section)
// Operations: GET, PUT (Singleton Pattern)
// ==================================================

// GET: Fetch the main history content
router.get('/', async (req, res) => {
  try {
    // We assume there is only one active history record for the page
    const result = await pool.query('SELECT * FROM aboutnith_history ORDER BY id ASC LIMIT 1');
    
    if (result.rows.length === 0) {
      // Return empty structure if no data exists yet
      return res.json({ description1: '', description2: '', legacy: '' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /history error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update (or Create) the main history content
router.put('/', async (req, res) => {
  try {
    const { description1, description2, legacy } = req.body;

    // 1. Check if a row exists
    const check = await pool.query('SELECT id FROM aboutnith_history LIMIT 1');

    let result;
    if (check.rows.length === 0) {
      // INSERT (Create new)
      result = await pool.query(
        `INSERT INTO aboutnith_history (description1, description2, legacy) 
         VALUES ($1, $2, $3) RETURNING *`,
        [description1, description2, legacy]
      );
    } else {
      // UPDATE (Modify existing)
      const id = check.rows[0].id;
      result = await pool.query(
        `UPDATE aboutnith_history 
         SET description1 = $1, description2 = $2, legacy = $3 
         WHERE id = $4 RETURNING *`,
        [description1, description2, legacy, id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /history error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==================================================
// TABLE 2: aboutnith_history_timeline (Timeline Events)
// Operations: GET, POST, PUT, DELETE
// ==================================================

// GET: Fetch all timeline events
router.get('/timeline', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM aboutnith_history_timeline ORDER BY year ASC, event_date ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /history/timeline error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new timeline event
router.post('/timeline', async (req, res) => {
  try {
    const { subtitle, year, title, event_date, description } = req.body;

    // 1. We need a valid reference_id from the main table
    const parentCheck = await pool.query('SELECT id FROM aboutnith_history LIMIT 1');
    
    let reference_id;
    if (parentCheck.rows.length === 0) {
      // If parent doesn't exist, create a dummy one so the FK constraint doesn't fail
      const newParent = await pool.query(
        `INSERT INTO aboutnith_history (description1, description2, legacy) 
         VALUES ('', '', '') RETURNING id`
      );
      reference_id = newParent.rows[0].id;
    } else {
      reference_id = parentCheck.rows[0].id;
    }

    // 2. Insert the timeline event
    const result = await pool.query(
      `INSERT INTO aboutnith_history_timeline 
       (reference_id, subtitle, year, title, event_date, description) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [reference_id, subtitle, year, title, event_date, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /history/timeline error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a specific timeline event by ID
router.put('/timeline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitle, year, title, event_date, description } = req.body;

    const result = await pool.query(
      `UPDATE aboutnith_history_timeline 
       SET subtitle = $1, year = $2, title = $3, event_date = $4, description = $5 
       WHERE id = $6 
       RETURNING *`,
      [subtitle, year, title, event_date, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /history/timeline/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a specific timeline event
router.delete('/timeline/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM aboutnith_history_timeline WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    res.json({ message: 'Timeline event deleted successfully' });
  } catch (err) {
    console.error('DELETE /history/timeline/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;