const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_ncc_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-ncc error:', err);
        res.status(500).json({ error: 'Database error fetching NCC headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const { 
        title_en, title_hn, sub_title_en, sub_title_hn, 
        history_title_en, history_title_hn, history_desc_en, history_desc_hn,
        motto_title_en, motto_title_hn, motto_desc_en, motto_desc_hn,
        aim_title_en, aim_title_hn, aim_desc_en, aim_desc_hn,
        camps_title_en, camps_title_hn,
        community_title_en, community_title_hn,
        coord_email, calendar_url
    } = req.body;
    try {
        const check = await pool.query('SELECT id FROM student_ncc_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_ncc_heading 
                 SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4,
                     history_title_en=$5, history_title_hn=$6, history_desc_en=$7, history_desc_hn=$8,
                     motto_title_en=$9, motto_title_hn=$10, motto_desc_en=$11, motto_desc_hn=$12,
                     aim_title_en=$13, aim_title_hn=$14, aim_desc_en=$15, aim_desc_hn=$16,
                     camps_title_en=$17, camps_title_hn=$18,
                     community_title_en=$19, community_title_hn=$20,
                     coord_email=$21, calendar_url=$22
                 WHERE id=$23 RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    history_title_en, history_title_hn, history_desc_en, history_desc_hn,
                    motto_title_en, motto_title_hn, motto_desc_en, motto_desc_hn,
                    aim_title_en, aim_title_hn, aim_desc_en, aim_desc_hn,
                    camps_title_en, camps_title_hn,
                    community_title_en, community_title_hn,
                    coord_email, calendar_url, check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_ncc_heading (
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    history_title_en, history_title_hn, history_desc_en, history_desc_hn,
                    motto_title_en, motto_title_hn, motto_desc_en, motto_desc_hn,
                    aim_title_en, aim_title_hn, aim_desc_en, aim_desc_hn,
                    camps_title_en, camps_title_hn,
                    community_title_en, community_title_hn,
                    coord_email, calendar_url
                 ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
                [
                    title_en, title_hn, sub_title_en, sub_title_hn, 
                    history_title_en, history_title_hn, history_desc_en, history_desc_hn,
                    motto_title_en, motto_title_hn, motto_desc_en, motto_desc_hn,
                    aim_title_en, aim_title_hn, aim_desc_en, aim_desc_hn,
                    camps_title_en, camps_title_hn,
                    community_title_en, community_title_hn,
                    coord_email, calendar_url
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-ncc error:', err);
        res.status(500).json({ error: 'Database error updating NCC headings' });
    }
});

// --- Camps Endpoints ---

// GET All Camps
router.get('/camps', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_ncc_camps ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-ncc/camps error:', err);
        res.status(500).json({ error: 'Database error fetching NCC camps' });
    }
});

// POST New Camp
router.post('/camps', async (req, res) => {
    const { camp_en, camp_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_ncc_camps (camp_en, camp_hn) 
             VALUES ($1, $2) RETURNING *`,
            [camp_en, camp_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-ncc/camps error:', err);
        res.status(500).json({ error: 'Database error creating NCC camp entry' });
    }
});

// PUT Update Camp
router.put('/camps/:id', async (req, res) => {
    const { id } = req.params;
    const { camp_en, camp_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_ncc_camps 
             SET camp_en=$1, camp_hn=$2 
             WHERE id=$3 RETURNING *`,
            [camp_en, camp_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NCC camp not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-ncc/camps/:id error:', err);
        res.status(500).json({ error: 'Database error updating NCC camp entry' });
    }
});

// DELETE Camp
router.delete('/camps/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_ncc_camps WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NCC camp not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-ncc/camps/:id error:', err);
        res.status(500).json({ error: 'Database error deleting NCC camp entry' });
    }
});

// --- Community Endpoints ---

// GET All Community Services
router.get('/community', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_ncc_community ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-ncc/community error:', err);
        res.status(500).json({ error: 'Database error fetching NCC community service list' });
    }
});

// POST New Community Service
router.post('/community', async (req, res) => {
    const { service_en, service_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_ncc_community (service_en, service_hn) 
             VALUES ($1, $2) RETURNING *`,
            [service_en, service_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-ncc/community error:', err);
        res.status(500).json({ error: 'Database error creating NCC community service' });
    }
});

// PUT Update Community Service
router.put('/community/:id', async (req, res) => {
    const { id } = req.params;
    const { service_en, service_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_ncc_community 
             SET service_en=$1, service_hn=$2 
             WHERE id=$3 RETURNING *`,
            [service_en, service_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NCC community service not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-ncc/community/:id error:', err);
        res.status(500).json({ error: 'Database error updating NCC community service' });
    }
});

// DELETE Community Service
router.delete('/community/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_ncc_community WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'NCC community service not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-ncc/community/:id error:', err);
        res.status(500).json({ error: 'Database error deleting NCC community service' });
    }
});

module.exports = router;
