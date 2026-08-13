const express = require('express');
const router = express.Router();
const { sql } = require('../db/neon');

/*
// ==================================================
// OLD CODE - COMMENTED OUT AS REQUESTED
// ==================================================
const pool = require('../db/db');

const validateLang = (req, res, next) => {
  const { lang } = req.body;
  if (lang && !['en', 'hi'].includes(lang)) {
    return res.status(400).json({ error: "Invalid language. Must be 'en' or 'hi'." });
  }
  req.lang = lang || 'en';
  next();
};

router.get('/', async (req, res) => {
  try {
    const pageResult = await pool.query('SELECT * FROM connectivity_page LIMIT 1');
    if (pageResult.rows.length === 0) {
      return res.json({
        heroHeadingEn: 'Getting Here', heroHeadingHi: null,
        heroDescriptionEn: 'Find out how to reach us...', heroDescriptionHi: null,
        travelOptionsLabelEn: 'Modes', travelOptionsLabelHi: null,
        travelOptionsHeadingEn: 'Travel Options', travelOptionsHeadingHi: null,
        travelOptionsSubtitleEn: 'Select your preferred route and transit system', travelOptionsSubtitleHi: null,
        travelOptions: []
      });
    }

    const page = pageResult.rows[0];
    const pageId = page.id;
    const travelResult = await pool.query('SELECT * FROM travel_options WHERE page_id = $1 ORDER BY id ASC', [pageId]);
    const travelOptions = [];

    for (const option of travelResult.rows) {
      const paragraphResult = await pool.query('SELECT * FROM travel_service_paragraphs WHERE travel_option_id = $1 ORDER BY id ASC', [option.id]);
      travelOptions.push({
        id: option.id, icon: option.icon,
        titleEn: option.title_en, titleHi: option.title_hi,
        nearestPointLabelEn: option.nearest_point_label_en, nearestPointLabelHi: option.nearest_point_label_hi,
        nearestPointValueEn: option.nearest_point_value_en, nearestPointValueHi: option.nearest_point_value_hi,
        distanceLabelEn: option.distance_label_en, distanceLabelHi: option.distance_label_hi,
        distanceValueEn: option.distance_value_en, distanceValueHi: option.distance_value_hi,
        travelTimeEn: option.travel_time_en, travelTimeHi: option.travel_time_hi,
        servicesLabelEn: option.services_label_en, servicesLabelHi: option.services_label_hi,
        servicesParagraphs: paragraphResult.rows.map((p) => ({ id: p.id, paragraphEn: p.paragraph_en, paragraphHi: p.paragraph_hi }))
      });
    }

    const data = {
      heroHeadingEn: page.hero_heading_en, heroHeadingHi: page.hero_heading_hi,
      heroDescriptionEn: page.hero_description_en, heroDescriptionHi: page.hero_description_hi,
      travelOptionsLabelEn: page.travel_options_label_en, travelOptionsLabelHi: page.travel_options_label_hi,
      travelOptionsHeadingEn: page.travel_options_heading_en, travelOptionsHeadingHi: page.travel_options_heading_hi,
      travelOptionsSubtitleEn: page.travel_options_subtitle_en, travelOptionsSubtitleHi: page.travel_options_subtitle_hi,
      travelOptions
    };
    res.json(data);
  } catch (err) {
    console.error('GET /connectivity error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/', validateLang, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const {
      heroHeading, heroDescription, travelOptionsLabel, travelOptionsHeading, travelOptionsSubtitle, travelOptions,
    } = req.body;
    const lang = req.lang;

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

    const check = await client.query('SELECT id FROM connectivity_page LIMIT 1');
    let pageId;
    if (check.rows.length === 0) {
      const insertPage = await client.query('INSERT INTO connectivity_page DEFAULT VALUES RETURNING id');
      pageId = insertPage.rows[0].id;
    } else {
      pageId = check.rows[0].id;
    }

    await client.query(
      \`UPDATE connectivity_page SET hero_heading_en = $1, hero_heading_hi = $2, hero_description_en = $3, hero_description_hi = $4, travel_options_label_en = $5, travel_options_label_hi = $6, travel_options_heading_en = $7, travel_options_heading_hi = $8, travel_options_subtitle_en = $9, travel_options_subtitle_hi = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11\`,
      [hero_h_en, hero_h_hi, hero_d_en, hero_d_hi, opts_l_en, opts_l_hi, opts_h_en, opts_h_hi, opts_s_en, opts_s_hi, pageId]
    );

    const oldTravelOptions = await client.query('SELECT id FROM travel_options WHERE page_id = $1', [pageId]);
    for (const option of oldTravelOptions.rows) {
      await client.query('DELETE FROM travel_service_paragraphs WHERE travel_option_id = $1', [option.id]);
    }
    await client.query('DELETE FROM travel_options WHERE page_id = $1', [pageId]);

    if (travelOptions && Array.isArray(travelOptions)) {
      for (const option of travelOptions) {
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
          \`INSERT INTO travel_options (page_id, icon, title_en, title_hi, nearest_point_label_en, nearest_point_label_hi, nearest_point_value_en, nearest_point_value_hi, distance_label_en, distance_label_hi, distance_value_en, distance_value_hi, travel_time_en, travel_time_hi, services_label_en, services_label_hi) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id\`,
          [pageId, option.icon, title_en, title_hi, np_label_en, np_label_hi, np_val_en, np_val_hi, d_label_en, d_label_hi, d_val_en, d_val_hi, time_en, time_hi, s_label_en, s_label_hi]
        );
        const optionId = insertedOption.rows[0].id;

        if (option.servicesParagraphs && Array.isArray(option.servicesParagraphs)) {
          for (const paragraph of option.servicesParagraphs) {
            const paragraph_en = lang === 'en' ? paragraph : null;
            const paragraph_hi = lang === 'hi' ? paragraph : null;
            await client.query(\`INSERT INTO travel_service_paragraphs (travel_option_id, paragraph_en, paragraph_hi) VALUES ($1, $2, $3)\`, [optionId, paragraph_en, paragraph_hi]);
          }
        }
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: \`Connectivity updated successfully in \${lang === 'en' ? 'English' : 'Hindi'}!\` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database PUT connectivity transaction rollback:', err);
    res.status(500).json({ error: 'Server Error occurred during update actions' });
  } finally {
    client.release();
  }
});
*/

