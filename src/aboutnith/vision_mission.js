const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * Helper function to handle mutual exclusivity between English and Hindi content.
 * Rule:
 * - If Hindi content is given, set the English column to NULL.
 * - If English content is given, set the Hindi column to NULL.
 * - If neither or both are provided, we prioritize the active language. Here, if Hindi is defined
 * and non-empty, we treat it as Hindi-only. Otherwise, we treat it as English-only.
 * * @param {*} enValue - The English field input
 * @param {*} hiValue - The Hindi field input
 * @returns {Array} - [finalEnValue, finalHiValue]
 */
function resolveBilingual(enValue, hiValue) {
  const enTrimmed = enValue !== undefined && enValue !== null ? String(enValue).trim() : '';
  const hiTrimmed = hiValue !== undefined && hiValue !== null ? String(hiValue).trim() : '';

  if (hiTrimmed !== '') {
    // Hindi content is given, set English to NULL
    return [null, hiTrimmed];
  } else if (enTrimmed !== '') {
    // English content is given, set Hindi to NULL
    return [enTrimmed, null];
  }
  
  // Default fallback if both are empty
  return [null, null];
}

// ======================================================
// GET ALL DATA
// ======================================================
router.get('/', async (req, res) => {
  try {
    // Fetch main content
    const mainResult = await pool.query(
      `SELECT * FROM vision_mission LIMIT 1`
    );

    let mainData;

    // If no row exists, create one automatically
    if (mainResult.rows.length === 0) {
      const created = await pool.query(`
        INSERT INTO vision_mission DEFAULT VALUES
        RETURNING *
      `);
      mainData = created.rows[0];
    } else {
      mainData = mainResult.rows[0];
    }

    // Fetch pillars
    const pillarsResult = await pool.query(
      `
      SELECT *
      FROM vision_mission_pillars
      WHERE reference_id = $1
      ORDER BY id ASC
      `,
      [mainData.id]
    );

    // Fetch legacy stats
    const legacyResult = await pool.query(
      `
      SELECT *
      FROM vision_mission_legacy_stats
      WHERE reference_id = $1
      ORDER BY id ASC
      `,
      [mainData.id]
    );

    res.json({
      ...mainData,
      missionPillars: pillarsResult.rows,
      legacyStats: legacyResult.rows,
    });

  } catch (error) {
    console.error(error);
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
      guidingPrinciplesHeading_en, guidingPrinciplesHeading_hi,
      guidingPrinciplesDescription_en, guidingPrinciplesDescription_hi,

      visionHeading_en, visionHeading_hi,
      visionSubtitle_en, visionSubtitle_hi,
      visionDescription_en, visionDescription_hi,

      strategicObjectivesHeading_en, strategicObjectivesHeading_hi,

      missionHeading_en, missionHeading_hi,
      missionSubtitle_en, missionSubtitle_hi,

      tagline_en, tagline_hi,
      taglineDescription_en, taglineDescription_hi,

      legacyHeading_en, legacyHeading_hi,
      legacySubheading_en, legacySubheading_hi,
    } = req.body;

    // Resolve mutual exclusivity for each bilingual field set
    const [gpHeadingEn, gpHeadingHi] = resolveBilingual(guidingPrinciplesHeading_en, guidingPrinciplesHeading_hi);
    const [gpDescEn, gpDescHi] = resolveBilingual(guidingPrinciplesDescription_en, guidingPrinciplesDescription_hi);
    
    const [vHeadingEn, vHeadingHi] = resolveBilingual(visionHeading_en, visionHeading_hi);
    const [vSubtitleEn, vSubtitleHi] = resolveBilingual(visionSubtitle_en, visionSubtitle_hi);
    const [vDescEn, vDescHi] = resolveBilingual(visionDescription_en, visionDescription_hi);
    
    const [soHeadingEn, soHeadingHi] = resolveBilingual(strategicObjectivesHeading_en, strategicObjectivesHeading_hi);
    
    const [mHeadingEn, mHeadingHi] = resolveBilingual(missionHeading_en, missionHeading_hi);
    const [mSubtitleEn, mSubtitleHi] = resolveBilingual(missionSubtitle_en, missionSubtitle_hi);
    
    const [taglineEn, taglineHi] = resolveBilingual(tagline_en, tagline_hi);
    const [taglineDescEn, taglineDescHi] = resolveBilingual(taglineDescription_en, taglineDescription_hi);
    
    const [lHeadingEn, lHeadingHi] = resolveBilingual(legacyHeading_en, legacyHeading_hi);
    const [lSubheadingEn, lSubheadingHi] = resolveBilingual(legacySubheading_en, legacySubheading_hi);

    // Find existing row ID
    let result = await pool.query(
      `SELECT id FROM vision_mission LIMIT 1`
    );

    let id;

    if (result.rows.length === 0) {
      const created = await pool.query(`
        INSERT INTO vision_mission DEFAULT VALUES
        RETURNING id
      `);
      id = created.rows[0].id;
    } else {
      id = result.rows[0].id;
    }

    // Execute updated bilingual query
    const updated = await pool.query(
      `
      UPDATE vision_mission
      SET
        guiding_principles_heading_en = $1,
        guiding_principles_heading_hi = $2,
        guiding_principles_description_en = $3,
        guiding_principles_description_hi = $4,

        vision_heading_en = $5,
        vision_heading_hi = $6,
        vision_subtitle_en = $7,
        vision_subtitle_hi = $8,
        vision_description_en = $9,
        vision_description_hi = $10,

        strategic_objectives_heading_en = $11,
        strategic_objectives_heading_hi = $12,

        mission_heading_en = $13,
        mission_heading_hi = $14,
        mission_subtitle_en = $15,
        mission_subtitle_hi = $16,

        tagline_en = $17,
        tagline_hi = $18,
        tagline_description_en = $19,
        tagline_description_hi = $20,

        legacy_heading_en = $21,
        legacy_heading_hi = $22,
        legacy_subheading_en = $23,
        legacy_subheading_hi = $24,

        updated_at = CURRENT_TIMESTAMP
      WHERE id = $25
      RETURNING *
      `,
      [
        gpHeadingEn, gpHeadingHi,
        gpDescEn, gpDescHi,
        vHeadingEn, vHeadingHi,
        vSubtitleEn, vSubtitleHi,
        vDescEn, vDescHi,
        soHeadingEn, soHeadingHi,
        mHeadingEn, mHeadingHi,
        mSubtitleEn, mSubtitleHi,
        taglineEn, taglineHi,
        taglineDescEn, taglineDescHi,
        lHeadingEn, lHeadingHi,
        lSubheadingEn, lSubheadingHi,
        id
      ]
    );

    res.json(updated.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// ADD MISSION PILLAR  (alias: /mission-pillar for admin panel)
// ======================================================
router.post(['/pillar', '/mission-pillar'], async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const mainResult = await pool.query(
      `SELECT id FROM vision_mission LIMIT 1`
    );

    const referenceId = mainResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO vision_mission_pillars
      (
        reference_id,
        title_en,
        title_hi,
        description_en,
        description_hi
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        referenceId,
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE MISSION PILLAR  (alias: /mission-pillar/:id for admin panel)
// ======================================================
router.put(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, description_en, description_hi } = req.body;

    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const result = await pool.query(
      `
      UPDATE vision_mission_pillars
      SET
        title_en = $1,
        title_hi = $2,
        description_en = $3,
        description_hi = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [
        finalTitleEn,
        finalTitleHi,
        finalDescEn,
        finalDescHi,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// DELETE MISSION PILLAR  (alias: /mission-pillar/:id for admin panel)
// ======================================================
router.delete(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM vision_mission_pillars
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: 'Mission pillar deleted',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// ADD LEGACY STAT
// ======================================================
router.post('/legacy-stat', async (req, res) => {
  try {
    const {
      value_en, value_hi,
      label_en, label_hi,
      description_en, description_hi,
    } = req.body;

    const [finalValEn, finalValHi] = resolveBilingual(value_en, value_hi);
    const [finalLabelEn, finalLabelHi] = resolveBilingual(label_en, label_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const mainResult = await pool.query(
      `SELECT id FROM vision_mission LIMIT 1`
    );

    const referenceId = mainResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO vision_mission_legacy_stats
      (
        reference_id,
        value_en,
        value_hi,
        label_en,
        label_hi,
        description_en,
        description_hi
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        referenceId,
        finalValEn,
        finalValHi,
        finalLabelEn,
        finalLabelHi,
        finalDescEn,
        finalDescHi
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// UPDATE LEGACY STAT
// ======================================================
router.put('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      value_en, value_hi,
      label_en, label_hi,
      description_en, description_hi,
    } = req.body;

    const [finalValEn, finalValHi] = resolveBilingual(value_en, value_hi);
    const [finalLabelEn, finalLabelHi] = resolveBilingual(label_en, label_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const result = await pool.query(
      `
      UPDATE vision_mission_legacy_stats
      SET
        value_en = $1,
        value_hi = $2,
        label_en = $3,
        label_hi = $4,
        description_en = $5,
        description_hi = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [
        finalValEn,
        finalValHi,
        finalLabelEn,
        finalLabelHi,
        finalDescEn,
        finalDescHi,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ======================================================
// DELETE LEGACY STAT
// ======================================================
router.delete('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM vision_mission_legacy_stats
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: 'Legacy stat deleted',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});

module.exports = router;