const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hostel_nith_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-hostels-at-nith error:', err);
        res.status(500).json({ error: 'Database error fetching hostels headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        title_en, title_hn, sub_title_en, sub_title_hn,
        warden_contacts_en, warden_contacts_hn, mess_timings_en, mess_timings_hn,
        rules_url, maintenance_url, emergency_url
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_hostel_nith_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_hostel_nith_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     warden_contacts_en=$5, warden_contacts_hn=$6, mess_timings_en=$7, mess_timings_hn=$8,
                     rules_url=$9, maintenance_url=$10, emergency_url=$11
                 WHERE id=$12 RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    warden_contacts_en, warden_contacts_hn, mess_timings_en, mess_timings_hn,
                    rules_url, maintenance_url, emergency_url, check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_hostel_nith_heading (
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    warden_contacts_en, warden_contacts_hn, mess_timings_en, mess_timings_hn,
                    rules_url, maintenance_url, emergency_url
                 ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn,
                    warden_contacts_en, warden_contacts_hn, mess_timings_en, mess_timings_hn,
                    rules_url, maintenance_url, emergency_url
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-hostels-at-nith error:', err);
        res.status(500).json({ error: 'Database error updating hostels headings' });
    }
});

// --- Hostels List Endpoints ---

// GET All Hostels
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_hostel_nith ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-hostels-at-nith/list error:', err);
        res.status(500).json({ error: 'Database error fetching hostels list' });
    }
});

// POST New Hostel
router.post('/list', async (req, res) => {
    const { key_name, title_en, title_hn, description_en, description_hn, photo_url, features_en, features_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_hostel_nith (key_name, title_en, title_hn, description_en, description_hn, photo_url, features_en, features_hn) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [key_name, title_en, title_hn, description_en, description_hn, photo_url || '#', features_en, features_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-hostels-at-nith/list error:', err);
        res.status(500).json({ error: 'Database error creating hostel entry' });
    }
});

// PUT Update Hostel
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { key_name, title_en, title_hn, description_en, description_hn, photo_url, features_en, features_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_hostel_nith 
             SET key_name=$1, title_en=$2, title_hn=$3, description_en=$4, description_hn=$5, photo_url=$6, features_en=$7, features_hn=$8
             WHERE id=$9 RETURNING *`,
            [key_name, title_en, title_hn, description_en, description_hn, photo_url || '#', features_en, features_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hostel not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-hostels-at-nith/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating hostel entry' });
    }
});

// DELETE Hostel
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_hostel_nith WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hostel not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-hostels-at-nith/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting hostel entry' });
    }
});

module.exports = router;
