const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_cpda_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Heading
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM faculties_cpda_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE faculties_cpda_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO faculties_cpda_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- List Endpoints ---

// GET All CPDA Rules
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_cpda_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST New CPDA Rule
router.post('/list', async (req, res) => {
    const { particulars_en, particulars_hn, pdf_url, word_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faculties_cpda_list (particulars_en, particulars_hn, pdf_url, word_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [particulars_en, particulars_hn, pdf_url, word_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Update CPDA Rule
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { particulars_en, particulars_hn, pdf_url, word_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculties_cpda_list SET particulars_en=$1, particulars_hn=$2, pdf_url=$3, word_url=$4 WHERE id=$5 RETURNING *',
            [particulars_en, particulars_hn, pdf_url, word_url, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE CPDA Rule
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculties_cpda_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
