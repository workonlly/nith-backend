const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * =========================
 * GET /achievements
 * Fetch all achievements
 * =========================
 */
router.get('/achievements', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM achievements
      ORDER BY id ASC
    `);

    const formattedData = result.rows.map((item) => ({
      id: item.id,

      tagline_en: item.tagline_en || '',
      tagline_hi: item.tagline_hi || '',

      heading_en: item.heading_en || '',
      heading_hi: item.heading_hi || '',

      description_en: item.description_en || '',
      description_hi: item.description_hi || '',

      image: item.image || '',
    }));

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    console.error('GET /achievements error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * =========================
 * PUT /achievements
 * Replace all achievements
 * =========================
 */
router.put('/achievements', async (req, res) => {
  try {
    console.log('PUT ACHIEVEMENTS BODY:', req.body);

    const { achievements } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!Array.isArray(achievements)) {
      return res.status(400).json({
        success: false,
        error: 'Achievements must be an array',
      });
    }

    // =========================
    // DELETE OLD DATA
    // =========================

    await pool.query(`
      DELETE FROM achievements
    `);

    // =========================
    // INSERT NEW DATA
    // =========================

    const insertedAchievements = [];

    for (const item of achievements) {
      const {
        tagline_en,
        tagline_hi,

        heading_en,
        heading_hi,

        description_en,
        description_hi,

        image,
      } = item;

      const result = await pool.query(
        `
        INSERT INTO achievements
        (
          tagline_en,
          tagline_hi,

          heading_en,
          heading_hi,

          description_en,
          description_hi,

          image
        )
        VALUES
        (
          $1, $2,
          $3, $4,
          $5, $6,
          $7
        )
        RETURNING *
        `,
        [
          tagline_en || '',
          tagline_hi || '',

          heading_en || '',
          heading_hi || '',

          description_en || '',
          description_hi || '',

          image || '',
        ]
      );

      insertedAchievements.push({
        id: result.rows[0].id,

        tagline_en:
          result.rows[0].tagline_en,

        tagline_hi:
          result.rows[0].tagline_hi,

        heading_en:
          result.rows[0].heading_en,

        heading_hi:
          result.rows[0].heading_hi,

        description_en:
          result.rows[0].description_en,

        description_hi:
          result.rows[0].description_hi,

        image:
          result.rows[0].image,
      });
    }

    res.json({
      success: true,
      data: insertedAchievements,
    });
  } catch (err) {
    console.error('PUT /achievements error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;