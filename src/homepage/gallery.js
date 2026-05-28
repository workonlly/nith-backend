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
// MULTER CONFIG
// ======================================================

const upload = multer({

  storage: multerS3({

    s3: s3Client,

    bucket: 'gallery-images',

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
// GET GALLERY
// ======================================================

router.get('/gallery', async (req, res) => {

  try {

    const sectionResult = await pool.query(`
      SELECT *
      FROM gallery_section
      ORDER BY id DESC
      LIMIT 1
    `);

    const imagesResult = await pool.query(`
      SELECT *
      FROM gallery_images
      ORDER BY id ASC
    `);

    const section =
      sectionResult.rows[0] || {

        heading_en: '',
        heading_hi: '',

        description_en: '',
        description_hi: '',
      };

    const images = imagesResult.rows.map(
      (img) => ({
        id: img.id,

        title_en: img.title_en,
        title_hi: img.title_hi,

        category_en: img.category_en,
        category_hi: img.category_hi,

        altText_en: img.alt_text_en,
        altText_hi: img.alt_text_hi,

        imageUrl:
          `${process.env.MINIO_ENDPOINT}/gallery-images/${img.image}`,
      })
    );

    res.json({
      success: true,

      data: {

        heading_en:
          section.heading_en || '',

        heading_hi:
          section.heading_hi || '',

        description_en:
          section.description_en || '',

        description_hi:
          section.description_hi || '',

        images,
      },
    });

  } catch (err) {

    console.error(
      'GET /gallery error:',
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// ======================================================
// UPDATE GALLERY
// ======================================================

router.put(

  '/gallery',

  upload.array('images'),

  async (req, res) => {

    try {

      const {

        heading_en,
        heading_hi,

        description_en,
        description_hi,

      } = req.body;

      const parsedImages =
        JSON.parse(req.body.images);

      // =====================================
      // UPDATE SECTION
      // =====================================

      await pool.query(`
        DELETE FROM gallery_section
      `);

      await pool.query(

        `
        INSERT INTO gallery_section
        (

          heading_en,
          heading_hi,

          description_en,
          description_hi

        )
        VALUES ($1, $2, $3, $4)
        `,

        [

          heading_en || '',
          heading_hi || '',

          description_en || '',
          description_hi || '',
        ]
      );

      // =====================================
      // DELETE OLD MINIO FILES
      // =====================================

      const oldImages = await pool.query(`
        SELECT *
        FROM gallery_images
      `);

      for (const oldImage of oldImages.rows) {

        if (oldImage.image) {

          const deleteCommand =
            new DeleteObjectCommand({

              Bucket: 'gallery-images',

              Key: oldImage.image,
            });

          await s3Client.send(deleteCommand);
        }
      }

      // =====================================
      // DELETE OLD DB IMAGES
      // =====================================

      await pool.query(`
        DELETE FROM gallery_images
      `);

      const insertedImages = [];

      for (let i = 0; i < parsedImages.length; i++) {

        const item = parsedImages[i];

        let imageName = '';

        if (req.files && req.files[i]) {
          imageName = req.files[i].key;
        }

        const result = await pool.query(

          `
          INSERT INTO gallery_images
          (

            title_en,
            title_hi,

            category_en,
            category_hi,

            alt_text_en,
            alt_text_hi,

            image

          )
          VALUES
          (
            $1, $2,
            $3, $4,
            $5, $6,
            $7
          )
          RETURNING *
          `,

          [

            item.title_en || '',
            item.title_hi || '',

            item.category_en || '',
            item.category_hi || '',

            item.altText_en || '',
            item.altText_hi || '',

            imageName,
          ]
        );

        insertedImages.push({

          id: result.rows[0].id,

          title_en:
            result.rows[0].title_en,

          title_hi:
            result.rows[0].title_hi,

          category_en:
            result.rows[0].category_en,

          category_hi:
            result.rows[0].category_hi,

          altText_en:
            result.rows[0].alt_text_en,

          altText_hi:
            result.rows[0].alt_text_hi,

          imageUrl:
            `${process.env.MINIO_ENDPOINT}/gallery-images/${result.rows[0].image}`,
        });
      }

      res.json({
        success: true,

        data: {

          heading_en,
          heading_hi,

          description_en,
          description_hi,

          images: insertedImages,
        },
      });

    } catch (err) {

      console.error(
        'PUT /gallery error:',
        err
      );

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

module.exports = router;