// ==================================================
// NEW NEON IMPLEMENTATION
// ==================================================

const validateLang = (req, res, next) => {
  const { lang } = req.body;
  if (lang && !['en', 'hi'].includes(lang)) {
    return res.status(400).json({ error: "Invalid language. Must be 'en' or 'hi'." });
  }
  req.lang = lang || 'en';
  next();
};

router.get('/', async (req, res) => {
  try {
    const pageResult = await sql`SELECT * FROM connectivity_page LIMIT 1`;
    if (pageResult.length === 0) {
      return res.json({
        heroHeadingEn: 'Getting Here', heroHeadingHi: null,
        heroDescriptionEn: 'Find out how to reach us...', heroDescriptionHi: null,
        travelOptionsLabelEn: 'Modes', travelOptionsLabelHi: null,
        travelOptionsHeadingEn: 'Travel Options', travelOptionsHeadingHi: null,
        travelOptionsSubtitleEn: 'Select your preferred route and transit system', travelOptionsSubtitleHi: null,
        travelOptions: []
      });
    }

    const page = pageResult[0];
    const pageId = page.id;
    const travelResult = await sql`SELECT * FROM travel_options WHERE page_id = ${pageId} ORDER BY id ASC`;
    const travelOptions = [];

    for (const option of travelResult) {
      const paragraphResult = await sql`SELECT * FROM travel_service_paragraphs WHERE travel_option_id = ${option.id} ORDER BY id ASC`;
      travelOptions.push({
        id: option.id, icon: option.icon,
        titleEn: option.title_en, titleHi: option.title_hi,
        nearestPointLabelEn: option.nearest_point_label_en, nearestPointLabelHi: option.nearest_point_label_hi,
        nearestPointValueEn: option.nearest_point_value_en, nearestPointValueHi: option.nearest_point_value_hi,
        distanceLabelEn: option.distance_label_en, distanceLabelHi: option.distance_label_hi,
        distanceValueEn: option.distance_value_en, distanceValueHi: option.distance_value_hi,
        travelTimeEn: option.travel_time_en, travelTimeHi: option.travel_time_hi,
        servicesLabelEn: option.services_label_en, servicesLabelHi: option.services_label_hi,
        servicesParagraphs: paragraphResult.map((p) => ({ id: p.id, paragraphEn: p.paragraph_en, paragraphHi: p.paragraph_hi }))
      });
    }

    const data = {
      heroHeadingEn: page.hero_heading_en, heroHeadingHi: page.hero_heading_hi,
      heroDescriptionEn: page.hero_description_en, heroDescriptionHi: page.hero_description_hi,
      travelOptionsLabelEn: page.travel_options_label_en, travelOptionsLabelHi: page.travel_options_label_hi,
      travelOptionsHeadingEn: page.travel_options_heading_en, travelOptionsHeadingHi: page.travel_options_heading_hi,
      travelOptionsSubtitleEn: page.travel_options_subtitle_en, travelOptionsSubtitleHi: page.travel_options_subtitle_hi,
      travelOptions
    };
    res.json(data);
  } catch (err) {
    console.error('GET /connectivity error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/', validateLang, async (req, res) => {
  try {
    const {
      heroHeading, heroDescription, travelOptionsLabel, travelOptionsHeading, travelOptionsSubtitle, travelOptions,
    } = req.body;
    const lang = req.lang;

    const check = await sql`SELECT id FROM connectivity_page LIMIT 1`;
    let pageId;
    if (check.length === 0) {
      const insertPage = await sql`INSERT INTO connectivity_page (hero_heading_en) VALUES (NULL) RETURNING id`;
      pageId = insertPage[0].id;
    } else {
      pageId = check[0].id;
    }

    if (lang === 'hi') {
      await sql`
        UPDATE connectivity_page
        SET hero_heading_hi = ${heroHeading || null}, hero_description_hi = ${heroDescription || null},
            travel_options_label_hi = ${travelOptionsLabel || null}, travel_options_heading_hi = ${travelOptionsHeading || null},
            travel_options_subtitle_hi = ${travelOptionsSubtitle || null}, updated_at = NOW()
        WHERE id = ${pageId}
      `;
    } else {
      await sql`
        UPDATE connectivity_page
        SET hero_heading_en = ${heroHeading || null}, hero_description_en = ${heroDescription || null},
            travel_options_label_en = ${travelOptionsLabel || null}, travel_options_heading_en = ${travelOptionsHeading || null},
            travel_options_subtitle_en = ${travelOptionsSubtitle || null}, updated_at = NOW()
        WHERE id = ${pageId}
      `;
    }

    res.json({ success: true, message: 'Connectivity main content updated successfully!' });
  } catch (err) {
    console.error('Database PUT connectivity error:', err);
    res.status(500).json({ error: 'Server Error occurred during update actions' });
  }
});

// --- Travel Options Endpoints ---
router.post('/travel-option', async (req, res) => {
  try {
    const check = await sql`SELECT id FROM connectivity_page LIMIT 1`;
    let pageId;
    if (check.length === 0) {
      const insertPage = await sql`INSERT INTO connectivity_page (hero_heading_en) VALUES (NULL) RETURNING id`;
      pageId = insertPage[0].id;
    } else {
      pageId = check[0].id;
    }
    const { icon, title_en, title_hi, nearestPointLabel_en, nearestPointLabel_hi, nearestPointValue_en, nearestPointValue_hi, distanceLabel_en, distanceLabel_hi, distanceValue_en, distanceValue_hi, travelTime_en, travelTime_hi, servicesLabel_en, servicesLabel_hi } = req.body;
    const result = await sql`
      INSERT INTO travel_options (page_id, icon, title_en, title_hi, nearest_point_label_en, nearest_point_label_hi, nearest_point_value_en, nearest_point_value_hi, distance_label_en, distance_label_hi, distance_value_en, distance_value_hi, travel_time_en, travel_time_hi, services_label_en, services_label_hi)
      VALUES (${pageId}, ${icon || null}, ${title_en || null}, ${title_hi || null}, ${nearestPointLabel_en || null}, ${nearestPointLabel_hi || null}, ${nearestPointValue_en || null}, ${nearestPointValue_hi || null}, ${distanceLabel_en || null}, ${distanceLabel_hi || null}, ${distanceValue_en || null}, ${distanceValue_hi || null}, ${travelTime_en || null}, ${travelTime_hi || null}, ${servicesLabel_en || null}, ${servicesLabel_hi || null})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/travel-option/:id', async (req, res) => {
  try {
    const { icon, title_en, title_hi, nearestPointLabel_en, nearestPointLabel_hi, nearestPointValue_en, nearestPointValue_hi, distanceLabel_en, distanceLabel_hi, distanceValue_en, distanceValue_hi, travelTime_en, travelTime_hi, servicesLabel_en, servicesLabel_hi } = req.body;
    const result = await sql`
      UPDATE travel_options
      SET icon = ${icon || null}, title_en = ${title_en || null}, title_hi = ${title_hi || null}, nearest_point_label_en = ${nearestPointLabel_en || null}, nearest_point_label_hi = ${nearestPointLabel_hi || null}, nearest_point_value_en = ${nearestPointValue_en || null}, nearest_point_value_hi = ${nearestPointValue_hi || null}, distance_label_en = ${distanceLabel_en || null}, distance_label_hi = ${distanceLabel_hi || null}, distance_value_en = ${distanceValue_en || null}, distance_value_hi = ${distanceValue_hi || null}, travel_time_en = ${travelTime_en || null}, travel_time_hi = ${travelTime_hi || null}, services_label_en = ${servicesLabel_en || null}, services_label_hi = ${servicesLabel_hi || null}
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/travel-option/:id', async (req, res) => {
  try {
    await sql`DELETE FROM travel_service_paragraphs WHERE travel_option_id = ${req.params.id}`;
    await sql`DELETE FROM travel_options WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- Travel Service Paragraph Endpoints ---
router.post('/paragraph', async (req, res) => {
  try {
    const { travelOptionId, paragraph_en, paragraph_hi } = req.body;
    const result = await sql`
      INSERT INTO travel_service_paragraphs (travel_option_id, paragraph_en, paragraph_hi)
      VALUES (${travelOptionId}, ${paragraph_en || null}, ${paragraph_hi || null})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/paragraph/:id', async (req, res) => {
  try {
    const { paragraph_en, paragraph_hi } = req.body;
    const result = await sql`
      UPDATE travel_service_paragraphs
      SET paragraph_en = ${paragraph_en || null}, paragraph_hi = ${paragraph_hi || null}
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/paragraph/:id', async (req, res) => {
  try {
    await sql`DELETE FROM travel_service_paragraphs WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
module.exports = router;