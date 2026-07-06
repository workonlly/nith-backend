const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// ==========================================
// 1. Heading Endpoints (Singleton)
// ==========================================

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hillfair_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-hillfair error:', err);
        res.status(500).json({ error: 'Database error fetching Hill\'ffair headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc_en, about_desc_hn,
        events_title_en, events_title_hn,
        events_sub_en, events_sub_hn,
        schedule_title_en, schedule_title_hn,
        schedule_desc_en, schedule_desc_hn,
        dates_en, dates_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_hillfair_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_hillfair_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_title_en=$5, about_title_hn=$6, 
                     about_desc_en=$7, about_desc_hn=$8,
                     events_title_en=$9, events_title_hn=$10,
                     events_sub_en=$11, events_sub_hn=$12,
                     schedule_title_en=$13, schedule_title_hn=$14,
                     schedule_desc_en=$15, schedule_desc_hn=$16,
                     dates_en=$17, dates_hn=$18
                 WHERE id=$19 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn,
                    events_title_en, events_title_hn,
                    events_sub_en, events_sub_hn,
                    schedule_title_en, schedule_title_hn,
                    schedule_desc_en, schedule_desc_hn,
                    dates_en, dates_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_hillfair_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn,
                    events_title_en, events_title_hn,
                    events_sub_en, events_sub_hn,
                    schedule_title_en, schedule_title_hn,
                    schedule_desc_en, schedule_desc_hn,
                    dates_en, dates_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn,
                    events_title_en, events_title_hn,
                    events_sub_en, events_sub_hn,
                    schedule_title_en, schedule_title_hn,
                    schedule_desc_en, schedule_desc_hn,
                    dates_en, dates_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-hillfair error:', err);
        res.status(500).json({ error: 'Database error updating Hill\'ffair headings' });
    }
});

// ==========================================
// 2. Highlights Endpoints
// ==========================================

// GET All Highlights
router.get('/highlights', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hillfair_highlights ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-hillfair/highlights error:', err);
        res.status(500).json({ error: 'Database error fetching Hill\'ffair highlights' });
    }
});

// POST New Highlight
router.post('/highlights', async (req, res) => {
    const { highlight_en, highlight_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO student_hillfair_highlights (highlight_en, highlight_hn) VALUES ($1, $2) RETURNING *',
            [highlight_en, highlight_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-hillfair/highlights error:', err);
        res.status(500).json({ error: 'Database error creating Hill\'ffair highlight' });
    }
});

// PUT Update Highlight
router.put('/highlights/:id', async (req, res) => {
    const { id } = req.params;
    const { highlight_en, highlight_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE student_hillfair_highlights SET highlight_en=$1, highlight_hn=$2 WHERE id=$3 RETURNING *',
            [highlight_en, highlight_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hill\'ffair highlight not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-hillfair/highlights/:id error:', err);
        res.status(500).json({ error: 'Database error updating Hill\'ffair highlight' });
    }
});

// DELETE Highlight
router.delete('/highlights/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_hillfair_highlights WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hill\'ffair highlight not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-hillfair/highlights/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Hill\'ffair highlight' });
    }
});

// ==========================================
// 3. Events Endpoints
// ==========================================

// GET All Events
router.get('/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hillfair_events ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-hillfair/events error:', err);
        res.status(500).json({ error: 'Database error fetching Hill\'ffair events' });
    }
});

// POST New Event
router.post('/events', async (req, res) => {
    const {
        name_en, name_hn,
        category_en, category_hn,
        description_en, description_hn,
        prize_en, prize_hn,
        venue_en, venue_hn
    } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_hillfair_events (
                name_en, name_hn, 
                category_en, category_hn, 
                description_en, description_hn, 
                prize_en, prize_hn, 
                venue_en, venue_hn
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                name_en, name_hn,
                category_en, category_hn,
                description_en, description_hn,
                prize_en, prize_hn,
                venue_en, venue_hn
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-hillfair/events error:', err);
        res.status(500).json({ error: 'Database error creating Hill\'ffair event' });
    }
});

// PUT Update Event
router.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name_en, name_hn,
        category_en, category_hn,
        description_en, description_hn,
        prize_en, prize_hn,
        venue_en, venue_hn
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_hillfair_events 
             SET name_en=$1, name_hn=$2, 
                 category_en=$3, category_hn=$4, 
                 description_en=$5, description_hn=$6, 
                 prize_en=$7, prize_hn=$8, 
                 venue_en=$9, venue_hn=$10 
             WHERE id=$11 RETURNING *`,
            [
                name_en, name_hn,
                category_en, category_hn,
                description_en, description_hn,
                prize_en, prize_hn,
                venue_en, venue_hn,
                id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hill\'ffair event not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-hillfair/events/:id error:', err);
        res.status(500).json({ error: 'Database error updating Hill\'ffair event' });
    }
});

// DELETE Event
router.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_hillfair_events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hill\'ffair event not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-hillfair/events/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Hill\'ffair event' });
    }
});

module.exports = router;
