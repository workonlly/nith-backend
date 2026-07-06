const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_notices_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-notices error:', err);
        res.status(500).json({ error: 'Database error fetching student notices heading' });
    }
});

// PUT/Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        notices_heading_en, notices_heading_hn,
        notices_sub_en, notices_sub_hn,
        archive_heading_en, archive_heading_hn,
        archive_desc_en, archive_desc_hn
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_notices_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_notices_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     notices_heading_en=$5, notices_heading_hn=$6, 
                     notices_sub_en=$7, notices_sub_hn=$8, 
                     archive_heading_en=$9, archive_heading_hn=$10, 
                     archive_desc_en=$11, archive_desc_hn=$12 
                 WHERE id=$13 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    notices_heading_en, notices_heading_hn,
                    notices_sub_en, notices_sub_hn,
                    archive_heading_en, archive_heading_hn,
                    archive_desc_en, archive_desc_hn,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_notices_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    notices_heading_en, notices_heading_hn,
                    notices_sub_en, notices_sub_hn,
                    archive_heading_en, archive_heading_hn,
                    archive_desc_en, archive_desc_hn
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    notices_heading_en, notices_heading_hn,
                    notices_sub_en, notices_sub_hn,
                    archive_heading_en, archive_heading_hn,
                    archive_desc_en, archive_desc_hn
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-notices error:', err);
        res.status(500).json({ error: 'Database error updating student notices heading' });
    }
});

// --- List Endpoints ---

// GET All Notices list
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_notices_list ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-notices/list error:', err);
        res.status(500).json({ error: 'Database error fetching student notices list' });
    }
});

// POST New Notice
router.post('/list', async (req, res) => {
    const {
        title_en, title_hn,
        description_en, description_hn,
        date_en, date_hn,
        category_en, category_hn,
        priority_en, priority_hn,
        attachment_url
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO student_notices_list (
                title_en, title_hn,
                description_en, description_hn,
                date_en, date_hn,
                category_en, category_hn,
                priority_en, priority_hn,
                attachment_url
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                title_en, title_hn,
                description_en, description_hn,
                date_en, date_hn,
                category_en, category_hn,
                priority_en, priority_hn,
                attachment_url
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-notices/list error:', err);
        res.status(500).json({ error: 'Database error creating student notice' });
    }
});

// PUT Update Notice
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title_en, title_hn,
        description_en, description_hn,
        date_en, date_hn,
        category_en, category_hn,
        priority_en, priority_hn,
        attachment_url
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE student_notices_list 
             SET title_en=$1, title_hn=$2, 
                 description_en=$3, description_hn=$4, 
                 date_en=$5, date_hn=$6, 
                 category_en=$7, category_hn=$8, 
                 priority_en=$9, priority_hn=$10, 
                 attachment_url=$11 
             WHERE id=$12 RETURNING *`,
            [
                title_en, title_hn,
                description_en, description_hn,
                date_en, date_hn,
                category_en, category_hn,
                priority_en, priority_hn,
                attachment_url,
                id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student notice not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-notices/list/:id error:', err);
        res.status(500).json({ error: 'Database error updating student notice' });
    }
});

// DELETE Notice
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_notices_list WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student notice not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-notices/list/:id error:', err);
        res.status(500).json({ error: 'Database error deleting student notice' });
    }
});

module.exports = router;
