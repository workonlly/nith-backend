const express = require('express');
const pool = require('../db/db'); // Adjust path to your db connection
const router = express.Router();

// ==================================================
// TABLE 1: aboutnith_history (Main Section)
// Operations: GET, PUT (Bilingual Dual Column Singleton Pattern)
// ==================================================

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aboutnith_history ORDER BY id ASC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({ 
        description1: '', description1_hi: null,
        description2: '', description2_hi: null,
        legacy: '', legacy_hi: null 
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /history error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { lang, description1, description2, legacy } = req.body;

    if (!lang || (lang !== 'en' && lang !== 'hi')) {
      return res.status(400).json({ error: "Please specify lang: 'en' or 'hi' to define save target." });
    }

    // Check if the single row exists
    const check = await pool.query('SELECT id FROM aboutnith_history LIMIT 1');

    let result;
    if (check.rows.length === 0) {
      if (lang === 'en') {
        // Saving English: Put data in English columns, make Hindi NULL
        result = await pool.query(
          `INSERT INTO aboutnith_history (description1, description2, legacy, description1_hi, description2_hi, legacy_hi) 
           VALUES ($1, $2, $3, NULL, NULL, NULL) RETURNING *`,
          [description1, description2, legacy]
        );
      } else {
        // Saving Hindi: Put data in Hindi columns, make English NULL
        result = await pool.query(
          `INSERT INTO aboutnith_history (description1, description2, legacy, description1_hi, description2_hi, legacy_hi) 
           VALUES (NULL, NULL, NULL, $1, $2, $3) RETURNING *`,
          [description1, description2, legacy] // Maps to Hindi values passed in parameters
        );
      }
    } else {
      const id = check.rows[0].id;
      if (lang === 'en') {
        // Update English columns, set Hindi columns to NULL
        result = await pool.query(
          `UPDATE aboutnith_history 
           SET description1 = $1, description2 = $2, legacy = $3,
               description1_hi = NULL, description2_hi = NULL, legacy_hi = NULL
           WHERE id = $4 RETURNING *`,
          [description1, description2, legacy, id]
        );
      } else {
        // Update Hindi columns, set English columns to NULL
        result = await pool.query(
          `UPDATE aboutnith_history 
           SET description1_hi = $1, description2_hi = $2, legacy_hi = $3,
               description1 = NULL, description2 = NULL, legacy = NULL
           WHERE id = $4 RETURNING *`,
          [description1, description2, legacy, id]
        );
      }
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

router.post('/timeline', async (req, res) => {
  try {
    const { lang, subtitle, year, title, event_date, description } = req.body;

    if (!lang || (lang !== 'en' && lang !== 'hi')) {
      return res.status(400).json({ error: "Please specify lang: 'en' or 'hi' to define save target." });
    }

    // 1. Get reference_id
    const parentCheck = await pool.query('SELECT id FROM aboutnith_history LIMIT 1');
    let reference_id;
    if (parentCheck.rows.length === 0) {
      const newParent = await pool.query(
        `INSERT INTO aboutnith_history (description1, description2, legacy) 
         VALUES ('', '', '') RETURNING id`
      );
      reference_id = newParent.rows[0].id;
    } else {
      reference_id = parentCheck.rows[0].id;
    }

    // 2. Insert with conditional columns
    let result;
    if (lang === 'en') {
      result = await pool.query(
        `INSERT INTO aboutnith_history_timeline 
         (reference_id, year, event_date, subtitle, title, description, subtitle_hi, title_hi, description_hi) 
         VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, NULL) 
         RETURNING *`,
        [reference_id, year, event_date, subtitle, title, description]
      );
    } else {
      result = await pool.query(
        `INSERT INTO aboutnith_history_timeline 
         (reference_id, year, event_date, subtitle, title, description, subtitle_hi, title_hi, description_hi) 
         VALUES ($1, $2, $3, NULL, NULL, NULL, $4, $5, $6) 
         RETURNING *`,
        [reference_id, year, event_date, subtitle, title, description]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /history/timeline error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/timeline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lang, year, event_date, subtitle, title, description } = req.body;

    if (!lang || (lang !== 'en' && lang !== 'hi')) {
      return res.status(400).json({ error: "Please specify lang: 'en' or 'hi' to define save target." });
    }

    let result;
    if (lang === 'en') {
      // Save English parameters, make Hindi NULL
      result = await pool.query(
        `UPDATE aboutnith_history_timeline 
         SET year = $1, event_date = $2, subtitle = $3, title = $4, description = $5,
             subtitle_hi = NULL, title_hi = NULL, description_hi = NULL
         WHERE id = $6 
         RETURNING *`,
        [year, event_date, subtitle, title, description, id]
      );
    } else {
      // Save Hindi parameters, make English NULL
      result = await pool.query(
        `UPDATE aboutnith_history_timeline 
         SET year = $1, event_date = $2, subtitle_hi = $3, title_hi = $4, description_hi = $5,
             subtitle = NULL, title = NULL, description = NULL
         WHERE id = $6 
         RETURNING *`,
        [year, event_date, subtitle, title, description, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /history/timeline/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

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