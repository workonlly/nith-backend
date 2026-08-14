const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * =========================
 * GET /placements
 * =========================
 */
router.get('/placements', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM placements ORDER BY id ASC LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
      return res.json({
        success: true,
        data: {
          heading_en: 'Placement Statistics',
          heading_hi: 'प्लेसमेंट सांख्यिकी',

          stats: [],

          recruitersHeading_en: 'Top Recruiters',
          recruitersHeading_hi: 'शीर्ष भर्तीकर्ता',

          recruitersDescription_en: '',
          recruitersDescription_hi: '',

          topRecruiters_en: [],
          topRecruiters_hi: [],
        },
      });
    }

    res.json({
      success: true,
      data: {
        heading_en: row.heading_en || '',
        heading_hi: row.heading_hi || '',

        stats: row.stats || [],

        recruitersHeading_en: row.recruitersheading_en || '',
        recruitersHeading_hi: row.recruitersheading_hi || '',

        recruitersDescription_en:
          row.recruitersdescription_en || '',
        recruitersDescription_hi:
          row.recruitersdescription_hi || '',

        topRecruiters_en: row.toprecruiters_en || [],
        topRecruiters_hi: row.toprecruiters_hi || [],
      },
    });
  } catch (err) {
    console.error('GET /placements error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * =========================
 * PUT /placements
 * =========================
 */
router.put('/placements', async (req, res) => {
  try {
    const {
      heading_en,
      heading_hi,
      stats,
      recruitersHeading_en,
      recruitersHeading_hi,
      recruitersDescription_en,
      recruitersDescription_hi,
      topRecruiters_en,
      topRecruiters_hi,
    } = req.body;

    // Validation
    if (
      typeof heading_en !== 'string' ||
      typeof heading_hi !== 'string' ||
      !Array.isArray(stats) ||
      typeof recruitersHeading_en !== 'string' ||
      typeof recruitersHeading_hi !== 'string' ||
      typeof recruitersDescription_en !== 'string' ||
      typeof recruitersDescription_hi !== 'string' ||
      !Array.isArray(topRecruiters_en) ||
      !Array.isArray(topRecruiters_hi)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      });
    }

    const existing = await pool.query(
      'SELECT * FROM placements ORDER BY id ASC LIMIT 1'
    );

    let result;

    if (existing.rows.length > 0) {
      result = await pool.query(
        `
        UPDATE placements
        SET
          heading_en = $1,
          heading_hi = $2,
          stats = $3,
          recruitersheading_en = $4,
          recruitersheading_hi = $5,
          recruitersdescription_en = $6,
          recruitersdescription_hi = $7,
          toprecruiters_en = $8,
          toprecruiters_hi = $9,
          updatedat = NOW()
        WHERE id = $10
        RETURNING *
        `,
        [
          heading_en,
          heading_hi,
          JSON.stringify(stats),
          recruitersHeading_en,
          recruitersHeading_hi,
          recruitersDescription_en,
          recruitersDescription_hi,
          JSON.stringify(topRecruiters_en),
          JSON.stringify(topRecruiters_hi),
          existing.rows[0].id,
        ]
      );
    } else {
      result = await pool.query(
        `
        INSERT INTO placements (
          heading_en,
          heading_hi,
          stats,
          recruitersheading_en,
          recruitersheading_hi,
          recruitersdescription_en,
          recruitersdescription_hi,
          toprecruiters_en,
          toprecruiters_hi
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
          heading_en,
          heading_hi,
          JSON.stringify(stats),
          recruitersHeading_en,
          recruitersHeading_hi,
          recruitersDescription_en,
          recruitersDescription_hi,
          JSON.stringify(topRecruiters_en),
          JSON.stringify(topRecruiters_hi),
        ]
      );
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('PUT /placements error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;