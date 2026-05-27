const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_innovation_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-innovation error:', err);
        res.status(500).json({ error: 'Database error fetching Innovation headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc1_en, about_desc1_hn,
        about_desc2_en, about_desc2_hn,
        focus_title_en, focus_title_hn,
        programs_title_en, programs_title_hn,
        join_title_en, join_title_hn,
        contact_email
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_innovation_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_innovation_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     about_title_en=$5, about_title_hn=$6, 
                     about_desc1_en=$7, about_desc1_hn=$8,
                     about_desc2_en=$9, about_desc2_hn=$10,
                     focus_title_en=$11, focus_title_hn=$12,
                     programs_title_en=$13, programs_title_hn=$14,
                     join_title_en=$15, join_title_hn=$16,
                     contact_email=$17
                 WHERE id=$18 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    focus_title_en, focus_title_hn,
                    programs_title_en, programs_title_hn,
                    join_title_en, join_title_hn,
                    contact_email,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_innovation_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    focus_title_en, focus_title_hn,
                    programs_title_en, programs_title_hn,
                    join_title_en, join_title_hn,
                    contact_email
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    about_title_en, about_title_hn,
                    about_desc1_en, about_desc1_hn,
                    about_desc2_en, about_desc2_hn,
                    focus_title_en, focus_title_hn,
                    programs_title_en, programs_title_hn,
                    join_title_en, join_title_hn,
                    contact_email
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-innovation error:', err);
        res.status(500).json({ error: 'Database error updating Innovation headings' });
    }
});

// --- Focus Areas Endpoints ---

// GET All Focus Areas
router.get('/focus', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_innovation_focus ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-innovation/focus error:', err);
        res.status(500).json({ error: 'Database error fetching Innovation focus list' });
    }
});

// POST New Focus
router.post('/focus', async (req, res) => {
    const { focus_en, focus_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_innovation_focus (focus_en, focus_hn) VALUES ($1, $2) RETURNING *`,
            [focus_en, focus_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-innovation/focus error:', err);
        res.status(500).json({ error: 'Database error creating Innovation focus area' });
    }
});

// PUT Update Focus
router.put('/focus/:id', async (req, res) => {
    const { id } = req.params;
    const { focus_en, focus_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_innovation_focus SET focus_en=$1, focus_hn=$2 WHERE id=$3 RETURNING *`,
            [focus_en, focus_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation focus not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-innovation/focus/:id error:', err);
        res.status(500).json({ error: 'Database error updating Innovation focus' });
    }
});

// DELETE Focus
router.delete('/focus/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_innovation_focus WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation focus not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-innovation/focus/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Innovation focus' });
    }
});

// --- Programs Endpoints ---

// GET All Programs
router.get('/programs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_innovation_programs ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-innovation/programs error:', err);
        res.status(500).json({ error: 'Database error fetching Innovation programs list' });
    }
});

// POST New Program
router.post('/programs', async (req, res) => {
    const { program_en, program_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_innovation_programs (program_en, program_hn) VALUES ($1, $2) RETURNING *`,
            [program_en, program_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-innovation/programs error:', err);
        res.status(500).json({ error: 'Database error creating Innovation program' });
    }
});

// PUT Update Program
router.put('/programs/:id', async (req, res) => {
    const { id } = req.params;
    const { program_en, program_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_innovation_programs SET program_en=$1, program_hn=$2 WHERE id=$3 RETURNING *`,
            [program_en, program_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation program not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-innovation/programs/:id error:', err);
        res.status(500).json({ error: 'Database error updating Innovation program' });
    }
});

// DELETE Program
router.delete('/programs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_innovation_programs WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation program not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-innovation/programs/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Innovation program' });
    }
});

// --- Join Steps Endpoints ---

// GET All Steps
router.get('/steps', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_innovation_join_steps ORDER BY step_order ASC, id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-innovation/steps error:', err);
        res.status(500).json({ error: 'Database error fetching Innovation steps list' });
    }
});

// POST New Step
router.post('/steps', async (req, res) => {
    const { step_order, step_en, step_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_innovation_join_steps (step_order, step_en, step_hn) VALUES ($1, $2, $3) RETURNING *`,
            [step_order || 1, step_en, step_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-innovation/steps error:', err);
        res.status(500).json({ error: 'Database error creating Innovation join step' });
    }
});

// PUT Update Step
router.put('/steps/:id', async (req, res) => {
    const { id } = req.params;
    const { step_order, step_en, step_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_innovation_join_steps SET step_order=$1, step_en=$2, step_hn=$3 WHERE id=$4 RETURNING *`,
            [step_order || 1, step_en, step_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation step not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-innovation/steps/:id error:', err);
        res.status(500).json({ error: 'Database error updating Innovation join step' });
    }
});

// DELETE Step
router.delete('/steps/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_innovation_join_steps WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Innovation step not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-innovation/steps/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Innovation join step' });
    }
});

module.exports = router;
