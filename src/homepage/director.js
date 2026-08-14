const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { sql, s3Client } = require('../db/neon');

const router = express.Router();

// ======================================================
// MULTER S3 CONFIG
// ======================================================

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'nit',
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
      cb(null, `director-images/${uniqueName}`);
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
    const result = await sql`
      SELECT *
      FROM director
      ORDER BY id DESC
      LIMIT 1
    `;

    if (result.length === 0) {
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

    const row = result[0];

    return res.json({
      success: true,
      data: {
        image: row.image || '',
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

      const imageName = req.file ? req.file.key : '';
      const imageUrl = imageName ? `${process.env.AWS_ENDPOINT_URL_S3}/nit/${imageName}` : null;

      // CHECK EXISTING ROW
      const existing = await sql`
        SELECT id FROM director
        LIMIT 1
      `;

      let result;

      // =========================
      // UPDATE
      // =========================
      if (existing.length > 0) {
        result = await sql`
          UPDATE director
          SET
            image = COALESCE(${imageUrl}, image),
            label_en = ${label_en || ''},
            label_hi = ${label_hi || ''},
            heading_en = ${heading_en || ''},
            heading_hi = ${heading_hi || ''},
            name_en = ${name_en || ''},
            name_hi = ${name_hi || ''},
            designation_en = ${designation_en || ''},
            designation_hi = ${designation_hi || ''},
            institute_en = ${institute_en || ''},
            institute_hi = ${institute_hi || ''},
            message_en = ${message_en || ''},
            message_hi = ${message_hi || ''},
            updatedat = NOW()
          WHERE id = ${existing[0].id}
          RETURNING *
        `;
      }
      // =========================
      // INSERT
      // =========================
      else {
        result = await sql`
          INSERT INTO director (
            image, label_en, label_hi, heading_en, heading_hi, name_en, name_hi, designation_en, designation_hi, institute_en, institute_hi, message_en, message_hi
          )
          VALUES (
            ${imageUrl || ''}, ${label_en || ''}, ${label_hi || ''}, ${heading_en || ''}, ${heading_hi || ''}, ${name_en || ''}, ${name_hi || ''}, ${designation_en || ''}, ${designation_hi || ''}, ${institute_en || ''}, ${institute_hi || ''}, ${message_en || ''}, ${message_hi || ''}
          )
          RETURNING *
        `;
      }

      return res.json({
        success: true,
        data: result[0],
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