const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_notices_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM faculties_notices_heading');
        let result;
        if (check.rows.length > 0) {
            result = await pool.query(
                'UPDATE faculties_notices_heading SET title_en=$1, title_hn=$2, sub_title_en=$3, sub_title_hn=$4 WHERE id=$5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
        } else {
            result = await pool.query(
                'INSERT INTO faculties_notices_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn]
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- List Endpoints ---

router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_notices_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/list', async (req, res) => {
    const { sl_no, title_en, title_hn, description_en, description_hn, remarks_en, remarks_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO faculties_notices_list (
                sl_no, title_en, title_hn, description_en, description_hn, remarks_en, remarks_hn, 
                category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                sl_no || '', title_en || '', title_hn || '', description_en || '', description_hn || '',
                remarks_en || '', remarks_hn || '', category_en || '', category_hn || '', date_en || '',
                date_hn || '', priority_en || '', priority_hn || '', view_url || '', download_url || ''
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const { sl_no, title_en, title_hn, description_en, description_hn, remarks_en, remarks_hn, category_en, category_hn, date_en, date_hn, priority_en, priority_hn, view_url, download_url } = req.body;
    try {
        const result = await pool.query(
            `UPDATE faculties_notices_list 
             SET sl_no=$1, title_en=$2, title_hn=$3, description_en=$4, description_hn=$5, remarks_en=$6, 
                 remarks_hn=$7, category_en=$8, category_hn=$9, date_en=$10, date_hn=$11, priority_en=$12, 
                 priority_hn=$13, view_url=$14, download_url=$15
             WHERE id=$16 RETURNING *`,
            [
                sl_no || '', title_en || '', title_hn || '', description_en || '', description_hn || '',
                remarks_en || '', remarks_hn || '', category_en || '', category_hn || '', date_en || '',
                date_hn || '', priority_en || '', priority_hn || '', view_url || '', download_url || '', id
            ]
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
        await pool.query('DELETE FROM faculties_notices_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
