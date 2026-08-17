const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET heading
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculties_functionaries_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE heading
router.put('/', async (req, res) => {
    const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
    try {
        const check = await pool.query('SELECT id FROM faculties_functionaries_heading');
        let result;
        if (check.rows.length > 0) {
            result = await pool.query(
                'UPDATE faculties_functionaries_heading SET title_en = $1, title_hn = $2, sub_title_en = $3, sub_title_hn = $4 WHERE id = $5 RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
            );
        } else {
            result = await pool.query(
                'INSERT INTO faculties_functionaries_heading (title_en, title_hn, sub_title_en, sub_title_hn) VALUES ($1, $2, $3, $4) RETURNING *',
                [title_en, title_hn, sub_title_en, sub_title_hn]
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all functionaries
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT f.*, ft.image_url as faculty_photo 
            FROM faculties_functionaries_list f
            LEFT JOIN faculties_table ft ON f.faculty_id = ft.id
            ORDER BY f.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE functionary
router.post('/list', async (req, res) => {
    const {
        category_en, category_hn, category_description_en, category_description_hn,
        sl_no, role_en, role_hn, name_en, name_hn, department_en, department_hn,
        phone, email, faculty_id, since_date_en, since_date_hn
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO faculties_functionaries_list (
                category_en, category_hn, category_description_en, category_description_hn,
                sl_no, role_en, role_hn, name_en, name_hn, department_en, department_hn,
                phone, email, faculty_id, since_date_en, since_date_hn
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [
                category_en, category_hn, category_description_en, category_description_hn,
                sl_no || '', role_en, role_hn, name_en, name_hn, department_en, department_hn,
                phone || '', email || '', faculty_id ? parseInt(faculty_id) : null, since_date_en, since_date_hn
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE functionary
router.put('/list/:id', async (req, res) => {
    const { id } = req.params;
    const {
        category_en, category_hn, category_description_en, category_description_hn,
        sl_no, role_en, role_hn, name_en, name_hn, department_en, department_hn,
        phone, email, faculty_id, since_date_en, since_date_hn
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE faculties_functionaries_list 
             SET category_en = $1, category_hn = $2, category_description_en = $3, category_description_hn = $4,
                 sl_no = $5, role_en = $6, role_hn = $7, name_en = $8, name_hn = $9, department_en = $10,
                 department_hn = $11, phone = $12, email = $13, faculty_id = $14, since_date_en = $15, since_date_hn = $16
             WHERE id = $17 RETURNING *`,
            [
                category_en, category_hn, category_description_en, category_description_hn,
                sl_no || '', role_en, role_hn, name_en, name_hn, department_en, department_hn,
                phone || '', email || '', faculty_id ? parseInt(faculty_id) : null, since_date_en, since_date_hn, id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE functionary
router.delete('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculties_functionaries_list WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
