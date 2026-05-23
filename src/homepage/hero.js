// src/homepage/hero.js

const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const pool = require('../db/db');
const s3Client = require('../db/minio');

const router = express.Router();

// ======================================================
// MULTER CONFIG (MinIO Upload)
// ======================================================

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'images',

    key: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// ======================================================
// HOMEPAGE HERO SECTION
// ======================================================

/*
  DATABASE REQUIRED COLUMNS:

  heromaintext_en
  heromaintext_hi

  herosubheading_en
  herosubheading_hi

  herodescheading_en
  herodescheading_hi
*/

// ======================================================
// GET HERO DATA
// ======================================================

router.get('/hero', async (req, res) => {
  console.log('Frontend connected to Hero API');

  try {

    // Always fetch latest row
    const result = await pool.query(`
      SELECT *
      FROM homepage
      ORDER BY id DESC
      LIMIT 1
    `);

    // No row found
    if (result.rows.length === 0) {

      // Optional: create default row automatically
      const insertResult = await pool.query(`
        INSERT INTO homepage (

          heromaintext_en,
          heromaintext_hi,

          herosubheading_en,
          herosubheading_hi,

          herodescheading_en,
          herodescheading_hi,

          aboutdesc

        )
        VALUES (

          'NIT HAMIRPUR',
          'एनआईटी हमीरपुर',

          'Shaping Minds. Building Futures.',
          'दिमाग को आकार देना। भविष्य का निर्माण करना।',

          'NIT Hamirpur is committed to academic excellence.',
          'एनआईटी हमीरपुर शैक्षणिक उत्कृष्टता के लिए प्रतिबद्ध है।',

          ''

        )
        RETURNING *;
      `);

      const newRow = insertResult.rows[0];

      return res.json({
        success: true,

        data: {
          heading_en: newRow.heromaintext_en || '',
          heading_hi: newRow.heromaintext_hi || '',

          tagline_en: newRow.herosubheading_en || '',
          tagline_hi: newRow.herosubheading_hi || '',

          description_en:
            newRow.herodescheading_en || '',

          description_hi:
            newRow.herodescheading_hi || '',
        },
      });
    }

    // Existing row
    const row = result.rows[0];

    res.json({
      success: true,

      data: {
        heading_en: row.heromaintext_en || '',
        heading_hi: row.heromaintext_hi || '',

        tagline_en: row.herosubheading_en || '',
        tagline_hi: row.herosubheading_hi || '',

        description_en:
          row.herodescheading_en || '',

        description_hi:
          row.herodescheading_hi || '',
      },
    });

  } catch (err) {
    console.error('GET /hero error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================================================
// UPDATE HERO DATA
// ======================================================

router.put('/hero', async (req, res) => {
  console.log('PUT HERO BODY:', req.body);

  try {
    const {
      heromaintext_en,
      heromaintext_hi,

      herosubheading_en,
      herosubheading_hi,

      herodescheading_en,
      herodescheading_hi,

      aboutdesc,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE homepage
      SET

        heromaintext_en = $1,
        heromaintext_hi = $2,

        herosubheading_en = $3,
        herosubheading_hi = $4,

        herodescheading_en = $5,
        herodescheading_hi = $6,

        aboutdesc = $7,

        updatedat = NOW()

      WHERE id = 1

      RETURNING *;
      `,
      [
        heromaintext_en,
        heromaintext_hi,

        herosubheading_en,
        herosubheading_hi,

        herodescheading_en,
        herodescheading_hi,

        aboutdesc || '',
      ]
    );

    res.json({
      success: true,
      message: 'Hero section updated successfully',
      data: result.rows[0],
    });

  } catch (err) {
    console.error('PUT /hero error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================================================
// HERO IMAGE ROUTES
// ======================================================

// ======================================================
// GET ALL HERO IMAGES
// ======================================================

router.get('/hero-image', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM hero_image
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error('GET /hero-image error:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================================================
// UPLOAD HERO IMAGE
// ======================================================

router.post(
  '/hero-image',
  upload.single('image'),
  async (req, res) => {
    try {
      console.log('Uploaded File:', req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const result = await pool.query(
        `
        INSERT INTO hero_image (
          image,
          image_url
        )
        VALUES ($1, $2)
        RETURNING *;
        `,
        [
          req.file.originalname,
          req.file.location,
        ]
      );

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: result.rows[0],
      });

    } catch (err) {
      console.error('POST /hero-image error:', err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// ======================================================
// DELETE HERO IMAGE
// ======================================================

router.delete('/hero-image/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Get Image Row
    const fileResult = await pool.query(
      `
      SELECT *
      FROM hero_image
      WHERE id = $1
      `,
      [id]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    const fileRow = fileResult.rows[0];

    const fileUrl = fileRow.image_url;

    // Extract file key from URL
    const fileKey = decodeURIComponent(
      fileUrl.split('/').pop()
    );

    const bucketName = 'images';

    console.log(
      `Deleting from MinIO -> Bucket: ${bucketName}, Key: ${fileKey}`
    );

    // Delete from MinIO
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      await s3Client.send(deleteCommand);

      console.log('MinIO deletion successful');

    } catch (s3Err) {
      console.error(
        'MinIO Delete Error:',
        s3Err
      );
    }

    // Delete from Database
    await pool.query(
      `
      DELETE FROM hero_image
      WHERE id = $1
      `,
      [id]
    );

    console.log('Database deletion successful');

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (err) {
    console.error(
      'DELETE /hero-image/:id error:',
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;