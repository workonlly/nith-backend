const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * =========================
 * GET /director
 * =========================
 */

router.get('/director', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM director
      ORDER BY id DESC
      LIMIT 1
    `);

    // NO DATA
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          image: '',

          label_en: '',
          label_hi: '',

          heading_en: '',
          heading_hi: '',

          name_en: '',
          name_hi: '',

          designation_en: '',
          designation_hi: '',

          institute_en: '',
          institute_hi: '',

          message_en: '',
          message_hi: '',
        },
      });
    }

    const row = result.rows[0];

    res.json({
      success: true,
      data: {
        image: row.image || '',

        label_en: row.label_en || '',
        label_hi: row.label_hi || '',

        heading_en: row.heading_en || '',
        heading_hi: row.heading_hi || '',

        name_en: row.name_en || '',
        name_hi: row.name_hi || '',

        designation_en: row.designation_en || '',
        designation_hi: row.designation_hi || '',

        institute_en: row.institute_en || '',
        institute_hi: row.institute_hi || '',

        message_en: row.message_en || '',
        message_hi: row.message_hi || '',
      },
    });
  } catch (err) {
    console.error('GET /director error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * =========================
 * PUT /director
 * =========================
 */

router.put('/director', async (req, res) => {
  try {
    const {
      image,

      label_en,
      label_hi,

      heading_en,
      heading_hi,

      name_en,
      name_hi,

      designation_en,
      designation_hi,

      institute_en,
      institute_hi,

      message_en,
      message_hi,
    } = req.body;

    // CHECK EXISTING ROW
    const existing = await pool.query(`
      SELECT id FROM director
      LIMIT 1
    `);

    let result;

    // UPDATE
    if (existing.rows.length > 0) {
      result = await pool.query(
        `
        UPDATE director
        SET
          image = $1,

          label_en = $2,
          label_hi = $3,

          heading_en = $4,
          heading_hi = $5,

          name_en = $6,
          name_hi = $7,

          designation_en = $8,
          designation_hi = $9,

          institute_en = $10,
          institute_hi = $11,

          message_en = $12,
          message_hi = $13,

          "updatedAt" = NOW()

        WHERE id = $14

        RETURNING *
        `,
        [
          image || '',

          label_en || '',
          label_hi || '',

          heading_en || '',
          heading_hi || '',

          name_en || '',
          name_hi || '',

          designation_en || '',
          designation_hi || '',

          institute_en || '',
          institute_hi || '',

          message_en || '',
          message_hi || '',

          existing.rows[0].id,
        ]
      );
    } else {
      // INSERT
      result = await pool.query(
        `
        INSERT INTO director
        (
          image,

          label_en,
          label_hi,

          heading_en,
          heading_hi,

          name_en,
          name_hi,

          designation_en,
          designation_hi,

          institute_en,
          institute_hi,

          message_en,
          message_hi
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,$13
        )

        RETURNING *
        `,
        [
          image || '',

          label_en || '',
          label_hi || '',

          heading_en || '',
          heading_hi || '',

          name_en || '',
          name_hi || '',

          designation_en || '',
          designation_hi || '',

          institute_en || '',
          institute_hi || '',

          message_en || '',
          message_hi || '',
        ]
      );
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('PUT /director error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;