const express = require('express');
const pool = require('../db/db');
const router = express.Router();

/**
 * Helper middleware to validate the 'lang' parameter.
 * Expects 'lang' to be present in req.body. Defaults to 'en' if not sent.
 */
const validateLang = (req, res, next) => {
  const { lang } = req.body;
  if (lang && !['en', 'hi'].includes(lang)) {
    return res.status(400).json({ error: "Invalid 'lang' parameter. Must be 'en' or 'hi'." });
  }
  // Ensure we fall back to 'en' if the client did not send it
  req.lang = lang || 'en';
  next();
};

// =====================================================
// TABLE 1 : about_city
// Handles Hero + Overview section (Singleton)
// =====================================================

// GET complete city data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM about_city ORDER BY id ASC LIMIT 1'
    );

    if (result.rows.length === 0) {
      return res.json({
        heading_en: 'About Hamirpur',
        heading_hi: null,
        introduction_en: 'Set in the peaceful hills of Himachal Pradesh...',
        introduction_hi: null,
        overview_title_en: 'City Overview',
        overview_title_hi: null,
        overview_subtitle_en: "Essential information about Hamirpur's location and characteristics",
        overview_subtitle_hi: null,
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /about-city error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update/create singleton data
router.put('/', validateLang, async (req, res) => {
  try {
    const {
      heading,
      introduction,
      overview_title,
      overview_subtitle,
    } = req.body;
    const lang = req.lang;

    // Resolve column values dynamically
    const heading_en = lang === 'en' ? heading : null;
    const heading_hi = lang === 'hi' ? heading : null;

    const intro_en = lang === 'en' ? introduction : null;
    const intro_hi = lang === 'hi' ? introduction : null;

    const title_en = lang === 'en' ? overview_title : null;
    const title_hi = lang === 'hi' ? overview_title : null;

    const subtitle_en = lang === 'en' ? overview_subtitle : null;
    const subtitle_hi = lang === 'hi' ? overview_subtitle : null;

    const check = await pool.query(
      'SELECT id FROM about_city LIMIT 1'
    );

    let result;

    if (check.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO about_city
        (
          heading_en, heading_hi, 
          introduction_en, introduction_hi, 
          overview_title_en, overview_title_hi, 
          overview_subtitle_en, overview_subtitle_hi
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          heading_en, heading_hi,
          intro_en, intro_hi,
          title_en, title_hi,
          subtitle_en, subtitle_hi
        ]
      );
    } else {
      const id = check.rows[0].id;

      result = await pool.query(
        `UPDATE about_city
        SET heading_en = $1,
            heading_hi = $2,
            introduction_en = $3,
            introduction_hi = $4,
            overview_title_en = $5,
            overview_title_hi = $6,
            overview_subtitle_en = $7,
            overview_subtitle_hi = $8
        WHERE id = $9
        RETURNING *`,
        [
          heading_en, heading_hi,
          intro_en, intro_hi,
          title_en, title_hi,
          subtitle_en, subtitle_hi,
          id
        ]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /about-city error:', err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// TABLE 2 : about_city_info_cards
// CRUD for overview cards
// =====================================================

// GET all info cards
router.get('/info-cards', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM about_city_info_cards ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST new info card
router.post('/info-cards', validateLang, async (req, res) => {
  try {
    const { label, value } = req.body;
    const lang = req.lang;

    // Check if parent singleton exists
    const parentCheck = await pool.query(
      'SELECT id FROM about_city LIMIT 1'
    );

    let reference_id;

    if (parentCheck.rows.length === 0) {
      // Use SQL DEFAULT VALUES to securely insert a blank record
      const newParent = await pool.query(
        'INSERT INTO about_city DEFAULT VALUES RETURNING id'
      );
      reference_id = newParent.rows[0].id;
    } else {
      reference_id = parentCheck.rows[0].id;
    }

    // Resolve bilingual columns
    const label_en = lang === 'en' ? label : null;
    const label_hi = lang === 'hi' ? label : null;
    const value_en = lang === 'en' ? value : null;
    const value_hi = lang === 'hi' ? value : null;

    const result = await pool.query(
      `INSERT INTO about_city_info_cards
      (reference_id, label_en, label_hi, value_en, value_hi)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [reference_id, label_en, label_hi, value_en, value_hi]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update info card
router.put('/info-cards/:id', validateLang, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, value } = req.body;
    const lang = req.lang;

    // Resolve bilingual columns
    const label_en = lang === 'en' ? label : null;
    const label_hi = lang === 'hi' ? label : null;
    const value_en = lang === 'en' ? value : null;
    const value_hi = lang === 'hi' ? value : null;

    const result = await pool.query(
      `UPDATE about_city_info_cards
      SET label_en = $1,
          label_hi = $2,
          value_en = $3,
          value_hi = $4
      WHERE id = $5
      RETURNING *`,
      [label_en, label_hi, value_en, value_hi, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Info card not found',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE info card
router.delete('/info-cards/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM about_city_info_cards
      WHERE id = $1
      RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Info card not found',
      });
    }

    res.json({
      message: 'Info card deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// TABLE 3 : about_city_descriptions
// CRUD for descriptions
// =====================================================

// GET descriptions
router.get('/descriptions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM about_city_descriptions ORDER BY id ASC'
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST description
router.post('/descriptions', validateLang, async (req, res) => {
  try {
    const { description } = req.body;
    const lang = req.lang;

    const parentCheck = await pool.query(
      'SELECT id FROM about_city LIMIT 1'
    );

    let reference_id;

    if (parentCheck.rows.length === 0) {
      const newParent = await pool.query(
        'INSERT INTO about_city DEFAULT VALUES RETURNING id'
      );
      reference_id = newParent.rows[0].id;
    } else {
      reference_id = parentCheck.rows[0].id;
    }

    // Resolve description columns
    const description_en = lang === 'en' ? description : null;
    const description_hi = lang === 'hi' ? description : null;

    const result = await pool.query(
      `INSERT INTO about_city_descriptions
      (reference_id, description_en, description_hi)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [reference_id, description_en, description_hi]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT description
router.put('/descriptions/:id', validateLang, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const lang = req.lang;

    // Resolve description columns
    const description_en = lang === 'en' ? description : null;
    const description_hi = lang === 'hi' ? description : null;

    const result = await pool.query(
      `UPDATE about_city_descriptions
      SET description_en = $1,
          description_hi = $2
      WHERE id = $3
      RETURNING *`,
      [description_en, description_hi, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Description not found',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE description
router.delete('/descriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM about_city_descriptions
      WHERE id = $1
      RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Description not found',
      });
    }

    res.json({
      message: 'Description deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;