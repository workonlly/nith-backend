const express = require('express');
const router = express.Router();
const { sql } = require('../db/neon');

/*
// ==================================================
// OLD CODE - COMMENTED OUT AS REQUESTED
// ==================================================
const pool = require('../db/db');

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

router.get('/', async (req, res) => {
  try {
    const mainResult = await pool.query(`SELECT * FROM vision_mission LIMIT 1`);
    let mainData;
    if (mainResult.rows.length === 0) {
      const created = await pool.query(`INSERT INTO vision_mission DEFAULT VALUES RETURNING *`);
      mainData = created.rows[0];
    } else {
      mainData = mainResult.rows[0];
    }

    const pillarsResult = await pool.query(`SELECT * FROM vision_mission_pillars WHERE reference_id = $1 ORDER BY id ASC`, [mainData.id]);
    const legacyResult = await pool.query(`SELECT * FROM vision_mission_legacy_stats WHERE reference_id = $1 ORDER BY id ASC`, [mainData.id]);

    res.json({
      ...mainData,
      missionPillars: pillarsResult.rows,
      legacyStats: legacyResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

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

    let result = await pool.query(`SELECT id FROM vision_mission LIMIT 1`);
    let id;
    if (result.rows.length === 0) {
      const created = await pool.query(`INSERT INTO vision_mission DEFAULT VALUES RETURNING id`);
      id = created.rows[0].id;
    } else {
      id = result.rows[0].id;
    }

    const updated = await pool.query(
      `
      UPDATE vision_mission
      SET
        guiding_principles_heading_en = $1, guiding_principles_heading_hi = $2,
        guiding_principles_description_en = $3, guiding_principles_description_hi = $4,
        vision_heading_en = $5, vision_heading_hi = $6,
        vision_subtitle_en = $7, vision_subtitle_hi = $8,
        vision_description_en = $9, vision_description_hi = $10,
        strategic_objectives_heading_en = $11, strategic_objectives_heading_hi = $12,
        mission_heading_en = $13, mission_heading_hi = $14,
        mission_subtitle_en = $15, mission_subtitle_hi = $16,
        tagline_en = $17, tagline_hi = $18,
        tagline_description_en = $19, tagline_description_hi = $20,
        legacy_heading_en = $21, legacy_heading_hi = $22,
        legacy_subheading_en = $23, legacy_subheading_hi = $24,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $25 RETURNING *
      `,
      [
        gpHeadingEn, gpHeadingHi, gpDescEn, gpDescHi, vHeadingEn, vHeadingHi,
        vSubtitleEn, vSubtitleHi, vDescEn, vDescHi, soHeadingEn, soHeadingHi,
        mHeadingEn, mHeadingHi, mSubtitleEn, mSubtitleHi, taglineEn, taglineHi,
        taglineDescEn, taglineDescHi, lHeadingEn, lHeadingHi, lSubheadingEn, lSubheadingHi, id
      ]
    );
    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(['/pillar', '/mission-pillar'], async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const mainResult = await pool.query(`SELECT id FROM vision_mission LIMIT 1`);
    const referenceId = mainResult.rows[0].id;
    const result = await pool.query(
      `INSERT INTO vision_mission_pillars (reference_id, title_en, title_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [referenceId, finalTitleEn, finalTitleHi, finalDescEn, finalDescHi]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, description_en, description_hi } = req.body;
    const [finalTitleEn, finalTitleHi] = resolveBilingual(title_en, title_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const result = await pool.query(
      `UPDATE vision_mission_pillars SET title_en = $1, title_hi = $2, description_en = $3, description_hi = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [finalTitleEn, finalTitleHi, finalDescEn, finalDescHi, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM vision_mission_pillars WHERE id = $1`, [id]);
    res.json({ message: 'Mission pillar deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/legacy-stat', async (req, res) => {
  try {
    const { value_en, value_hi, label_en, label_hi, description_en, description_hi } = req.body;
    const [finalValEn, finalValHi] = resolveBilingual(value_en, value_hi);
    const [finalLabelEn, finalLabelHi] = resolveBilingual(label_en, label_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const mainResult = await pool.query(`SELECT id FROM vision_mission LIMIT 1`);
    const referenceId = mainResult.rows[0].id;
    const result = await pool.query(
      `INSERT INTO vision_mission_legacy_stats (reference_id, value_en, value_hi, label_en, label_hi, description_en, description_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [referenceId, finalValEn, finalValHi, finalLabelEn, finalLabelHi, finalDescEn, finalDescHi]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value_en, value_hi, label_en, label_hi, description_en, description_hi } = req.body;
    const [finalValEn, finalValHi] = resolveBilingual(value_en, value_hi);
    const [finalLabelEn, finalLabelHi] = resolveBilingual(label_en, label_hi);
    const [finalDescEn, finalDescHi] = resolveBilingual(description_en, description_hi);

    const result = await pool.query(
      `UPDATE vision_mission_legacy_stats SET value_en = $1, value_hi = $2, label_en = $3, label_hi = $4, description_en = $5, description_hi = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
      [finalValEn, finalValHi, finalLabelEn, finalLabelHi, finalDescEn, finalDescHi, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM vision_mission_legacy_stats WHERE id = $1`, [id]);
    res.json({ message: 'Legacy stat deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
*/

