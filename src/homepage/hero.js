// src/homepage/hero.js

const express = require('express');

const multer = require('multer');

const multerS3 = require('multer-s3');

const {
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const path = require('path');

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

    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, cb) => {

      cb(null, {
        fieldName: file.fieldname,
      });
    },

    key: (req, file, cb) => {

      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, uniqueName);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.mimetype)) {

      return cb(
        new Error(
          'Only JPG, PNG and WEBP images are allowed'
        )
      );
    }

    cb(null, true);
  },
});


// ======================================================
// GET HERO DATA
// ======================================================

router.get('/hero', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM homepage
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {

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

      return res.json({
        success: true,
        data: insertResult.rows[0],
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
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
      message: 'Hero updated successfully',
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
// GET HERO IMAGES
// ======================================================

router.get('/hero/hero-image', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM hero_image
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      images: result.rows,
    });

  } catch (err) {

    console.error('GET /hero/hero-image error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// ======================================================
// UPLOAD HERO IMAGE
// ======================================================

router.post(

  '/hero/hero-image',

  upload.single('image'),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          success: false,
          error: 'No image uploaded',
        });
      }

      console.log('Uploaded File:', req.file);

      const imageName = req.file.key;

      const imageUrl =
        `${process.env.MINIO_ENDPOINT}/images/${imageName}`;

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
          imageName,
          imageUrl,
        ]
      );

      res.status(201).json({

        success: true,

        message: 'Hero image uploaded successfully',

        data: result.rows[0],
      });

    } catch (err) {

      console.error(
        'POST /hero/hero-image error:',
        err
      );

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

router.delete('/hero/hero-image/:id', async (req, res) => {

  try {

    const id = req.params.id;

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

    const fileKey = fileRow.image;

    // =========================================
    // DELETE FROM MINIO
    // =========================================

    const deleteCommand =
      new DeleteObjectCommand({

        Bucket: 'images',

        Key: fileKey,
      });

    await s3Client.send(deleteCommand);

    console.log(
      'MinIO image deleted successfully'
    );

    // =========================================
    // DELETE FROM DATABASE
    // =========================================

    await pool.query(
      `
      DELETE FROM hero_image
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: 'Hero image deleted successfully',
    });

  } catch (err) {

    console.error(
      'DELETE /hero/hero-image/:id error:',
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;