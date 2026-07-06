const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_spicmacay_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-spicmacay error:', err);
        res.status(500).json({ error: 'Database error fetching SPIC MACAY headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc1_en, about_desc1_hn,
        about_desc2_en, about_desc2_hn,
        about_desc3_en, about_desc3_hn,
        movement_title_en, movement_title_hn,
        movement_intro_en, movement_intro_hn,
        growth_title_en, growth_title_hn,
        growth_desc_en, growth_desc_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_spicmacay_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_spicmacay_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_title_en=$5, about_title_hn=$6, 
                     about_desc1_en=$7, about_desc1_hn=$8,
                     about_desc2_en=$9, about_desc2_hn=$10,
                     about_desc3_en=$11, about_desc3_hn=$12,
                     movement_title_en=$13, movement_title_hn=$14,
                     movement_intro_en=$15, movement_intro_hn=$16,
                     growth_title_en=$17, growth_title_hn=$18,
                     growth_desc_en=$19, growth_desc_hn=$20
                 WHERE id=$21 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    about_desc3_en, about_desc3_hn,
                    movement_title_en, movement_title_hn,
                    movement_intro_en, movement_intro_hn,
                    growth_title_en, growth_title_hn,
                    growth_desc_en, growth_desc_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_spicmacay_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    about_desc3_en, about_desc3_hn,
                    movement_title_en, movement_title_hn,
                    movement_intro_en, movement_intro_hn,
                    growth_title_en, growth_title_hn,
                    growth_desc_en, growth_desc_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    about_desc3_en, about_desc3_hn,
                    movement_title_en, movement_title_hn,
                    movement_intro_en, movement_intro_hn,
                    growth_title_en, growth_title_hn,
                    growth_desc_en, growth_desc_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-spicmacay error:', err);
        res.status(500).json({ error: 'Database error updating SPIC MACAY headings' });
    }
});

// --- Assertions Endpoints ---

// GET All Assertions
router.get('/assertions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_spicmacay_assertions ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-spicmacay/assertions error:', err);
        res.status(500).json({ error: 'Database error fetching SPIC MACAY assertions' });
    }
});

// POST New Assertion
router.post('/assertions', async (req, res) => {
    const { assertion_en, assertion_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO student_spicmacay_assertions (assertion_en, assertion_hn) VALUES ($1, $2) RETURNING *',
            [assertion_en, assertion_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-spicmacay/assertions error:', err);
        res.status(500).json({ error: 'Database error creating SPIC MACAY assertion' });
    }
});

// PUT Update Assertion
router.put('/assertions/:id', async (req, res) => {
    const { id } = req.params;
    const { assertion_en, assertion_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE student_spicmacay_assertions SET assertion_en=$1, assertion_hn=$2 WHERE id=$3 RETURNING *',
            [assertion_en, assertion_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SPIC MACAY assertion not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-spicmacay/assertions/:id error:', err);
        res.status(500).json({ error: 'Database error updating SPIC MACAY assertion' });
    }
});

// DELETE Assertion
router.delete('/assertions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_spicmacay_assertions WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SPIC MACAY assertion not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-spicmacay/assertions/:id error:', err);
        res.status(500).json({ error: 'Database error deleting SPIC MACAY assertion' });
    }
});

// --- Gallery Endpoints ---

// GET All Gallery Items
router.get('/gallery', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_spicmacay_gallery ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-spicmacay/gallery error:', err);
        res.status(500).json({ error: 'Database error fetching SPIC MACAY gallery' });
    }
});

// POST New Gallery Item
router.post('/gallery', async (req, res) => {
    const { url, caption_en, caption_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO student_spicmacay_gallery (url, caption_en, caption_hn) VALUES ($1, $2, $3) RETURNING *',
            [url, caption_en, caption_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-spicmacay/gallery error:', err);
        res.status(500).json({ error: 'Database error creating SPIC MACAY gallery item' });
    }
});

// PUT Update Gallery Item
router.put('/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const { url, caption_en, caption_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE student_spicmacay_gallery SET url=$1, caption_en=$2, caption_hn=$3 WHERE id=$4 RETURNING *',
            [url, caption_en, caption_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SPIC MACAY gallery item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-spicmacay/gallery/:id error:', err);
        res.status(500).json({ error: 'Database error updating SPIC MACAY gallery item' });
    }
});

// DELETE Gallery Item
router.delete('/gallery/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_spicmacay_gallery WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SPIC MACAY gallery item not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-spicmacay/gallery/:id error:', err);
        res.status(500).json({ error: 'Database error deleting SPIC MACAY gallery item' });
    }
});

module.exports = router;

