const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_cultural_intro_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-cultural error:', err);
        res.status(500).json({ error: 'Database error fetching cultural intro headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc1_en, about_desc1_hn,
        about_desc2_en, about_desc2_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_cultural_intro_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_cultural_intro_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_title_en=$5, about_title_hn=$6, 
                     about_desc1_en=$7, about_desc1_hn=$8,
                     about_desc2_en=$9, about_desc2_hn=$10
                 WHERE id=$11 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_cultural_intro_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-cultural error:', err);
        res.status(500).json({ error: 'Database error updating cultural intro headings' });
    }
});

// --- Societies & Clubs Endpoints ---

// GET All Societies
router.get('/societies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_cultural_societies ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-cultural/societies error:', err);
        res.status(500).json({ error: 'Database error fetching cultural societies list' });
    }
});

// POST New Society
router.post('/societies', async (req, res) => {
    const { name_en, name_hn, focus_en, focus_hn, faculty_en, faculty_hn, contact } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_cultural_societies (
                name_en, name_hn, 
                focus_en, focus_hn, 
                faculty_en, faculty_hn, 
                contact
             ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name_en, name_hn, focus_en, focus_hn, faculty_en, faculty_hn, contact]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-cultural/societies error:', err);
        res.status(500).json({ error: 'Database error creating cultural society' });
    }
});

// PUT Update Society
router.put('/societies/:id', async (req, res) => {
    const { id } = req.params;
    const { name_en, name_hn, focus_en, focus_hn, faculty_en, faculty_hn, contact } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_cultural_societies 
             SET name_en=$1, name_hn=$2, 
                 focus_en=$3, focus_hn=$4, 
                 faculty_en=$5, faculty_hn=$6, 
                 contact=$7 
             WHERE id=$8 RETURNING *`,
            [name_en, name_hn, focus_en, focus_hn, faculty_en, faculty_hn, contact, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cultural society not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-cultural/societies/:id error:', err);
        res.status(500).json({ error: 'Database error updating cultural society' });
    }
});

// DELETE Society
router.delete('/societies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_cultural_societies WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cultural society not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-cultural/societies/:id error:', err);
        res.status(500).json({ error: 'Database error deleting cultural society' });
    }
});

module.exports = router;
