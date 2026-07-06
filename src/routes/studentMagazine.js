const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_magazine_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-magazine error:', err);
        res.status(500).json({ error: 'Database error fetching magazine headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        institute_title_en, institute_title_hn, institute_content_en, institute_content_hn,
        sub_title_en, sub_title_hn,
        srijan_title_en, srijan_title_hn, srijan_content_en, srijan_content_hn,
        archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
        latest_issue_url, contact_url
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_magazine_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_magazine_heading 
                 SET institute_title_en=$1, institute_title_hn=$2, institute_content_en=$3, institute_content_hn=$4,
                     sub_title_en=$5, sub_title_hn=$6,
                     srijan_title_en=$7, srijan_title_hn=$8, srijan_content_en=$9, srijan_content_hn=$10,
                     archive_title_en=$11, archive_title_hn=$12, archive_desc_en=$13, archive_desc_hn=$14,
                     latest_issue_url=$15, contact_url=$16
                 WHERE id=$17 RETURNING *`,
                [
                    institute_title_en, institute_title_hn, institute_content_en, institute_content_hn,
                    sub_title_en, sub_title_hn,
                    srijan_title_en, srijan_title_hn, srijan_content_en, srijan_content_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    latest_issue_url, contact_url, check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_magazine_heading (
                    institute_title_en, institute_title_hn, institute_content_en, institute_content_hn,
                    sub_title_en, sub_title_hn,
                    srijan_title_en, srijan_title_hn, srijan_content_en, srijan_content_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    latest_issue_url, contact_url
                 ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
                [
                    institute_title_en, institute_title_hn, institute_content_en, institute_content_hn,
                    sub_title_en, sub_title_hn,
                    srijan_title_en, srijan_title_hn, srijan_content_en, srijan_content_hn,
                    archive_title_en, archive_title_hn, archive_desc_en, archive_desc_hn,
                    latest_issue_url, contact_url
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-magazine error:', err);
        res.status(500).json({ error: 'Database error updating magazine headings' });
    }
});

// --- Archive Endpoints ---

// GET All Archive Items
router.get('/archive', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_magazine_archive ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-magazine/archive error:', err);
        res.status(500).json({ error: 'Database error fetching magazine archive' });
    }
});

// POST New Archive Item
router.post('/archive', async (req, res) => {
    const { title_en, title_hn, download_url, view_url } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_magazine_archive (title_en, title_hn, download_url, view_url) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title_en, title_hn, download_url, view_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-magazine/archive error:', err);
        res.status(500).json({ error: 'Database error creating magazine archive entry' });
    }
});

// PUT Update Archive Item
router.put('/archive/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, download_url, view_url } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_magazine_archive 
             SET title_en=$1, title_hn=$2, download_url=$3, view_url=$4 
             WHERE id=$5 RETURNING *`,
            [title_en, title_hn, download_url, view_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Archive item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-magazine/archive/:id error:', err);
        res.status(500).json({ error: 'Database error updating magazine archive entry' });
    }
});

// DELETE Archive Item
router.delete('/archive/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_magazine_archive WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Archive item not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-magazine/archive/:id error:', err);
        res.status(500).json({ error: 'Database error deleting magazine archive entry' });
    }
});

module.exports = router;