// ==================================================
// NEW NEON IMPLEMENTATION
// ==================================================

router.get('/', async (req, res) => {
  try {
    let mainResult = await sql`SELECT * FROM vision_mission LIMIT 1`;
    let mainData;

    if (mainResult.length === 0) {
      const created = await sql`
        INSERT INTO vision_mission (guiding_principles_heading_en) VALUES (NULL) RETURNING *
      `;
      mainData = created[0];
    } else {
      mainData = mainResult[0];
    }

    const pillarsResult = await sql`
      SELECT * FROM vision_mission_pillars WHERE reference_id = ${mainData.id} ORDER BY id ASC
    `;

    const legacyResult = await sql`
      SELECT * FROM vision_mission_legacy_stats WHERE reference_id = ${mainData.id} ORDER BY id ASC
    `;

    res.json({
      ...mainData,
      missionPillars: pillarsResult,
      legacyStats: legacyResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', async (req, res) => {
  try {
    // We accept both _en and _hi fields, since the frontend explicitly sends them
    // as guidingPrinciplesHeading_en instead of lang muxing.
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

    let result = await sql`SELECT id FROM vision_mission LIMIT 1`;
    let id;
    if (result.length === 0) {
      const created = await sql`INSERT INTO vision_mission (guiding_principles_heading_en) VALUES (NULL) RETURNING id`;
      id = created[0].id;
    } else {
      id = result[0].id;
    }

    const updated = await sql`
      UPDATE vision_mission
      SET
        guiding_principles_heading_en = ${guidingPrinciplesHeading_en || null},
        guiding_principles_heading_hi = ${guidingPrinciplesHeading_hi || null},
        guiding_principles_description_en = ${guidingPrinciplesDescription_en || null},
        guiding_principles_description_hi = ${guidingPrinciplesDescription_hi || null},

        vision_heading_en = ${visionHeading_en || null},
        vision_heading_hi = ${visionHeading_hi || null},
        vision_subtitle_en = ${visionSubtitle_en || null},
        vision_subtitle_hi = ${visionSubtitle_hi || null},
        vision_description_en = ${visionDescription_en || null},
        vision_description_hi = ${visionDescription_hi || null},

        strategic_objectives_heading_en = ${strategicObjectivesHeading_en || null},
        strategic_objectives_heading_hi = ${strategicObjectivesHeading_hi || null},

        mission_heading_en = ${missionHeading_en || null},
        mission_heading_hi = ${missionHeading_hi || null},
        mission_subtitle_en = ${missionSubtitle_en || null},
        mission_subtitle_hi = ${missionSubtitle_hi || null},

        tagline_en = ${tagline_en || null},
        tagline_hi = ${tagline_hi || null},
        tagline_description_en = ${taglineDescription_en || null},
        tagline_description_hi = ${taglineDescription_hi || null},

        legacy_heading_en = ${legacyHeading_en || null},
        legacy_heading_hi = ${legacyHeading_hi || null},
        legacy_subheading_en = ${legacySubheading_en || null},
        legacy_subheading_hi = ${legacySubheading_hi || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(['/pillar', '/mission-pillar'], async (req, res) => {
  try {
    const { title_en, title_hi, description_en, description_hi } = req.body;
    let mainResult = await sql`SELECT id FROM vision_mission LIMIT 1`;
    const referenceId = mainResult[0].id;

    const result = await sql`
      INSERT INTO vision_mission_pillars (reference_id, title_en, title_hi, description_en, description_hi)
      VALUES (${referenceId}, ${title_en || null}, ${title_hi || null}, ${description_en || null}, ${description_hi || null})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, description_en, description_hi } = req.body;

    const result = await sql`
      UPDATE vision_mission_pillars 
      SET title_en = ${title_en || null}, title_hi = ${title_hi || null}, 
          description_en = ${description_en || null}, description_hi = ${description_hi || null}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id} 
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete(['/pillar/:id', '/mission-pillar/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM vision_mission_pillars WHERE id = ${id}`;
    res.json({ message: 'Mission pillar deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/legacy-stat', async (req, res) => {
  try {
    const { value_en, value_hi, label_en, label_hi, description_en, description_hi } = req.body;
    let mainResult = await sql`SELECT id FROM vision_mission LIMIT 1`;
    const referenceId = mainResult[0].id;

    const result = await sql`
      INSERT INTO vision_mission_legacy_stats 
      (reference_id, value_en, value_hi, label_en, label_hi, description_en, description_hi) 
      VALUES (${referenceId}, ${value_en || null}, ${value_hi || null}, ${label_en || null}, ${label_hi || null}, ${description_en || null}, ${description_hi || null}) 
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value_en, value_hi, label_en, label_hi, description_en, description_hi } = req.body;

    const result = await sql`
      UPDATE vision_mission_legacy_stats 
      SET value_en = ${value_en || null}, value_hi = ${value_hi || null}, 
          label_en = ${label_en || null}, label_hi = ${label_hi || null}, 
          description_en = ${description_en || null}, description_hi = ${description_hi || null}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id} 
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/legacy-stat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM vision_mission_legacy_stats WHERE id = ${id}`;
    res.json({ message: 'Legacy stat deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;