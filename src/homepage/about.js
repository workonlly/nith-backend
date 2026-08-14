const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * GET /about
 * Fetch latest about content (EN + HI)
 */
router.get('/about', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM about ORDER BY id DESC LIMIT 1'
    );

    const row = result.rows[0];

    res.json({
      success: true,
      data: row || {
        title_en: '',
        title_hi: '',
        description_en: '',
        description_hi: '',
      },
    });
  } catch (err) {
    console.error('GET /about error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * PUT /about
 * Insert or update bilingual content
 */
router.put('/about', async (req, res) => {
  try {
    const {
      title_en,
      title_hi,
      description_en,
      description_hi,
    } = req.body;

    // validation
    if (
      typeof title_en !== 'string' ||
      typeof title_hi !== 'string' ||
      typeof description_en !== 'string' ||
      typeof description_hi !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required (EN + HI)',
      });
    }

    // check existing row
    const existing = await pool.query(
      'SELECT * FROM about ORDER BY id DESC LIMIT 1'
    );

    let result;

    if (existing.rows.length > 0) {
      // UPDATE latest row
      result = await pool.query(
        `UPDATE about
         SET title_en = $1,
             title_hi = $2,
             description_en = $3,
             description_hi = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [
          title_en,
          title_hi,
          description_en,
          description_hi,
          existing.rows[0].id,
        ]
      );
    } else {
      // INSERT new row
      result = await pool.query(
        `INSERT INTO about (
          title_en,
          title_hi,
          description_en,
          description_hi
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
          title_en,
          title_hi,
          description_en,
          description_hi,
        ]
      );
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error('PUT /about error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;