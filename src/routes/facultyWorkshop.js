const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_workshop_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Heading
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn, tab1_name_en, tab1_name_hn, tab2_name_en, tab2_name_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM faculties_workshop_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE faculties_workshop_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4, tab1_name_en=$5, tab1_name_hn=$6, tab2_name_en=$7, tab2_name_hn=$8 WHERE id=$9 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, tab1_name_en, tab1_name_hn, tab2_name_en, tab2_name_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO faculties_workshop_heading (title_en, title_hn, sub_title_en, sub_title_hn, tab1_name_en, tab1_name_hn, tab2_name_en, tab2_name_hn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, tab1_name_en, tab1_name_hn, tab2_name_en, tab2_name_hn]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- List Endpoints ---

// GET All Workshop Rules
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_workshop_list ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST New Workshop Rule
router.post('/list', async (req, res) => {
    const { title_en, title_hn, description_en, description_hn, pdf_url, word_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faculties_workshop_list (title_en, title_hn, description_en, description_hn, pdf_url, word_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title_en, title_hn, description_en, description_hn, pdf_url, word_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Update Workshop Rule
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, description_en, description_hn, pdf_url, word_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculties_workshop_list SET title_en=$1, title_hn=$2, description_en=$3, description_hn=$4, pdf_url=$5, word_url=$6 WHERE id=$7 RETURNING *',
            [title_en, title_hn, description_en, description_hn, pdf_url, word_url, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE Workshop Rule
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculties_workshop_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Notices Endpoints ---

// GET All Workshop Notices
router.get('/notices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_workshop_notices ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST New Workshop Notice
router.post('/notices', async (req, res) => {
    const { title_en, title_hn, description_en, description_hn, pdf_url, word_url, date_en, date_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faculties_workshop_notices (title_en, title_hn, description_en, description_hn, pdf_url, word_url, date_en, date_hn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title_en, title_hn, description_en, description_hn, pdf_url, word_url, date_en, date_hn]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Update Workshop Notice
router.put('/notices/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, description_en, description_hn, pdf_url, word_url, date_en, date_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculties_workshop_notices SET title_en=$1, title_hn=$2, description_en=$3, description_hn=$4, pdf_url=$5, word_url=$6, date_en=$7, date_hn=$8 WHERE id=$9 RETURNING *',
            [title_en, title_hn, description_en, description_hn, pdf_url, word_url, date_en, date_hn, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE Workshop Notice
router.delete('/notices/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculties_workshop_notices WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
