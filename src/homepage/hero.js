// src/homepage/hero.js

const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
// 1. Import the command for AWS SDK v3
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../db/db');
const s3Client = require('../db/minio');

const router = express.Router();

// ===========================
// Multer for hero_image uploads (MinIO)
// ===========================
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'images', // MinIO bucket name
    key: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
});

// ===========================
// HOMEPAGE TABLE (GET / PUT)
// ===========================

// GET latest homepage row
router.get('/homepage', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM homepage ORDER BY createdat DESC LIMIT 1'
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('GET /hero/homepage error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT homepage (update row with id = 1)
router.put('/homepage', async (req, res) => {
  try {
    const {
      heromaintext,
      herosubheading,
      herodescheading,
      aboutdesc,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE homepage SET 
        heromaintext    = $1,
        herosubheading  = $2,
        herodescheading = $3,
        aboutdesc       = $4,
        updatedat       = NOW()
      WHERE id = 1
      RETURNING *;
      `,
      [heromaintext, herosubheading, herodescheading, aboutdesc]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /hero/homepage error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// HERO_IMAGE TABLE (POST / GET / DELETE)
// ========================================

// GET all hero images (latest first)
router.get('/hero-image', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hero_image ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /hero/hero-image error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST new hero image (upload to MinIO + save URL)
router.post('/hero-image', upload.single('image'), async (req, res) => {
  try {
    console.log('MinIO file:', req.file); // Debug

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await pool.query(
      `
      INSERT INTO hero_image (image, image_url)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [req.file.originalname, req.file.location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /hero/hero-image error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE hero image by id
router.delete('/hero-image/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Get the image URL from the database
    const fileResult = await pool.query('SELECT * FROM hero_image WHERE id = $1', [id]);
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const fileRow = fileResult.rows[0];
    const fileUrl = fileRow.image_url;
    
    // 2. Extract Key safely
    // We decodeURIComponent to handle spaces/symbols (e.g., "My%20Image.jpg" -> "My Image.jpg")
    const fileKey = decodeURIComponent(fileUrl.split('/').pop()); 
    const bucketName = 'images'; 

    console.log(`[Backend] Attempting to delete file from MinIO. Bucket: ${bucketName}, Key: ${fileKey}`);

    // 3. Delete from MinIO (Using AWS SDK v3 syntax)
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      await s3Client.send(deleteCommand);
      
      console.log('[Backend] MinIO deletion successful');
    } catch (s3Err) {
      // Log error but continue to delete from DB to prevent sync issues
      console.error('[Backend] MinIO Delete Error:', s3Err);
    }
    
    // 4. Delete from Database
    await pool.query('DELETE FROM hero_image WHERE id = $1', [id]);
    
    console.log('[Backend] Database deletion successful');
    res.json({ success: true });

  } catch (err) {
    console.error('DELETE /hero/hero-image/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;