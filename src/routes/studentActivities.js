const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_activities_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-activities error:', err);
        res.status(500).json({ error: 'Database error fetching student activities heading' });
    }
});

// PUT/Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        role_title_en, role_title_hn,
        role_desc_en, role_desc_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_activities_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_activities_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     role_title_en=$5, role_title_hn=$6, 
                     role_desc_en=$7, role_desc_hn=$8 
                 WHERE id=$9 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    role_title_en, role_title_hn,
                    role_desc_en, role_desc_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_activities_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    role_title_en, role_title_hn,
                    role_desc_en, role_desc_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    role_title_en, role_title_hn,
                    role_desc_en, role_desc_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-activities error:', err);
        res.status(500).json({ error: 'Database error updating student activities heading' });
    }
});

// --- List Endpoints ---

// GET All Responsibilities list
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_activities_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-activities/list error:', err);
        res.status(500).json({ error: 'Database error fetching student responsibilities list' });
    }
});

// POST New Responsibility
router.post('/list', async (req, res) => {
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO student_activities_list (activity_en, activity_hn) VALUES ($1, $2) RETURNING *',
            [activity_en, activity_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-activities/list error:', err);
        res.status(500).json({ error: 'Database error creating student responsibility' });
    }
});

// PUT Update Responsibility
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE student_activities_list SET activity_en=$1, activity_hn=$2 WHERE id=$3 RETURNING *',
            [activity_en, activity_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student responsibility not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-activities/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating student responsibility' });
    }
});

// DELETE Responsibility
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_activities_list WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student responsibility not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-activities/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting student responsibility' });
    }
});

module.exports = router;
