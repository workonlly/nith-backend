const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_yogaday_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-yogaday error:', err);
        res.status(500).json({ error: 'Database error fetching Yoga Day headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn, about_title_en, about_title_hn, about_desc_en, about_desc_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_yogaday_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_yogaday_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     about_title_en=$5, about_title_hn=$6, about_desc_en=$7, about_desc_hn=$8
                 WHERE id=$9 RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn, about_title_en, about_title_hn, about_desc_en, about_desc_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_yogaday_heading (title_en, title_hn, sub_title_en, sub_title_hn, about_title_en, about_title_hn, about_desc_en, about_desc_hn) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn, about_title_en, about_title_hn, about_desc_en, about_desc_hn]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-yogaday error:', err);
        res.status(500).json({ error: 'Database error updating Yoga Day headings' });
    }
});

// --- Schedule Endpoints ---

// GET All Schedule
router.get('/schedule', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_yogaday_schedule ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-yogaday/schedule error:', err);
        res.status(500).json({ error: 'Database error fetching Yoga Day schedule' });
    }
});

// POST New Schedule
router.post('/schedule', async (req, res) => {
    const { time_en, time_hn, title_en, title_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_yogaday_schedule (time_en, time_hn, title_en, title_hn) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [time_en, time_hn, title_en, title_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-yogaday/schedule error:', err);
        res.status(500).json({ error: 'Database error creating Yoga Day schedule item' });
    }
});

// PUT Update Schedule
router.put('/schedule/:id', async (req, res) => {
    const { id } = req.params;
    const { time_en, time_hn, title_en, title_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_yogaday_schedule 
             SET time_en=$1, time_hn=$2, title_en=$3, title_hn=$4 
             WHERE id=$5 RETURNING *`,
            [time_en, time_hn, title_en, title_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day schedule item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-yogaday/schedule/:id error:', err);
        res.status(500).json({ error: 'Database error updating Yoga Day schedule item' });
    }
});

// DELETE Schedule
router.delete('/schedule/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_yogaday_schedule WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day schedule item not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-yogaday/schedule/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Yoga Day schedule item' });
    }
});

// --- Benefits Endpoints ---

// GET All Benefits
router.get('/benefits', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_yogaday_benefits ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-yogaday/benefits error:', err);
        res.status(500).json({ error: 'Database error fetching Yoga Day benefits' });
    }
});

// POST New Benefit
router.post('/benefits', async (req, res) => {
    const { benefit_en, benefit_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_yogaday_benefits (benefit_en, benefit_hn) 
             VALUES ($1, $2) RETURNING *`,
            [benefit_en, benefit_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-yogaday/benefits error:', err);
        res.status(500).json({ error: 'Database error creating Yoga Day benefit' });
    }
});

// PUT Update Benefit
router.put('/benefits/:id', async (req, res) => {
    const { id } = req.params;
    const { benefit_en, benefit_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_yogaday_benefits 
             SET benefit_en=$1, benefit_hn=$2 
             WHERE id=$3 RETURNING *`,
            [benefit_en, benefit_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day benefit not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-yogaday/benefits/:id error:', err);
        res.status(500).json({ error: 'Database error updating Yoga Day benefit' });
    }
});

// DELETE Benefit
router.delete('/benefits/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_yogaday_benefits WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day benefit not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-yogaday/benefits/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Yoga Day benefit' });
    }
});

// --- Instructors Endpoints ---

// GET All Instructors
router.get('/instructors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_yogaday_instructors ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-yogaday/instructors error:', err);
        res.status(500).json({ error: 'Database error fetching Yoga Day instructors' });
    }
});

// POST New Instructor
router.post('/instructors', async (req, res) => {
    const { name_en, name_hn, role_en, role_hn, email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_yogaday_instructors (name_en, name_hn, role_en, role_hn, email) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name_en, name_hn, role_en, role_hn, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-yogaday/instructors error:', err);
        res.status(500).json({ error: 'Database error creating Yoga Day instructor' });
    }
});

// PUT Update Instructor
router.put('/instructors/:id', async (req, res) => {
    const { id } = req.params;
    const { name_en, name_hn, role_en, role_hn, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_yogaday_instructors 
             SET name_en=$1, name_hn=$2, role_en=$3, role_hn=$4, email=$5 
             WHERE id=$6 RETURNING *`,
            [name_en, name_hn, role_en, role_hn, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day instructor not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-yogaday/instructors/:id error:', err);
        res.status(500).json({ error: 'Database error updating Yoga Day instructor' });
    }
});

// DELETE Instructor
router.delete('/instructors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_yogaday_instructors WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Yoga Day instructor not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-yogaday/instructors/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Yoga Day instructor' });
    }
});

module.exports = router;
