const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumni_mou_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM alumni_mou_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE alumni_mou_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO alumni_mou_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
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

router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumni_mou_list ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/list', async (req, res) => {
    const { title_en, title_hn, drafted_date, document_url, file_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO alumni_mou_list (title_en, title_hn, drafted_date, document_url, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title_en, title_hn, drafted_date, document_url, file_type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, drafted_date, document_url, file_type } = req.body;
    try {
        const result = await pool.query(
            'UPDATE alumni_mou_list SET title_en=$1, title_hn=$2, drafted_date=$3, document_url=$4, file_type=$5 WHERE id=$6 RETURNING *',
            [title_en, title_hn, drafted_date, document_url, file_type, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM alumni_mou_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
