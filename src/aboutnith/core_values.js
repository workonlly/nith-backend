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
    const pageResult = await pool.query('SELECT * FROM core_values_page LIMIT 1');
    if (pageResult.rows.length === 0) {
      return res.json({
        heroHeadingEn: 'Our Core Values', heroHeadingHi: null,
        heroDescriptionEn: 'The principles that guide our work daily...', heroDescriptionHi: null,
        pillarsLabelEn: 'Pillars', pillarsLabelHi: null,
        pillarsHeadingEn: 'What We Stand For', pillarsHeadingHi: null,
        pillarsSubtitleEn: 'Our foundational beliefs', pillarsSubtitleHi: null,
        practiceLabelEn: 'Practice', practiceLabelHi: null,
        practiceHeadingEn: 'Putting Values to Work', practiceHeadingHi: null,
        practiceSubtitleEn: 'How we act', practiceSubtitleHi: null,
        coreValues: [], practiceParagraphs: []
      });
    }

    const page = pageResult.rows[0];
    const pageId = page.id;
    const valuesResult = await pool.query('SELECT * FROM core_values WHERE page_id = $1 ORDER BY id ASC', [pageId]);
    const practiceResult = await pool.query('SELECT * FROM practice_paragraphs WHERE page_id = $1 ORDER BY id ASC', [pageId]);

    const data = {
      heroHeadingEn: page.hero_heading_en, heroHeadingHi: page.hero_heading_hi,
      heroDescriptionEn: page.hero_description_en, heroDescriptionHi: page.hero_description_hi,
      pillarsLabelEn: page.pillars_label_en, pillarsLabelHi: page.pillars_label_hi,
      pillarsHeadingEn: page.pillars_heading_en, pillarsHeadingHi: page.pillars_heading_hi,
      pillarsSubtitleEn: page.pillars_subtitle_en, pillarsSubtitleHi: page.pillars_subtitle_hi,
      practiceLabelEn: page.practice_label_en, practiceLabelHi: page.practice_label_hi,
      practiceHeadingEn: page.practice_heading_en, practiceHeadingHi: page.practice_heading_hi,
      practiceSubtitleEn: page.practice_subtitle_en, practiceSubtitleHi: page.practice_subtitle_hi,
      coreValues: valuesResult.rows.map((item) => ({
        id: item.id, titleEn: item.title_en, titleHi: item.title_hi, descriptionEn: item.description_en, descriptionHi: item.description_hi,
      })),
      practiceParagraphs: practiceResult.rows.map((item) => ({
        id: item.id, paragraphEn: item.paragraph_en, paragraphHi: item.paragraph_hi,
      })),
    };
    res.json(data);
  } catch (err) {
    console.error('GET /core-values error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/', validateLang, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const {
      heroHeading, heroDescription, pillarsLabel, pillarsHeading, pillarsSubtitle,
      coreValues, practiceLabel, practiceHeading, practiceSubtitle, practiceParagraphs,
    } = req.body;
    const lang = req.lang;

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

    const check = await client.query('SELECT id FROM core_values_page LIMIT 1');
    let pageId;
    if (check.rows.length === 0) {
      const insertPage = await client.query('INSERT INTO core_values_page DEFAULT VALUES RETURNING id');
      pageId = insertPage.rows[0].id;
    } else {
      pageId = check.rows[0].id;
    }

    await client.query(
      `UPDATE core_values_page SET hero_heading_en = $1, hero_heading_hi = $2, hero_description_en = $3, hero_description_hi = $4, pillars_label_en = $5, pillars_label_hi = $6, pillars_heading_en = $7, pillars_heading_hi = $8, pillars_subtitle_en = $9, pillars_subtitle_hi = $10, practice_label_en = $11, practice_label_hi = $12, practice_heading_en = $13, practice_heading_hi = $14, practice_subtitle_en = $15, practice_subtitle_hi = $16, updated_at = CURRENT_TIMESTAMP WHERE id = $17`,
      [hero_h_en, hero_h_hi, hero_d_en, hero_d_hi, pillars_l_en, pillars_l_hi, pillars_h_en, pillars_h_hi, pillars_s_en, pillars_s_hi, practice_l_en, practice_l_hi, practice_h_en, practice_h_hi, practice_s_en, practice_s_hi, pageId]
    );

    await client.query('DELETE FROM core_values WHERE page_id = $1', [pageId]);
    if (coreValues && Array.isArray(coreValues)) {
      for (const value of coreValues) {
        const title_en = lang === 'en' ? value.title : null;
        const title_hi = lang === 'hi' ? value.title : null;
        const desc_en = lang === 'en' ? value.description : null;
        const desc_hi = lang === 'hi' ? value.description : null;
        await client.query(`INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5)`, [pageId, title_en, title_hi, desc_en, desc_hi]);
      }
    }

    await client.query('DELETE FROM practice_paragraphs WHERE page_id = $1', [pageId]);
    if (practiceParagraphs && Array.isArray(practiceParagraphs)) {
      for (const para of practiceParagraphs) {
        const paragraph_en = lang === 'en' ? para : null;
        const paragraph_hi = lang === 'hi' ? para : null;
        await client.query(`INSERT INTO practice_paragraphs (page_id, paragraph_en, paragraph_hi) VALUES ($1, $2, $3)`, [pageId, paragraph_en, paragraph_hi]);
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: \`Core Values updated successfully in \${lang === 'en' ? 'English' : 'Hindi'}!\` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database PUT core-values transaction rollback:', err);
    res.status(500).json({ error: 'Server Error occurred during updates' });
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
    const pageResult = await sql`SELECT * FROM core_values_page LIMIT 1`;
    if (pageResult.length === 0) {
      return res.json({
        heroHeadingEn: 'Our Core Values', heroHeadingHi: null,
        heroDescriptionEn: 'The principles that guide our work daily...', heroDescriptionHi: null,
        pillarsLabelEn: 'Pillars', pillarsLabelHi: null,
        pillarsHeadingEn: 'What We Stand For', pillarsHeadingHi: null,
        pillarsSubtitleEn: 'Our foundational beliefs', pillarsSubtitleHi: null,
        practiceLabelEn: 'Practice', practiceLabelHi: null,
        practiceHeadingEn: 'Putting Values to Work', practiceHeadingHi: null,
        practiceSubtitleEn: 'How we act', practiceSubtitleHi: null,
        coreValues: [], practiceParagraphs: []
      });
    }

    const page = pageResult[0];
    const pageId = page.id;
    const valuesResult = await sql`SELECT * FROM core_values WHERE page_id = ${pageId} ORDER BY id ASC`;
    const practiceResult = await sql`SELECT * FROM practice_paragraphs WHERE page_id = ${pageId} ORDER BY id ASC`;

    const data = {
      heroHeadingEn: page.hero_heading_en, heroHeadingHi: page.hero_heading_hi,
      heroDescriptionEn: page.hero_description_en, heroDescriptionHi: page.hero_description_hi,
      pillarsLabelEn: page.pillars_label_en, pillarsLabelHi: page.pillars_label_hi,
      pillarsHeadingEn: page.pillars_heading_en, pillarsHeadingHi: page.pillars_heading_hi,
      pillarsSubtitleEn: page.pillars_subtitle_en, pillarsSubtitleHi: page.pillars_subtitle_hi,
      practiceLabelEn: page.practice_label_en, practiceLabelHi: page.practice_label_hi,
      practiceHeadingEn: page.practice_heading_en, practiceHeadingHi: page.practice_heading_hi,
      practiceSubtitleEn: page.practice_subtitle_en, practiceSubtitleHi: page.practice_subtitle_hi,
      coreValues: valuesResult.map((item) => ({
        id: item.id, titleEn: item.title_en, titleHi: item.title_hi, descriptionEn: item.description_en, descriptionHi: item.description_hi,
      })),
      practiceParagraphs: practiceResult.map((item) => ({
        id: item.id, paragraphEn: item.paragraph_en, paragraphHi: item.paragraph_hi,
      })),
    };
    res.json(data);
  } catch (err) {
    console.error('GET /core-values error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/', validateLang, async (req, res) => {
  try {
    const {
      heroHeading, heroDescription, pillarsLabel, pillarsHeading, pillarsSubtitle,
      coreValues, practiceLabel, practiceHeading, practiceSubtitle, practiceParagraphs,
    } = req.body;
    const lang = req.lang;

    const check = await sql`SELECT id FROM core_values_page LIMIT 1`;
    let pageId;
    if (check.length === 0) {
      const insertPage = await sql`INSERT INTO core_values_page (hero_heading_en) VALUES (NULL) RETURNING id`;
      pageId = insertPage[0].id;
    } else {
      pageId = check[0].id;
    }

    if (lang === 'hi') {
      await sql`
        UPDATE core_values_page
        SET hero_heading_hi = ${heroHeading || null}, hero_description_hi = ${heroDescription || null},
            pillars_label_hi = ${pillarsLabel || null}, pillars_heading_hi = ${pillarsHeading || null},
            pillars_subtitle_hi = ${pillarsSubtitle || null}, practice_label_hi = ${practiceLabel || null},
            practice_heading_hi = ${practiceHeading || null}, practice_subtitle_hi = ${practiceSubtitle || null},
            updated_at = NOW()
        WHERE id = ${pageId}
      `;
    } else {
      await sql`
        UPDATE core_values_page
        SET hero_heading_en = ${heroHeading || null}, hero_description_en = ${heroDescription || null},
            pillars_label_en = ${pillarsLabel || null}, pillars_heading_en = ${pillarsHeading || null},
            pillars_subtitle_en = ${pillarsSubtitle || null}, practice_label_en = ${practiceLabel || null},
            practice_heading_en = ${practiceHeading || null}, practice_subtitle_en = ${practiceSubtitle || null},
            updated_at = NOW()
        WHERE id = ${pageId}
      `;
    }

    // Array sync logic for core_values
    const existingValues = await sql`SELECT id FROM core_values WHERE page_id = ${pageId}`;
    const existingValueIds = existingValues.map(v => v.id);
    const incomingValueIds = (coreValues || []).map(v => v.id).filter(id => id != null);
    
    const valuesToDelete = existingValueIds.filter(id => !incomingValueIds.includes(id));
    for (const id of valuesToDelete) {
      await sql`DELETE FROM core_values WHERE id = ${id}`;
    }

    if (coreValues && Array.isArray(coreValues)) {
      for (const value of coreValues) {
        if (value.id) {
          if (lang === 'hi') {
            await sql`UPDATE core_values SET title_hi = ${value.title || null}, description_hi = ${value.description || null} WHERE id = ${value.id}`;
          } else {
            await sql`UPDATE core_values SET title_en = ${value.title || null}, description_en = ${value.description || null} WHERE id = ${value.id}`;
          }
        } else {
          if (lang === 'hi') {
            await sql`INSERT INTO core_values (page_id, title_hi, description_hi) VALUES (${pageId}, ${value.title || null}, ${value.description || null})`;
          } else {
            await sql`INSERT INTO core_values (page_id, title_en, description_en) VALUES (${pageId}, ${value.title || null}, ${value.description || null})`;
          }
        }
      }
    }

    // Array sync logic for practice_paragraphs
    const existingPractice = await sql`SELECT id FROM practice_paragraphs WHERE page_id = ${pageId}`;
    const existingPracticeIds = existingPractice.map(p => p.id);
    const incomingPracticeIds = (practiceParagraphs || []).map(p => p.id).filter(id => id != null);
    
    const practiceToDelete = existingPracticeIds.filter(id => !incomingPracticeIds.includes(id));
    for (const id of practiceToDelete) {
      await sql`DELETE FROM practice_paragraphs WHERE id = ${id}`;
    }

    if (practiceParagraphs && Array.isArray(practiceParagraphs)) {
      for (const practice of practiceParagraphs) {
        if (practice.id) {
          if (lang === 'hi') {
            await sql`UPDATE practice_paragraphs SET paragraph_hi = ${practice.paragraph || null} WHERE id = ${practice.id}`;
          } else {
            await sql`UPDATE practice_paragraphs SET paragraph_en = ${practice.paragraph || null} WHERE id = ${practice.id}`;
          }
        } else {
          if (lang === 'hi') {
            await sql`INSERT INTO practice_paragraphs (page_id, paragraph_hi) VALUES (${pageId}, ${practice.paragraph || null})`;
          } else {
            await sql`INSERT INTO practice_paragraphs (page_id, paragraph_en) VALUES (${pageId}, ${practice.paragraph || null})`;
          }
        }
      }
    }

    res.json({ success: true, message: `Core Values updated successfully in ${lang === 'en' ? 'English' : 'Hindi'}!` });
  } catch (err) {
    console.error('Database PUT core-values error:', err);
    res.status(500).json({ error: 'Server Error occurred during updates' });
  }
});

// --- Core Values Sub-Items ---
router.post('/value', async (req, res) => {
  try {
    const check = await sql`SELECT id FROM core_values_page LIMIT 1`;
    let pageId;
    if (check.length > 0) { pageId = check[0].id; } 
    else { pageId = (await sql`INSERT INTO core_values_page (hero_heading_en) VALUES (NULL) RETURNING id`)[0].id; }
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql`INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi) VALUES (${pageId}, ${title_en || null}, ${title_hi || null}, ${description_en || null}, ${description_hi || null}) RETURNING *`;
    res.json(result[0]);
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

router.put('/value/:id', async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const result = await sql`UPDATE core_values SET title_en = ${title_en || null}, title_hi = ${title_hi || null}, description_en = ${description_en || null}, description_hi = ${description_hi || null} WHERE id = ${req.params.id} RETURNING *`;
    res.json(result[0]);
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

router.delete('/value/:id', async (req, res) => {
  try {
    await sql`DELETE FROM core_values WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

// --- Practice Paragraphs Sub-Items ---
router.post('/practice', async (req, res) => {
  try {
    const check = await sql`SELECT id FROM core_values_page LIMIT 1`;
    let pageId;
    if (check.length > 0) { pageId = check[0].id; } 
    else { pageId = (await sql`INSERT INTO core_values_page (hero_heading_en) VALUES (NULL) RETURNING id`)[0].id; }
    const { paragraph_en, paragraph_hi } = req.body;
    const result = await sql`INSERT INTO practice_paragraphs (page_id, paragraph_en, paragraph_hi) VALUES (${pageId}, ${paragraph_en || null}, ${paragraph_hi || null}) RETURNING *`;
    res.json(result[0]);
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

router.put('/practice/:id', async (req, res) => {
  try {
    const { paragraph_en, paragraph_hi } = req.body;
    const result = await sql`UPDATE practice_paragraphs SET paragraph_en = ${paragraph_en || null}, paragraph_hi = ${paragraph_hi || null} WHERE id = ${req.params.id} RETURNING *`;
    res.json(result[0]);
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

router.delete('/practice/:id', async (req, res) => {
  try {
    await sql`DELETE FROM practice_paragraphs WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({error: 'Server Error'}); }
});

module.exports = router;