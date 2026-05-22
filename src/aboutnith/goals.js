const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * Utility helper to handle mutual exclusivity:
 * - If Hindi exists, set English to NULL.
 * - If English exists, set Hindi to NULL.
 */
function resolveBilingual(enValue, hiValue) {
  const enTrimmed = enValue !== undefined && enValue !== null ? String(enValue).trim() : '';
  const hiTrimmed = hiValue !== undefined && hiValue !== null ? String(hiValue).trim() : '';

  if (hiTrimmed !== '') {
    return [null, hiTrimmed];
  } else if (enTrimmed !== '') {
    return [enTrimmed, null];
  }
  return [null, null];
}

// ======================================================
// GET ALL DATA
// ======================================================
router.get('/', async (req, res) => {
  try {
    let mainResult = await pool.query(
      `SELECT * FROM goals LIMIT 1`
    );

    let mainData;

    // Auto-create defaults if no row exists
    if (mainResult.rows.length === 0) {
      const created = await pool.query(`
        INSERT INTO goals DEFAULT VALUES
        RETURNING *
      `);
      mainData = created.rows[0];
    } else {
      mainData = mainResult.rows[0];
    }

    const referenceId = mainData.id;

    // Fetch bilingual goal items
    const goalsResult = await pool.query(
      `
      SELECT
        id,
        title_en AS "title_en",
        title_hi AS "title_hi",
        description_en AS "description_en",
        description_hi AS "description_hi",
        link_text_en AS "linkText_en",
        link_text_hi AS "linkText_hi"
      FROM goal_items
      WHERE reference_id = $1
      ORDER BY id ASC
      `,
      [referenceId]
    );

    // Fetch bilingual action steps
    const stepsResult = await pool.query(
      `
      SELECT
        id,
        step_number AS "number",
        title_en AS "title_en",
        title_hi AS "title_hi",
        description_en AS "description_en",
        description_hi AS "description_hi"
      FROM action_steps
      WHERE reference_id = $1
      ORDER BY id ASC
      `,
      [referenceId]
    );

    // Fetch bilingual CTA buttons
    const buttonsResult = await pool.query(
      `
      SELECT
        id,
        button_text_en AS "buttonText_en",
        button_text_hi AS "buttonText_hi"
      FROM cta_buttons
      WHERE reference_id = $1
      ORDER BY id ASC
      `,
      [referenceId]
    );

    res.json({
      ...mainData,
      goals: goalsResult.rows,
      actionSteps: stepsResult.rows,
      ctaButtons: buttonsResult.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE MAIN CONTENT
// ======================================================
router.put('/', async (req, res) => {
  try {
    const {
      heroHeading_en, heroHeading_hi,
      heroDescription_en, heroDescription_hi,

      goalsHeading_en, goalsHeading_hi,
      goalsSubtitle_en, goalsSubtitle_hi,

      tagline_en, tagline_hi,
      taglineDescription_en, taglineDescription_hi,

      strategyHeading_en, strategyHeading_hi,
      strategySubheading_en, strategySubheading_hi,
      strategyDescription_en, strategyDescription_hi,

      ctaHeading_en, ctaHeading_hi,
      ctaDescription_en, ctaDescription_hi,
    } = req.body;

    // Resolve mutual exclusivity rules for bilingual strings
    const [heroHeadEn, heroHeadHi] = resolveBilingual(heroHeading_en, heroHeading_hi);
    const [heroDescEn, heroDescHi] = resolveBilingual(heroDescription_en, heroDescription_hi);

    const [goalsHeadEn, goalsHeadHi] = resolveBilingual(goalsHeading_en, goalsHeading_hi);
    const [goalsSubEn, goalsSubHi] = resolveBilingual(goalsSubtitle_en, goalsSubtitle_hi);

    const [tagEn, tagHi] = resolveBilingual(tagline_en, tagline_hi);
    const [tagDescEn, tagDescHi] = resolveBilingual(taglineDescription_en, taglineDescription_hi);

    const [stratHeadEn, stratHeadHi] = resolveBilingual(strategyHeading_en, strategyHeading_hi);
    const [stratSubEn, stratSubHi] = resolveBilingual(strategySubheading_en, strategySubheading_hi);
    const [stratDescEn, stratDescHi] = resolveBilingual(strategyDescription_en, strategyDescription_hi);

    const [ctaHeadEn, ctaHeadHi] = resolveBilingual(ctaHeading_en, ctaHeading_hi);
    const [ctaDescEn, ctaDescHi] = resolveBilingual(ctaDescription_en, ctaDescription_hi);

    // Fetch or create row configuration
    let result = await pool.query(
      `SELECT id FROM goals LIMIT 1`
    );

    let id;

    if (result.rows.length === 0) {
      const created = await pool.query(`
        INSERT INTO goals DEFAULT VALUES
        RETURNING id
      `);
      id = created.rows[0].id;
    } else {
      id = result.rows[0].id;
    }

    const updated = await pool.query(
      `
      UPDATE goals
      SET
        hero_heading_en = $1,
        hero_heading_hi = $2,
        hero_description_en = $3,
        hero_description_hi = $4,

        goals_heading_en = $5,
        goals_heading_hi = $6,
        goals_subtitle_en = $7,
        goals_subtitle_hi = $8,

        tagline_en = $9,
        tagline_hi = $10,
        tagline_description_en = $11,
        tagline_description_hi = $12,

        strategy_heading_en = $13,
        strategy_heading_hi = $14,
        strategy_subheading_en = $15,
        strategy_subheading_hi = $16,
        strategy_description_en = $17,
        strategy_description_hi = $18,

        cta_heading_en = $19,
        cta_heading_hi = $20,
        cta_description_en = $21,
        cta_description_hi = $22,

        updated_at = CURRENT_TIMESTAMP
      WHERE id = $23
      RETURNING *
      `,
      [
        heroHeadEn, heroHeadHi,
        heroDescEn, heroDescHi,
        goalsHeadEn, goalsHeadHi,
        goalsSubEn, goalsSubHi,
        tagEn, tagHi,
        tagDescEn, tagDescHi,
        stratHeadEn, stratHeadHi,
        stratSubEn, stratSubHi,
        stratDescEn, stratDescHi,
        ctaHeadEn, ctaHeadHi,
        ctaDescEn, ctaDescHi,
        id
      ]
    );

    res.json(updated.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// ADD GOAL ITEM
// ======================================================
router.post('/goal', async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi, linkText_en, linkText_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);
    const [finalLinkEn, finalLinkHi] = resolveBilingual(linkText_en, linkText_hi);

    const mainResult = await pool.query(
      `SELECT id FROM goals LIMIT 1`
    );

    const referenceId = mainResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO goal_items (
        reference_id,
        title_en,
        title_hi,
        description_en,
        description_hi,
        link_text_en,
        link_text_hi
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, 
        title_en AS "title_en", 
        title_hi AS "title_hi", 
        description_en AS "description_en", 
        description_hi AS "description_hi", 
        link_text_en AS "linkText_en", 
        link_text_hi AS "linkText_hi"
      `,
      [
        referenceId,
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi,
        finalLinkEn,
        finalLinkHi
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE GOAL ITEM
// ======================================================
router.put('/goal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, description_en, description_hi, linkText_en, linkText_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);
    const [finalLinkEn, finalLinkHi] = resolveBilingual(linkText_en, linkText_hi);

    const result = await pool.query(
      `
      UPDATE goal_items
      SET
        title_en = $1,
        title_hi = $2,
        description_en = $3,
        description_hi = $4,
        link_text_en = $5,
        link_text_hi = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING 
        id, 
        title_en AS "title_en", 
        title_hi AS "title_hi", 
        description_en AS "description_en", 
        description_hi AS "description_hi", 
        link_text_en AS "linkText_en", 
        link_text_hi AS "linkText_hi"
      `,
      [
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi,
        finalLinkEn,
        finalLinkHi,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// DELETE GOAL ITEM
// ======================================================
router.delete('/goal/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM goal_items WHERE id = $1`,
      [id]
    );

    res.json({
      message: 'Goal item deleted',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// ADD ACTION STEP
// ======================================================
router.post('/step', async (req, res) => {
  try {
    const { number, title_en, title_hi, description_en, description_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const mainResult = await pool.query(
      `SELECT id FROM goals LIMIT 1`
    );

    const referenceId = mainResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO action_steps (
        reference_id,
        step_number,
        title_en,
        title_hi,
        description_en,
        description_hi
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id, 
        step_number AS "number", 
        title_en AS "title_en", 
        title_hi AS "title_hi", 
        description_en AS "description_en", 
        description_hi AS "description_hi"
      `,
      [
        referenceId,
        number,
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE ACTION STEP
// ======================================================
router.put('/step/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, title_en, title_hi, description_en, description_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const result = await pool.query(
      `
      UPDATE action_steps
      SET
        step_number = $1,
        title_en = $2,
        title_hi = $3,
        description_en = $4,
        description_hi = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING 
        id, 
        step_number AS "number", 
        title_en AS "title_en", 
        title_hi AS "title_hi", 
        description_en AS "description_en", 
        description_hi AS "description_hi"
      `,
      [
        number,
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// DELETE ACTION STEP
// ======================================================
router.delete('/step/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM action_steps WHERE id = $1`,
      [id]
    );

    res.json({
      message: 'Action step deleted',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// ADD CTA BUTTON
// ======================================================
router.post('/cta-button', async (req, res) => {
  try {
    const { buttonText_en, buttonText_hi } = req.body;

    const [finalTextEn, finalTextHi] = resolveBilingual(buttonText_en, buttonText_hi);

    const mainResult = await pool.query(
      `SELECT id FROM goals LIMIT 1`
    );

    const referenceId = mainResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO cta_buttons (
        reference_id,
        button_text_en,
        button_text_hi
      )
      VALUES ($1, $2, $3)
      RETURNING 
        id, 
        button_text_en AS "buttonText_en", 
        button_text_hi AS "buttonText_hi"
      `,
      [
        referenceId,
        finalTextEn,
        finalTextHi
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE CTA BUTTON
// ======================================================
router.put('/cta-button/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { buttonText_en, buttonText_hi } = req.body;

    const [finalTextEn, finalTextHi] = resolveBilingual(buttonText_en, buttonText_hi);

    const result = await pool.query(
      `
      UPDATE cta_buttons
      SET
        button_text_en = $1,
        button_text_hi = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING 
        id, 
        button_text_en AS "buttonText_en", 
        button_text_hi AS "buttonText_hi"
      `,
      [
        finalTextEn,
        finalTextHi,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// DELETE CTA BUTTON
// ======================================================
router.delete('/cta-button/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM cta_buttons WHERE id = $1`,
      [id]
    );

    res.json({
      message: 'CTA button deleted',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

module.exports = router;