const express = require('express');

const multer = require('multer');
const multerS3 = require('multer-s3');

const path = require('path');

const pool = require('../db/db');
const s3Client = require('../db/minio');

const router = express.Router();


// ======================================================
// MULTER S3 CONFIG (MinIO Compatible)
// ======================================================

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'director-images',
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
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG and WEBP images are allowed'));
    }

    cb(null, true);
  },
});


// ======================================================
// GET /director
// ======================================================

router.get('/director', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM director
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          image: '',
          label_en: '',
          label_hi: '',
          heading_en: '',
          heading_hi: '',
          name_en: '',
          name_hi: '',
          designation_en: '',
          designation_hi: '',
          institute_en: '',
          institute_hi: '',
          message_en: '',
          message_hi: '',
        },
      });
    }

    const row = result.rows[0];

    return res.json({
      success: true,
      data: {
        image:
          row.image
            ? `${process.env.MINIO_ENDPOINT}/director-images/${row.image}`
            : '',

        label_en: row.label_en || '',
        label_hi: row.label_hi || '',

        heading_en: row.heading_en || '',
        heading_hi: row.heading_hi || '',

        name_en: row.name_en || '',
        name_hi: row.name_hi || '',

        designation_en: row.designation_en || '',
        designation_hi: row.designation_hi || '',

        institute_en: row.institute_en || '',
        institute_hi: row.institute_hi || '',

        message_en: row.message_en || '',
        message_hi: row.message_hi || '',
      },
    });

  } catch (err) {
    console.error('GET /director error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// ======================================================
// PUT /director
// ======================================================

router.put(
  '/director',
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        label_en,
        label_hi,
        heading_en,
        heading_hi,
        name_en,
        name_hi,
        designation_en,
        designation_hi,
        institute_en,
        institute_hi,
        message_en,
        message_hi,
      } = req.body;

      // MinIO gives file key automatically (like gallery.js)
      const imageName = req.file ? req.file.key : '';

      // CHECK EXISTING ROW
      const existing = await pool.query(`
        SELECT id FROM director
        LIMIT 1
      `);

      let result;

      // =========================
      // UPDATE
      // =========================
      if (existing.rows.length > 0) {
        result = await pool.query(
          `
          UPDATE director
          SET
            image = $1,

            label_en = $2,
            label_hi = $3,

            heading_en = $4,
            heading_hi = $5,

            name_en = $6,
            name_hi = $7,

            designation_en = $8,
            designation_hi = $9,

            institute_en = $10,
            institute_hi = $11,

            message_en = $12,
            message_hi = $13,

            "updatedAt" = NOW()

          WHERE id = $14

          RETURNING *
          `,
          [
            imageName,

            label_en || '',
            label_hi || '',
            heading_en || '',
            heading_hi || '',
            name_en || '',
            name_hi || '',
            designation_en || '',
            designation_hi || '',
            institute_en || '',
            institute_hi || '',
            message_en || '',
            message_hi || '',

            existing.rows[0].id,
          ]
        );
      }

      // =========================
      // INSERT
      // =========================
      else {
        result = await pool.query(
          `
          INSERT INTO director
          (
            image,
            label_en,
            label_hi,
            heading_en,
            heading_hi,
            name_en,
            name_hi,
            designation_en,
            designation_hi,
            institute_en,
            institute_hi,
            message_en,
            message_hi
          )
          VALUES
          (
            $1,$2,$3,$4,$5,$6,$7,
            $8,$9,$10,$11,$12,$13
          )
          RETURNING *
          `,
          [
            imageName,

            label_en || '',
            label_hi || '',
            heading_en || '',
            heading_hi || '',
            name_en || '',
            name_hi || '',
            designation_en || '',
            designation_hi || '',
            institute_en || '',
            institute_hi || '',
            message_en || '',
            message_hi || '',
          ]
        );
      }

      return res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (err) {
      console.error('PUT /director error:', err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

module.exports = router;