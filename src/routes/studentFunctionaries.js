const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_functionaries_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-functionaries error:', err);
        res.status(500).json({ error: 'Database error fetching student functionaries heading' });
    }
});

// PUT/Update Heading singleton
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_functionaries_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_functionaries_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 
                 WHERE id=$5 RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_functionaries_heading (title_en, title_hn, sub_title_en, sub_title_hn) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-functionaries error:', err);
        res.status(500).json({ error: 'Database error updating student functionaries heading' });
    }
});

// --- List Endpoints ---

// GET All Functionaries list
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_functionaries_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-functionaries/list error:', err);
        res.status(500).json({ error: 'Database error fetching student functionaries list' });
    }
});

// POST New Functionary
router.post('/list', async (req, res) => {
    const { category_en, category_hn, name_en, name_hn, responsibility_en, responsibility_hn, phone, mobile, email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_functionaries_list (
                category_en, category_hn, 
                name_en, name_hn, 
                responsibility_en, responsibility_hn, 
                phone, mobile, email
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [category_en, category_hn, name_en, name_hn, responsibility_en, responsibility_hn, phone, mobile, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-functionaries/list error:', err);
        res.status(500).json({ error: 'Database error creating student functionary' });
    }
});

// PUT Update Functionary
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { category_en, category_hn, name_en, name_hn, responsibility_en, responsibility_hn, phone, mobile, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_functionaries_list 
             SET category_en=$1, category_hn=$2, 
                 name_en=$3, name_hn=$4, 
                 responsibility_en=$5, responsibility_hn=$6, 
                 phone=$7, mobile=$8, email=$9 
             WHERE id=$10 RETURNING *`,
            [category_en, category_hn, name_en, name_hn, responsibility_en, responsibility_hn, phone, mobile, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student functionary not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-functionaries/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating student functionary' });
    }
});

// DELETE Functionary
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_functionaries_list WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student functionary not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-functionaries/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting student functionary' });
    }
});

module.exports = router;
