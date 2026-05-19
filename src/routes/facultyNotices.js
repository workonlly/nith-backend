const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_notices_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Heading (Update or Insert)
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM faculties_notices_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE faculties_notices_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO faculties_notices_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
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

// GET All Notices
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_notices_list ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST New Notice
router.post('/list', async (req, res) => {
    const { title_en, title_hn, description_en, description_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faculties_notices_list (title_en, title_hn, description_en, description_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [title_en, title_hn, description_en, description_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Update Notice
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, description_en, description_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculties_notices_list SET title_en=$1, title_hn=$2, description_en=$3, description_hn=$4, category_en=$5, category_hn=$6, date_en=$7, date_hn=$8, priority_en=$9, priority_hn=$10, view_url=$11, download_url=$12 WHERE id=$13 RETURNING *',
            [title_en, title_hn, description_en, description_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE Notice
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculties_notices_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
