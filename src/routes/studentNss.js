const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_nss_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-nss error:', err);
        res.status(500).json({ error: 'Database error fetching NSS headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        title_en, title_hn, sub_title_en, sub_title_hn, 
        about_title_en, about_title_hn, about_desc_en, about_desc_hn,
        objective_title_en, objective_title_hn,
        activities_title_en, activities_title_hn,
        contact_title_en, contact_title_hn,
        coord_name_en, coord_name_hn, coord_email, coord_phone,
        coord_office_en, coord_office_hn, coord_hours_en, coord_hours_hn,
        calendar_url
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_nss_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_nss_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     about_title_en=$5, about_title_hn=$6, about_desc_en=$7, about_desc_hn=$8,
                     objective_title_en=$9, objective_title_hn=$10,
                     activities_title_en=$11, activities_title_hn=$12,
                     contact_title_en=$13, contact_title_hn=$14,
                     coord_name_en=$15, coord_name_hn=$16, coord_email=$17, coord_phone=$18,
                     coord_office_en=$19, coord_office_hn=$20, coord_hours_en=$21, coord_hours_hn=$22,
                     calendar_url=$23
                 WHERE id=$24 RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    about_title_en, about_title_hn, about_desc_en, about_desc_hn,
                    objective_title_en, objective_title_hn,
                    activities_title_en, activities_title_hn,
                    contact_title_en, contact_title_hn,
                    coord_name_en, coord_name_hn, coord_email, coord_phone,
                    coord_office_en, coord_office_hn, coord_hours_en, coord_hours_hn,
                    calendar_url, check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_nss_heading (
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    about_title_en, about_title_hn, about_desc_en, about_desc_hn,
                    objective_title_en, objective_title_hn,
                    activities_title_en, activities_title_hn,
                    contact_title_en, contact_title_hn,
                    coord_name_en, coord_name_hn, coord_email, coord_phone,
                    coord_office_en, coord_office_hn, coord_hours_en, coord_hours_hn,
                    calendar_url
                 ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    about_title_en, about_title_hn, about_desc_en, about_desc_hn,
                    objective_title_en, objective_title_hn,
                    activities_title_en, activities_title_hn,
                    contact_title_en, contact_title_hn,
                    coord_name_en, coord_name_hn, coord_email, coord_phone,
                    coord_office_en, coord_office_hn, coord_hours_en, coord_hours_hn,
                    calendar_url
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-nss error:', err);
        res.status(500).json({ error: 'Database error updating NSS headings' });
    }
});

// --- Objectives Endpoints ---

// GET All Objectives
router.get('/objectives', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_nss_objectives ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-nss/objectives error:', err);
        res.status(500).json({ error: 'Database error fetching NSS objectives' });
    }
});

// POST New Objective
router.post('/objectives', async (req, res) => {
    const { objective_en, objective_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_nss_objectives (objective_en, objective_hn) 
             VALUES ($1, $2) RETURNING *`,
            [objective_en, objective_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-nss/objectives error:', err);
        res.status(500).json({ error: 'Database error creating NSS objective' });
    }
});

// PUT Update Objective
router.put('/objectives/:id', async (req, res) => {
    const { id } = req.params;
    const { objective_en, objective_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_nss_objectives 
             SET objective_en=$1, objective_hn=$2 
             WHERE id=$3 RETURNING *`,
            [objective_en, objective_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NSS objective not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-nss/objectives/:id error:', err);
        res.status(500).json({ error: 'Database error updating NSS objective' });
    }
});

// DELETE Objective
router.delete('/objectives/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_nss_objectives WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NSS objective not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-nss/objectives/:id error:', err);
        res.status(500).json({ error: 'Database error deleting NSS objective' });
    }
});

// --- Activities Endpoints ---

// GET All Activities
router.get('/activities', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_nss_activities ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-nss/activities error:', err);
        res.status(500).json({ error: 'Database error fetching NSS activities list' });
    }
});

// POST New Activity
router.post('/activities', async (req, res) => {
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_nss_activities (activity_en, activity_hn) 
             VALUES ($1, $2) RETURNING *`,
            [activity_en, activity_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-nss/activities error:', err);
        res.status(500).json({ error: 'Database error creating NSS activity item' });
    }
});

// PUT Update Activity
router.put('/activities/:id', async (req, res) => {
    const { id } = req.params;
    const { activity_en, activity_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_nss_activities 
             SET activity_en=$1, activity_hn=$2 
             WHERE id=$3 RETURNING *`,
            [activity_en, activity_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NSS activity item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-nss/activities/:id error:', err);
        res.status(500).json({ error: 'Database error updating NSS activity item' });
    }
});

// DELETE Activity
router.delete('/activities/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_nss_activities WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NSS activity item not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-nss/activities/:id error:', err);
        res.status(500).json({ error: 'Database error deleting NSS activity item' });
    }
});

module.exports = router;
