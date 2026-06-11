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

// GET BILINGUAL DATA
router.get('/', async (req, res) => {
  try {
    // 1. Fetch singleton page details
    const pageResult = await pool.query(
      'SELECT * FROM connectivity_page LIMIT 1'
    );

    // If no page content exists yet, return a blank template mapping for both languages
    if (pageResult.rows.length === 0) {
      return res.json({
        heroHeadingEn: 'Getting Here',
        heroHeadingHi: null,
        heroDescriptionEn: 'Find out how to reach us...',
        heroDescriptionHi: null,
        travelOptionsLabelEn: 'Modes',
        travelOptionsLabelHi: null,
        travelOptionsHeadingEn: 'Travel Options',
        travelOptionsHeadingHi: null,
        travelOptionsSubtitleEn: 'Select your preferred route and transit system',
        travelOptionsSubtitleHi: null,
        travelOptions: []
      });
    }

    const page = pageResult.rows[0];
    const pageId = page.id;

    // 2. Fetch all travel option cards for this page
    const travelResult = await pool.query(
      'SELECT * FROM travel_options WHERE page_id = $1 ORDER BY id ASC',
      [pageId]
    );

    const travelOptions = [];

    // 3. Loop through child records to fetch localized paragraphs synchronously
    for (const option of travelResult.rows) {
      const paragraphResult = await pool.query(
        `
        SELECT * FROM travel_service_paragraphs
        WHERE travel_option_id = $1
        ORDER BY id ASC
        `,
        [option.id]
      );

      travelOptions.push({
        id: option.id,
        icon: option.icon, // Graphic metadata (Shared)
        
        titleEn: option.title_en,
        titleHi: option.title_hi,

        nearestPointLabelEn: option.nearest_point_label_en,
        nearestPointLabelHi: option.nearest_point_label_hi,
        nearestPointValueEn: option.nearest_point_value_en,
        nearestPointValueHi: option.nearest_point_value_hi,

        distanceLabelEn: option.distance_label_en,
        distanceLabelHi: option.distance_label_hi,
        distanceValueEn: option.distance_value_en,
        distanceValueHi: option.distance_value_hi,

        travelTimeEn: option.travel_time_en,
        travelTimeHi: option.travel_time_hi,

        servicesLabelEn: option.services_label_en,
        servicesLabelHi: option.services_label_hi,

        // Return structured objects with language keys for paragraphs
        servicesParagraphs: paragraphResult.rows.map((p) => ({
          id: p.id,
          paragraphEn: p.paragraph_en,
          paragraphHi: p.paragraph_hi
        }))
      });
    }

    // Combine everything into a clean camelCase response JSON structure
    const data = {
      heroHeadingEn: page.hero_heading_en,
      heroHeadingHi: page.hero_heading_hi,

      heroDescriptionEn: page.hero_description_en,
      heroDescriptionHi: page.hero_description_hi,

      travelOptionsLabelEn: page.travel_options_label_en,
      travelOptionsLabelHi: page.travel_options_label_hi,

      travelOptionsHeadingEn: page.travel_options_heading_en,
      travelOptionsHeadingHi: page.travel_options_heading_hi,

      travelOptionsSubtitleEn: page.travel_options_subtitle_en,
      travelOptionsSubtitleHi: page.travel_options_subtitle_hi,

      travelOptions
    };

    res.json(data);

  } catch (err) {
    console.error('GET /connectivity error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE COMPLETE PAGE (BILINGUAL)
router.put('/', validateLang, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      heroHeading,
      heroDescription,
      travelOptionsLabel,
      travelOptionsHeading,
      travelOptionsSubtitle,
      travelOptions, // Array of structured objects
    } = req.body;

    const lang = req.lang; // Extracted via 'validateLang' middleware ('en' or 'hi')

    // Map translatable data properties dynamically; set opposite fields to null
    const hero_h_en = lang === 'en' ? heroHeading : null;
    const hero_h_hi = lang === 'hi' ? heroHeading : null;

    const hero_d_en = lang === 'en' ? heroDescription : null;
    const hero_d_hi = lang === 'hi' ? heroDescription : null;

    const opts_l_en = lang === 'en' ? travelOptionsLabel : null;
    const opts_l_hi = lang === 'hi' ? travelOptionsLabel : null;

    const opts_h_en = lang === 'en' ? travelOptionsHeading : null;
    const opts_h_hi = lang === 'hi' ? travelOptionsHeading : null;

    const opts_s_en = lang === 'en' ? travelOptionsSubtitle : null;
    const opts_s_hi = lang === 'hi' ? travelOptionsSubtitle : null;

    // 1. Safe Singleton Lookup and Verification 
    const check = await client.query('SELECT id FROM connectivity_page LIMIT 1');
    let pageId;

    if (check.rows.length === 0) {
      // Safely insert new page record using database DEFAULT configurations
      const insertPage = await client.query(
        'INSERT INTO connectivity_page DEFAULT VALUES RETURNING id'
      );
      pageId = insertPage.rows[0].id;
    } else {
      pageId = check.rows[0].id;
    }

    // 2. Perform localized page updates
    await client.query(
      `
      UPDATE connectivity_page
      SET
        hero_heading_en = $1, hero_heading_hi = $2,
        hero_description_en = $3, hero_description_hi = $4,
        travel_options_label_en = $5, travel_options_label_hi = $6,
        travel_options_heading_en = $7, travel_options_heading_hi = $8,
        travel_options_subtitle_en = $9, travel_options_subtitle_hi = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      `,
      [
        hero_h_en, hero_h_hi,
        hero_d_en, hero_d_hi,
        opts_l_en, opts_l_hi,
        opts_h_en, opts_h_hi,
        opts_s_en, opts_s_hi,
        pageId,
      ]
    );

    // 3. Clear existing travel service paragraphs linked to options on this page
    const oldTravelOptions = await client.query(
      'SELECT id FROM travel_options WHERE page_id = $1',
      [pageId]
    );

    for (const option of oldTravelOptions.rows) {
      await client.query(
        'DELETE FROM travel_service_paragraphs WHERE travel_option_id = $1',
        [option.id]
      );
    }

    // 4. Clear old travel options linked to page
    await client.query(
      'DELETE FROM travel_options WHERE page_id = $1',
      [pageId]
    );

    // 5. Insert new travel options mapping language constraints
    if (travelOptions && Array.isArray(travelOptions)) {
      for (const option of travelOptions) {
        
        // Resolve translatable columns on option card
        const title_en = lang === 'en' ? option.title : null;
        const title_hi = lang === 'hi' ? option.title : null;

        const np_label_en = lang === 'en' ? option.nearestPointLabel : null;
        const np_label_hi = lang === 'hi' ? option.nearestPointLabel : null;

        const np_val_en = lang === 'en' ? option.nearestPointValue : null;
        const np_val_hi = lang === 'hi' ? option.nearestPointValue : null;

        const d_label_en = lang === 'en' ? option.distanceLabel : null;
        const d_label_hi = lang === 'hi' ? option.distanceLabel : null;

        const d_val_en = lang === 'en' ? option.distanceValue : null;
        const d_val_hi = lang === 'hi' ? option.distanceValue : null;

        const time_en = lang === 'en' ? option.travelTime : null;
        const time_hi = lang === 'hi' ? option.travelTime : null;

        const s_label_en = lang === 'en' ? option.servicesLabel : null;
        const s_label_hi = lang === 'hi' ? option.servicesLabel : null;

        const insertedOption = await client.query(
          `
          INSERT INTO travel_options (
            page_id,
            icon,
            title_en, title_hi,
            nearest_point_label_en, nearest_point_label_hi,
            nearest_point_value_en, nearest_point_value_hi,
            distance_label_en, distance_label_hi,
            distance_value_en, distance_value_hi,
            travel_time_en, travel_time_hi,
            services_label_en, services_label_hi
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING id
          `,
          [
            pageId,
            option.icon, // Graphical non-translatable asset (Shared)
            title_en, title_hi,
            np_label_en, np_label_hi,
            np_val_en, np_val_hi,
            d_label_en, d_label_hi,
            d_val_en, d_val_hi,
            time_en, time_hi,
            s_label_en, s_label_hi
          ]
        );

        const optionId = insertedOption.rows[0].id;

        // 6. Loop and insert nested services paragraphs
        if (option.servicesParagraphs && Array.isArray(option.servicesParagraphs)) {
          for (const paragraph of option.servicesParagraphs) {
            
            const paragraph_en = lang === 'en' ? paragraph : null;
            const paragraph_hi = lang === 'hi' ? paragraph : null;

            await client.query(
              `
              INSERT INTO travel_service_paragraphs (
                travel_option_id,
                paragraph_en,
                paragraph_hi
              )
              VALUES ($1, $2, $3)
              `,
              [optionId, paragraph_en, paragraph_hi]
            );
          }
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Connectivity updated successfully in ${lang === 'en' ? 'English' : 'Hindi'}!`,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database PUT connectivity transaction rollback:', err);

    res.status(500).json({
      error: 'Server Error occurred during update actions',
    });

  } finally {
    client.release();
  }
});

module.exports = router;