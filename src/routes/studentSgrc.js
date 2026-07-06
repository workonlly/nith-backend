const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// ==========================================
// 1. Heading Endpoints (Singleton)
// ==========================================

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sgrc_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-sgrc error:', err);
        res.status(500).json({ error: 'Database error fetching SGRC heading' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc_en, about_desc_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_sgrc_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_sgrc_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_title_en=$5, about_title_hn=$6, 
                     about_desc_en=$7, about_desc_hn=$8 
                 WHERE id=$9 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_sgrc_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc_en, about_desc_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-sgrc error:', err);
        res.status(500).json({ error: 'Database error updating SGRC heading' });
    }
});

// ==========================================
// 2. Objectives Endpoints
// ==========================================

// GET All Objectives
router.get('/objectives', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sgrc_objectives ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sgrc/objectives error:', err);
        res.status(500).json({ error: 'Database error fetching SGRC objectives' });
    }
});

// POST New Objective
router.post('/objectives', async (req, res) => {
    const { objective_en, objective_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO student_sgrc_objectives (objective_en, objective_hn) VALUES ($1, $2) RETURNING *',
            [objective_en, objective_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sgrc/objectives error:', err);
        res.status(500).json({ error: 'Database error creating SGRC objective' });
    }
});

// PUT Update Objective
router.put('/objectives/:id', async (req, res) => {
    const { id } = req.params;
    const { objective_en, objective_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE student_sgrc_objectives SET objective_en=$1, objective_hn=$2 WHERE id=$3 RETURNING *',
            [objective_en, objective_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC objective not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sgrc/objectives/:id error:', err);
        res.status(500).json({ error: 'Database error updating SGRC objective' });
    }
});

// DELETE Objective
router.delete('/objectives/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sgrc_objectives WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC objective not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sgrc/objectives/:id error:', err);
        res.status(500).json({ error: 'Database error deleting SGRC objective' });
    }
});

// ==========================================
// 3. Members Endpoints
// ==========================================

// GET All Members
router.get('/members', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sgrc_members ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sgrc/members error:', err);
        res.status(500).json({ error: 'Database error fetching SGRC members' });
    }
});

// POST New Member
router.post('/members', async (req, res) => {
    const {
        name_en, name_hn,
        designation_en, designation_hn,
        department_en, department_hn,
        role_en, role_hn
    } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_sgrc_members (
                name_en, name_hn, 
                designation_en, designation_hn, 
                department_en, department_hn, 
                role_en, role_hn
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                name_en, name_hn,
                designation_en, designation_hn,
                department_en, department_hn,
                role_en, role_hn
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sgrc/members error:', err);
        res.status(500).json({ error: 'Database error creating SGRC member' });
    }
});

// PUT Update Member
router.put('/members/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name_en, name_hn,
        designation_en, designation_hn,
        department_en, department_hn,
        role_en, role_hn
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_sgrc_members 
             SET name_en=$1, name_hn=$2, 
                 designation_en=$3, designation_hn=$4, 
                 department_en=$5, department_hn=$6, 
                 role_en=$7, role_hn=$8 
             WHERE id=$9 RETURNING *`,
            [
                name_en, name_hn,
                designation_en, designation_hn,
                department_en, department_hn,
                role_en, role_hn,
                id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC member not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sgrc/members/:id error:', err);
        res.status(500).json({ error: 'Database error updating SGRC member' });
    }
});

// DELETE Member
router.delete('/members/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sgrc_members WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC member not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sgrc/members/:id error:', err);
        res.status(500).json({ error: 'Database error deleting SGRC member' });
    }
});

// ==========================================
// 4. Meetings Endpoints
// ==========================================

// GET All Meetings
router.get('/meetings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sgrc_meetings ORDER BY date DESC, id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sgrc/meetings error:', err);
        res.status(500).json({ error: 'Database error fetching SGRC meetings' });
    }
});

// POST New Meeting
router.post('/meetings', async (req, res) => {
    const { date, agenda_en, agenda_hn, minutes_en, minutes_hn, status_en, status_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_sgrc_meetings (
                date, agenda_en, agenda_hn, minutes_en, minutes_hn, status_en, status_hn
             ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [date, agenda_en, agenda_hn, minutes_en, minutes_hn, status_en, status_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sgrc/meetings error:', err);
        res.status(500).json({ error: 'Database error creating SGRC meeting' });
    }
});

// PUT Update Meeting
router.put('/meetings/:id', async (req, res) => {
    const { id } = req.params;
    const { date, agenda_en, agenda_hn, minutes_en, minutes_hn, status_en, status_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_sgrc_meetings 
             SET date=$1, agenda_en=$2, agenda_hn=$3, minutes_en=$4, minutes_hn=$5, status_en=$6, status_hn=$7 
             WHERE id=$8 RETURNING *`,
            [date, agenda_en, agenda_hn, minutes_en, minutes_hn, status_en, status_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC meeting not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sgrc/meetings/:id error:', err);
        res.status(500).json({ error: 'Database error updating SGRC meeting' });
    }
});

// DELETE Meeting
router.delete('/meetings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sgrc_meetings WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SGRC meeting not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sgrc/meetings/:id error:', err);
        res.status(500).json({ error: 'Database error deleting SGRC meeting' });
    }
});

module.exports = router;
