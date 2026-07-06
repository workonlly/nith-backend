const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_lalkaar_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-lalkaar error:', err);
        res.status(500).json({ error: 'Database error fetching Lalkaar headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        title_en, title_hn, sub_title_en, sub_title_hn,
        event_date_en, event_date_hn, event_venue_en, event_venue_hn,
        coordinator_en, coordinator_hn, register_url, brochure_url,
        quick_info_title_en, quick_info_title_hn,
        quick_info1_en, quick_info1_hn,
        quick_info2_en, quick_info2_hn,
        quick_info3_en, quick_info3_hn
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_lalkaar_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_lalkaar_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     event_date_en=$5, event_date_hn=$6, event_venue_en=$7, event_venue_hn=$8,
                     coordinator_en=$9, coordinator_hn=$10, register_url=$11, brochure_url=$12,
                     quick_info_title_en=$13, quick_info_title_hn=$14,
                     quick_info1_en=$15, quick_info1_hn=$16,
                     quick_info2_en=$17, quick_info2_hn=$18,
                     quick_info3_en=$19, quick_info3_hn=$20
                 WHERE id=$21 RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    event_date_en, event_date_hn, event_venue_en, event_venue_hn,
                    coordinator_en, coordinator_hn, register_url, brochure_url,
                    quick_info_title_en, quick_info_title_hn,
                    quick_info1_en, quick_info1_hn,
                    quick_info2_en, quick_info2_hn,
                    quick_info3_en, quick_info3_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_lalkaar_heading (
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    event_date_en, event_date_hn, event_venue_en, event_venue_hn,
                    coordinator_en, coordinator_hn, register_url, brochure_url,
                    quick_info_title_en, quick_info_title_hn,
                    quick_info1_en, quick_info1_hn,
                    quick_info2_en, quick_info2_hn,
                    quick_info3_en, quick_info3_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    event_date_en, event_date_hn, event_venue_en, event_venue_hn,
                    coordinator_en, coordinator_hn, register_url, brochure_url,
                    quick_info_title_en, quick_info_title_hn,
                    quick_info1_en, quick_info1_hn,
                    quick_info2_en, quick_info2_hn,
                    quick_info3_en, quick_info3_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-lalkaar error:', err);
        res.status(500).json({ error: 'Database error updating Lalkaar headings' });
    }
});

// --- Sections Endpoints ---

// GET All Sections
router.get('/sections', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_lalkaar_sections ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-lalkaar/sections error:', err);
        res.status(500).json({ error: 'Database error fetching Lalkaar sections' });
    }
});

// POST New Section
router.post('/sections', async (req, res) => {
    const { key, en, hi, content_en, content_hi } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_lalkaar_sections (key, en, hi, content_en, content_hi) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [key, en, hi, content_en, content_hi]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-lalkaar/sections error:', err);
        res.status(500).json({ error: 'Database error creating Lalkaar section' });
    }
});

// PUT Update Section
router.put('/sections/:id', async (req, res) => {
    const { id } = req.params;
    const { key, en, hi, content_en, content_hi } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_lalkaar_sections 
             SET key=$1, en=$2, hi=$3, content_en=$4, content_hi=$5 
             WHERE id=$6 RETURNING *`,
            [key, en, hi, content_en, content_hi, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lalkaar section not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-lalkaar/sections/:id error:', err);
        res.status(500).json({ error: 'Database error updating Lalkaar section' });
    }
});

// DELETE Section
router.delete('/sections/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_lalkaar_sections WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lalkaar section not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-lalkaar/sections/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Lalkaar section' });
    }
});

module.exports = router;
