const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 1. GET all Annual Alumni Meet page data in a single optimized payload
router.get('/', async (req, res) => {
  try {
    // Auto-migrate: ensure the column exists
    await db.query('ALTER TABLE alumni_annual_meet_heading ADD COLUMN IF NOT EXISTS upcoming_image TEXT;');

    const headingRes = await db.query('SELECT * FROM alumni_annual_meet_heading LIMIT 1');
    const scheduleRes = await db.query('SELECT * FROM alumni_annual_meet_schedule ORDER BY id ASC');
    const pastRes = await db.query('SELECT * FROM alumni_annual_meet_past ORDER BY id ASC');
    const galleryRes = await db.query('SELECT * FROM alumni_annual_meet_gallery ORDER BY id ASC');

    const heading = headingRes.rows.length > 0 ? headingRes.rows[0] : null;

    res.json({
      heading,
      schedule: scheduleRes.rows,
      past: pastRes.rows,
      gallery: galleryRes.rows
    });
  } catch (err) {
    console.error('Error fetching all annual meet data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. PUT update page headings and configurations
router.put('/heading', async (req, res) => {
  const fields = [
    'title_en', 'title_hn', 'sub_title_en', 'sub_title_hn',
    'about_title_en', 'about_title_hn',
    'about_desc1_en', 'about_desc1_hn',
    'about_desc2_en', 'about_desc2_hn',
    'about_desc3_en', 'about_desc3_hn',
    
    'upcoming_title_en', 'upcoming_title_hn',
    'upcoming_theme_en', 'upcoming_theme_hn',
    'upcoming_date_en', 'upcoming_date_hn',
    'upcoming_venue_en', 'upcoming_venue_hn',
    'upcoming_desc_en', 'upcoming_desc_hn',
    'upcoming_reg_open',
    'upcoming_image',
    
    'involve_title_en', 'involve_title_hn',
    'involve_desc_en', 'involve_desc_hn',
    'contact_email', 'contact_phone',
    'contact_address_en', 'contact_address_hn',
    
    'connected_title_en', 'connected_title_hn',
    'connected_desc_en', 'connected_desc_hn',

    'link_register_label_en', 'link_register_label_hn', 'link_register_url',
    'link_network_label_en', 'link_network_label_hn', 'link_network_url',
    'link_endowment_label_en', 'link_endowment_label_hn', 'link_endowment_url',
    'btn_join_label_en', 'btn_join_label_hn', 'btn_join_url',
    'btn_sub_label_en', 'btn_sub_label_hn', 'btn_sub_url'
  ];

  try {
    const check = await db.query('SELECT id FROM alumni_annual_meet_heading LIMIT 1');
    if (check.rows.length > 0) {
      const setClause = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f]);
      values.push(check.rows[0].id);

      await db.query(`
        UPDATE alumni_annual_meet_heading SET
          ${setClause}
        WHERE id = $${values.length}
      `, values);
    } else {
      const colNames = fields.map(f => `"${f}"`).join(', ');
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f]);

      await db.query(`
        INSERT INTO alumni_annual_meet_heading (${colNames})
        VALUES (${placeholders})
      `, values);
    }
    res.json({ success: true, message: 'Alumni annual meet headings updated successfully' });
  } catch (err) {
    console.error('Error updating alumni annual meet headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- SCHEDULE CRUD ---
router.get('/schedule', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_annual_meet_schedule ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/schedule', async (req, res) => {
  const { time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_annual_meet_schedule (time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/schedule/:id', async (req, res) => {
  const { id } = req.params;
  const { time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn } = req.body;
  try {
    await db.query(`
      UPDATE alumni_annual_meet_schedule SET
        time_en = $1, time_hn = $2, activity_en = $3, activity_hn = $4,
        venue_en = $5, venue_hn = $6, speaker_en = $7, speaker_hn = $8
      WHERE id = $9
    `, [time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/schedule/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_annual_meet_schedule WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- PAST MEETS CRUD ---
router.get('/past-meets', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_annual_meet_past ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/past-meets', async (req, res) => {
  const { year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_annual_meet_past (year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/past-meets/:id', async (req, res) => {
  const { id } = req.params;
  const { year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images } = req.body;
  try {
    await db.query(`
      UPDATE alumni_annual_meet_past SET
        year = $1, theme_en = $2, theme_hn = $3, date_en = $4, date_hn = $5,
        highlights_en = $6, highlights_hn = $7, attendees = $8, images = $9
      WHERE id = $10
    `, [year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/past-meets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_annual_meet_past WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- GALLERY CRUD ---
router.get('/gallery', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_annual_meet_gallery ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/gallery', async (req, res) => {
  const { url, year, caption_en, caption_hn } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO alumni_annual_meet_gallery (url, year, caption_en, caption_hn)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [url, year, caption_en, caption_hn]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const { url, year, caption_en, caption_hn } = req.body;
  try {
    await db.query(`
      UPDATE alumni_annual_meet_gallery SET
        url = $1, year = $2, caption_en = $3, caption_hn = $4
      WHERE id = $5
    `, [url, year, caption_en, caption_hn, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumni_annual_meet_gallery WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
