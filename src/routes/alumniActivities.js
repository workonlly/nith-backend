const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumni_activities_heading ORDER BY id DESC LIMIT 1');
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
        const check = await pool.query('SELECT id FROM alumni_activities_heading');
        if (check.rows.length > 0) {
            const result = await pool.query(
                'UPDATE alumni_activities_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO alumni_activities_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
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

// GET All Activities
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumni_activities_list ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST New Activity
router.post('/list', async (req, res) => {
    const { title_en, title_hn, description_en, description_hn, date_en, date_hn, category_en, category_hn, mode_en, mode_hn, location_en, location_hn } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO alumni_activities_list (title_en, title_hn, description_en, description_hn, date_en, date_hn, category_en, category_hn, mode_en, mode_hn, location_en, location_hn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [title_en, title_hn, description_en, description_hn, date_en, date_hn, category_en, category_hn, mode_en, mode_hn, location_en, location_hn]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT Update Activity
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { title_en, title_hn, description_en, description_hn, date_en, date_hn, category_en, category_hn, mode_en, mode_hn, location_en, location_hn } = req.body;
    try {
        const result = await pool.query(
            'UPDATE alumni_activities_list SET title_en=$1, title_hn=$2, description_en=$3, description_hn=$4, date_en=$5, date_hn=$6, category_en=$7, category_hn=$8, mode_en=$9, mode_hn=$10, location_en=$11, location_hn=$12 WHERE id=$13 RETURNING *',
            [title_en, title_hn, description_en, description_hn, date_en, date_hn, category_en, category_hn, mode_en, mode_hn, location_en, location_hn, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE Activity
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM alumni_activities_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
