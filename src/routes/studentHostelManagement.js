const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hostel_management_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-hostel-management error:', err);
        res.status(500).json({ error: 'Database error fetching hostel management headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_hostel_management_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_hostel_management_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4
                 WHERE id=$5 RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_hostel_management_heading (title_en, title_hn, sub_title_en, sub_title_hn) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [title_en, title_hn, sub_title_en, sub_title_hn]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-hostel-management error:', err);
        res.status(500).json({ error: 'Database error updating hostel management headings' });
    }
});

// --- Functionaries Endpoints ---

// GET All Functionaries
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hostel_management_functionaries ORDER BY priority ASC, id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-hostel-management/list error:', err);
        res.status(500).json({ error: 'Database error fetching hostel functionaries list' });
    }
});

// POST New Functionary
router.post('/list', async (req, res) => {
    const { hostel_name, name, responsibility, phone, email, priority } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_hostel_management_functionaries (hostel_name, name, responsibility, phone, email, priority) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [hostel_name, name, responsibility, phone, email, priority || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-hostel-management/list error:', err);
        res.status(500).json({ error: 'Database error creating hostel functionary' });
    }
});

// PUT Update Functionary
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { hostel_name, name, responsibility, phone, email, priority } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_hostel_management_functionaries 
             SET hostel_name=$1, name=$2, responsibility=$3, phone=$4, email=$5, priority=$6 
             WHERE id=$7 RETURNING *`,
            [hostel_name, name, responsibility, phone, email, priority || 0, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Functionary not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-hostel-management/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating hostel functionary' });
    }
});

// DELETE Functionary
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_hostel_management_functionaries WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Functionary not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-hostel-management/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting hostel functionary' });
    }
});

module.exports = router;
