const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ==========================================
// 1. Heading Endpoints
// ==========================================

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_distinguished_heading ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('GET /api/alumni-distinguished error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/', async (req, res) => {
  const { title_en, title_hn, sub_title_en, sub_title_hn } = req.body;
  try {
    const check = await pool.query('SELECT id FROM alumni_distinguished_heading');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE alumni_distinguished_heading 
         SET title_en = $1, title_hn = $2, sub_title_en = $3, sub_title_hn = $4 
         WHERE id = $5 RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO alumni_distinguished_heading (title_en, title_hn, sub_title_en, sub_title_hn) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title_en, title_hn, sub_title_en, sub_title_hn]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-distinguished error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// 2. Distinguished Alumni List Endpoints
// ==========================================

router.get('/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumni_distinguished_list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/alumni-distinguished/list error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/list', upload.single('photo_file'), async (req, res) => {
  const {
    sl_no,
    name_en,
    name_hn,
    batch_en,
    batch_hn,
    achievement_en,
    achievement_hn,
    department_en,
    department_hn,
    linkedin
  } = req.body;

  let photo = req.body.photo || '';
  if (req.file) {
    photo = 'http://localhost:4000/uploads/' + req.file.filename;
  }

  try {
    const result = await pool.query(
      `INSERT INTO alumni_distinguished_list (
        sl_no, name_en, name_hn, batch_en, batch_hn, photo, 
        achievement_en, achievement_hn, department_en, department_hn, linkedin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        sl_no || '',
        name_en || '',
        name_hn || '',
        batch_en || '',
        batch_hn || '',
        photo,
        achievement_en || '',
        achievement_hn || '',
        department_en || '',
        department_hn || '',
        linkedin || ''
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/alumni-distinguished/list error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/list/:id', upload.single('photo_file'), async (req, res) => {
  const { id } = req.params;
  const {
    sl_no,
    name_en,
    name_hn,
    batch_en,
    batch_hn,
    achievement_en,
    achievement_hn,
    department_en,
    department_hn,
    linkedin
  } = req.body;

  let photo = req.body.photo;
  if (req.file) {
    photo = 'http://localhost:4000/uploads/' + req.file.filename;
  }

  try {
    let result;
    if (photo !== undefined) {
      result = await pool.query(
        `UPDATE alumni_distinguished_list 
         SET sl_no = $1, name_en = $2, name_hn = $3, batch_en = $4, batch_hn = $5, photo = $6, 
             achievement_en = $7, achievement_hn = $8, department_en = $9, department_hn = $10, linkedin = $11 
         WHERE id = $12 RETURNING *`,
        [
          sl_no || '',
          name_en || '',
          name_hn || '',
          batch_en || '',
          batch_hn || '',
          photo,
          achievement_en || '',
          achievement_hn || '',
          department_en || '',
          department_hn || '',
          linkedin || '',
          id
        ]
      );
    } else {
      result = await pool.query(
        `UPDATE alumni_distinguished_list 
         SET sl_no = $1, name_en = $2, name_hn = $3, batch_en = $4, batch_hn = $5, 
             achievement_en = $6, achievement_hn = $7, department_en = $8, department_hn = $9, linkedin = $10 
         WHERE id = $11 RETURNING *`,
        [
          sl_no || '',
          name_en || '',
          name_hn || '',
          batch_en || '',
          batch_hn || '',
          achievement_en || '',
          achievement_hn || '',
          department_en || '',
          department_hn || '',
          linkedin || '',
          id
        ]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/alumni-distinguished/list/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/list/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alumni_distinguished_list WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/alumni-distinguished/list/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
