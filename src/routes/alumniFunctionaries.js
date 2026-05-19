const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumni_functionaries_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM alumni_functionaries_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE alumni_functionaries_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO alumni_functionaries_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
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
        const result = await pool.query('SELECT * FROM alumni_functionaries_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/list', async (req, res) => {
    const { section_title_en, section_title_hn, sl_no, name_en, name_hn, responsibility_en, responsibility_hn, phone, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO alumni_functionaries_list (section_title_en, section_title_hn, sl_no, name_en, name_hn, responsibility_en, responsibility_hn, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [section_title_en, section_title_hn, sl_no, name_en, name_hn, responsibility_en, responsibility_hn, phone, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { section_title_en, section_title_hn, sl_no, name_en, name_hn, responsibility_en, responsibility_hn, phone, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE alumni_functionaries_list SET section_title_en=$1, section_title_hn=$2, sl_no=$3, name_en=$4, name_hn=$5, responsibility_en=$6, responsibility_hn=$7, phone=$8, email=$9 WHERE id=$10 RETURNING *',
            [section_title_en, section_title_hn, sl_no, name_en, name_hn, responsibility_en, responsibility_hn, phone, email, id]
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
        await pool.query('DELETE FROM alumni_functionaries_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
