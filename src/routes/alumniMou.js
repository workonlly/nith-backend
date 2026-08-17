const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { uploadAuthorities, deleteLocalFile } = require('../middleware/upload');

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
        const result = await pool.query('SELECT * FROM alumni_mou_list ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/list', uploadAuthorities.single(), async (req, res) => {
    const { sl_no, title_en, title_hn, drafted_date, file_type } = req.body;
    let document_url = req.body.document_url || '';
    if (req.file && req.file.location) {
        document_url = req.file.location;
    }

    try {
        const result = await pool.query(
            'INSERT INTO alumni_mou_list (sl_no, title_en, title_hn, drafted_date, document_url, file_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [sl_no || '', title_en, title_hn, drafted_date || '', document_url, file_type || 'PDF']
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/list/:id', uploadAuthorities.single(), async (req, res) => {
    const { id } = req.params;
    const { sl_no, title_en, title_hn, drafted_date, file_type } = req.body;
    let document_url = req.body.document_url;

    if (req.file && req.file.location) {
        document_url = req.file.location;
    }

    try {
        let result;
        if (document_url !== undefined) {
            result = await pool.query(
                'UPDATE alumni_mou_list SET sl_no=$1, title_en=$2, title_hn=$3, drafted_date=$4, document_url=$5, file_type=$6 WHERE id=$7 RETURNING *',
                [sl_no || '', title_en, title_hn, drafted_date || '', document_url, file_type || 'PDF', id]
            );
        } else {
            result = await pool.query(
                'UPDATE alumni_mou_list SET sl_no=$1, title_en=$2, title_hn=$3, drafted_date=$4, file_type=$5 WHERE id=$6 RETURNING *',
                [sl_no || '', title_en, title_hn, drafted_date || '', file_type || 'PDF', id]
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const check = await pool.query('SELECT document_url FROM alumni_mou_list WHERE id = $1', [id]);
        if (check.rows.length > 0 && check.rows[0].document_url) {
            deleteLocalFile(check.rows[0].document_url);
        }
        await pool.query('DELETE FROM alumni_mou_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
