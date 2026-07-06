const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_news_bulletin_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-news-bulletin error:', err);
        res.status(500).json({ error: 'Database error fetching news bulletin headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        title_en, title_hn, sub_title_en, sub_title_hn,
        latest_title_en, latest_title_hn, latest_desc_en, latest_desc_hn,
        archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
        contact_title_en, contact_title_hn, contact_desc_en, contact_desc_hn,
        coord_office_en, coord_office_hn, coord_email, coord_phone,
        coord_hours_en, coord_hours_hn
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_news_bulletin_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_news_bulletin_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     latest_title_en=$5, latest_title_hn=$6, latest_desc_en=$7, latest_desc_hn=$8,
                     archive_title_en=$9, archive_title_hn=$10, archive_desc_en=$11, archive_desc_hn=$12,
                     contact_title_en=$13, contact_title_hn=$14, contact_desc_en=$15, contact_desc_hn=$16,
                     coord_office_en=$17, coord_office_hn=$18, coord_email=$19, coord_phone=$20,
                     coord_hours_en=$21, coord_hours_hn=$22
                 WHERE id=$23 RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    latest_title_en, latest_title_hn, latest_desc_en, latest_desc_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    contact_title_en, contact_title_hn, contact_desc_en, contact_desc_hn,
                    coord_office_en, coord_office_hn, coord_email, coord_phone,
                    coord_hours_en, coord_hours_hn, check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_news_bulletin_heading (
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    latest_title_en, latest_title_hn, latest_desc_en, latest_desc_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    contact_title_en, contact_title_hn, contact_desc_en, contact_desc_hn,
                    coord_office_en, coord_office_hn, coord_email, coord_phone,
                    coord_hours_en, coord_hours_hn
                 ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    latest_title_en, latest_title_hn, latest_desc_en, latest_desc_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    contact_title_en, contact_title_hn, contact_desc_en, contact_desc_hn,
                    coord_office_en, coord_office_hn, coord_email, coord_phone,
                    coord_hours_en, coord_hours_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-news-bulletin error:', err);
        res.status(500).json({ error: 'Database error updating news bulletin headings' });
    }
});

// --- Bulletins Endpoints ---

// GET All Bulletins
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_news_bulletins ORDER BY bulletin_date DESC, id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-news-bulletin/list error:', err);
        res.status(500).json({ error: 'Database error fetching news bulletins' });
    }
});

// POST New Bulletin
router.post('/list', async (req, res) => {
    const { title_en, title_hn, bulletin_date, excerpt_en, excerpt_hn, pdf_url } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_news_bulletins (title_en, title_hn, bulletin_date, excerpt_en, excerpt_hn, pdf_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title_en, title_hn, bulletin_date, excerpt_en, excerpt_hn, pdf_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-news-bulletin/list error:', err);
        res.status(500).json({ error: 'Database error creating news bulletin' });
    }
});

// PUT Update Bulletin
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, bulletin_date, excerpt_en, excerpt_hn, pdf_url } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_news_bulletins 
             SET title_en=$1, title_hn=$2, bulletin_date=$3, excerpt_en=$4, excerpt_hn=$5, pdf_url=$6 
             WHERE id=$7 RETURNING *`,
            [title_en, title_hn, bulletin_date, excerpt_en, excerpt_hn, pdf_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bulletin not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-news-bulletin/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating news bulletin' });
    }
});

// DELETE Bulletin
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_news_bulletins WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bulletin not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-news-bulletin/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting news bulletin' });
    }
});

module.exports = router;
