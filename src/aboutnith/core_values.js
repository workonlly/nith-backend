const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * Middleware helper to validate and assign the 'lang' parameter.
 * Default is 'en' if not provided. Supports 'en' and 'hi'.
 */
const validateLang = (req, res, next) => {
  const { lang } = req.body;
  if (lang && !['en', 'hi'].includes(lang)) {
    return res.status(400).json({ error: "Invalid language. Must be 'en' or 'hi'." });
  }
  req.lang = lang || 'en';
  next();
};

// GET ALL DATA
router.get('/', async (req, res) => {
  try {
    // 1. Fetch singleton page details
    const pageResult = await pool.query(
      'SELECT * FROM core_values_page LIMIT 1'
    );

    // If no page content exists yet, return a clean default payload mapping with both languages
    if (pageResult.rows.length === 0) {
      return res.json({
        heroHeadingEn: 'Our Core Values',
        heroHeadingHi: null,
        heroDescriptionEn: 'The principles that guide our work daily...',
        heroDescriptionHi: null,
        pillarsLabelEn: 'Pillars',
        pillarsLabelHi: null,
        pillarsHeadingEn: 'What We Stand For',
        pillarsHeadingHi: null,
        pillarsSubtitleEn: 'Our foundational beliefs',
        pillarsSubtitleHi: null,
        practiceLabelEn: 'Practice',
        practiceLabelHi: null,
        practiceHeadingEn: 'Putting Values to Work',
        practiceHeadingHi: null,
        practiceSubtitleEn: 'How we act',
        practiceSubtitleHi: null,
        coreValues: [],
        practiceParagraphs: []
      });
    }

    const page = pageResult.rows[0];
    const pageId = page.id;

    // 2. Fetch all child value cards
    const valuesResult = await pool.query(
      'SELECT * FROM core_values WHERE page_id = $1 ORDER BY id ASC',
      [pageId]
    );

    // 3. Fetch all practice paragraphs
    const practiceResult = await pool.query(
      'SELECT * FROM practice_paragraphs WHERE page_id = $1 ORDER BY id ASC',
      [pageId]
    );

    // Assemble localized unified output format
    const data = {
      heroHeadingEn: page.hero_heading_en,
      heroHeadingHi: page.hero_heading_hi,

      heroDescriptionEn: page.hero_description_en,
      heroDescriptionHi: page.hero_description_hi,

      pillarsLabelEn: page.pillars_label_en,
      pillarsLabelHi: page.pillars_label_hi,

      pillarsHeadingEn: page.pillars_heading_en,
      pillarsHeadingHi: page.pillars_heading_hi,

      pillarsSubtitleEn: page.pillars_subtitle_en,
      pillarsSubtitleHi: page.pillars_subtitle_hi,

      practiceLabelEn: page.practice_label_en,
      practiceLabelHi: page.practice_label_hi,

      practiceHeadingEn: page.practice_heading_en,
      practiceHeadingHi: page.practice_heading_hi,

      practiceSubtitleEn: page.practice_subtitle_en,
      practiceSubtitleHi: page.practice_subtitle_hi,

      coreValues: valuesResult.rows.map((item) => ({
        id: item.id,
        titleEn: item.title_en,
        titleHi: item.title_hi,
        descriptionEn: item.description_en,
        descriptionHi: item.description_hi,
      })),

      practiceParagraphs: practiceResult.rows.map((item) => ({
        id: item.id,
        paragraphEn: item.paragraph_en,
        paragraphHi: item.paragraph_hi,
      })),
    };

    res.json(data);
  } catch (err) {
    console.error('GET /core-values error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE COMPLETE PAGE
router.put('/', validateLang, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      heroHeading,
      heroDescription,
      pillarsLabel,
      pillarsHeading,
      pillarsSubtitle,
      coreValues, // Array of { title, description }
      practiceLabel,
      practiceHeading,
      practiceSubtitle,
      practiceParagraphs, // Array of string paragraphs
    } = req.body;

    const lang = req.lang; // Extracted via our validateLang middleware ('en' or 'hi')

    // Determine translation columns dynamically based on incoming frontend button/flag
    const hero_h_en = lang === 'en' ? heroHeading : null;
    const hero_h_hi = lang === 'hi' ? heroHeading : null;

    const hero_d_en = lang === 'en' ? heroDescription : null;
    const hero_d_hi = lang === 'hi' ? heroDescription : null;

    const pillars_l_en = lang === 'en' ? pillarsLabel : null;
    const pillars_l_hi = lang === 'hi' ? pillarsLabel : null;

    const pillars_h_en = lang === 'en' ? pillarsHeading : null;
    const pillars_h_hi = lang === 'hi' ? pillarsHeading : null;

    const pillars_s_en = lang === 'en' ? pillarsSubtitle : null;
    const pillars_s_hi = lang === 'hi' ? pillarsSubtitle : null;

    const practice_l_en = lang === 'en' ? practiceLabel : null;
    const practice_l_hi = lang === 'hi' ? practiceLabel : null;

    const practice_h_en = lang === 'en' ? practiceHeading : null;
    const practice_h_hi = lang === 'hi' ? practiceHeading : null;

    const practice_s_en = lang === 'en' ? practiceSubtitle : null;
    const practice_s_hi = lang === 'hi' ? practiceSubtitle : null;

    // Verify if singleton page configuration exists
    const check = await client.query('SELECT id FROM core_values_page LIMIT 1');
    let pageId;

    if (check.rows.length === 0) {
      // Create new singleton page record safely using PostgreSQL DEFAULT VALUES
      const insertPage = await client.query(
        'INSERT INTO core_values_page DEFAULT VALUES RETURNING id'
      );
      pageId = insertPage.rows[0].id;
    } else {
      pageId = check.rows[0].id;
    }

    // Update main page details, keeping opposing languages set to NULL
    await client.query(
      `
      UPDATE core_values_page
      SET
        hero_heading_en = $1, hero_heading_hi = $2,
        hero_description_en = $3, hero_description_hi = $4,
        pillars_label_en = $5, pillars_label_hi = $6,
        pillars_heading_en = $7, pillars_heading_hi = $8,
        pillars_subtitle_en = $9, pillars_subtitle_hi = $10,
        practice_label_en = $11, practice_label_hi = $12,
        practice_heading_en = $13, practice_heading_hi = $14,
        practice_subtitle_en = $15, practice_subtitle_hi = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      `,
      [
        hero_h_en, hero_h_hi,
        hero_d_en, hero_d_hi,
        pillars_l_en, pillars_l_hi,
        pillars_h_en, pillars_h_hi,
        pillars_s_en, pillars_s_hi,
        practice_l_en, practice_l_hi,
        practice_h_en, practice_h_hi,
        practice_s_en, practice_s_hi,
        pageId,
      ]
    );

    // Delete old values associated with this page
    await client.query(
      'DELETE FROM core_values WHERE page_id = $1',
      [pageId]
    );

    // Insert new values - dynamic mapping of bilingual text columns
    if (coreValues && Array.isArray(coreValues)) {
      for (const value of coreValues) {
        const title_en = lang === 'en' ? value.title : null;
        const title_hi = lang === 'hi' ? value.title : null;

        const desc_en = lang === 'en' ? value.description : null;
        const desc_hi = lang === 'hi' ? value.description : null;

        await client.query(
          `
          INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [pageId, title_en, title_hi, desc_en, desc_hi]
        );
      }
    }

    // Delete old paragraphs
    await client.query(
      'DELETE FROM practice_paragraphs WHERE page_id = $1',
      [pageId]
    );

    // Insert new paragraphs - dynamic mapping of bilingual text columns
    if (practiceParagraphs && Array.isArray(practiceParagraphs)) {
      for (const para of practiceParagraphs) {
        const paragraph_en = lang === 'en' ? para : null;
        const paragraph_hi = lang === 'hi' ? para : null;

        await client.query(
          `
          INSERT INTO practice_paragraphs (page_id, paragraph_en, paragraph_hi)
          VALUES ($1, $2, $3)
          `,
          [pageId, paragraph_en, paragraph_hi]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Core Values updated successfully in ${lang === 'en' ? 'English' : 'Hindi'}!`,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database PUT core-values transaction rollback:', err);

    res.status(500).json({
      error: 'Server Error occurred during updates',
    });

  } finally {
    client.release();
  }
});

module.exports = router;