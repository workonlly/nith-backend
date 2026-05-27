const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_nimbus_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-nimbus error:', err);
        res.status(500).json({ error: 'Database error fetching Nimbus headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_desc1_en, about_desc1_hn,
        about_desc2_en, about_desc2_hn,
        activities_title_en, activities_title_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_nimbus_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_nimbus_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_desc1_en=$5, about_desc1_hn=$6, 
                     about_desc2_en=$7, about_desc2_hn=$8,
                     activities_title_en=$9, activities_title_hn=$10
                 WHERE id=$11 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    activities_title_en, activities_title_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_nimbus_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    activities_title_en, activities_title_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    activities_title_en, activities_title_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-nimbus error:', err);
        res.status(500).json({ error: 'Database error updating Nimbus headings' });
    }
});

// --- Key Activities Endpoints ---

// GET All Activities
router.get('/activities', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_nimbus_activities ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-nimbus/activities error:', err);
        res.status(500).json({ error: 'Database error fetching Nimbus activities list' });
    }
});

// POST New Activity
router.post('/activities', async (req, res) => {
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_nimbus_activities (activity_en, activity_hn) VALUES ($1, $2) RETURNING *`,
            [activity_en, activity_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-nimbus/activities error:', err);
        res.status(500).json({ error: 'Database error creating Nimbus activity' });
    }
});

// PUT Update Activity
router.put('/activities/:id', async (req, res) => {
    const { id } = req.params;
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_nimbus_activities SET activity_en=$1, activity_hn=$2 WHERE id=$3 RETURNING *`,
            [activity_en, activity_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nimbus activity not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-nimbus/activities/:id error:', err);
        res.status(500).json({ error: 'Database error updating Nimbus activity' });
    }
});

// DELETE Activity
router.delete('/activities/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_nimbus_activities WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nimbus activity not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-nimbus/activities/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Nimbus activity' });
    }
});

module.exports = router;
