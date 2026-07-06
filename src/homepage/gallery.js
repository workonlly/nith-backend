const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const pool = require('../db/db');
const s3Client = require('../db/minio');


const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'gallery',

    contentType:
      multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
      });
    },

    key: (req, file, cb) => {
      cb(
        null,
        `uploads/${Date.now()}-${file.originalname}`
      );
    },
  }),
});



router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      res.json({
        success: true,
        url: req.file.location,
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

const getFileKey = (fileUrl) => {
  if (!fileUrl) return null;

  try {

    const url = new URL(fileUrl);

    return decodeURIComponent(
      url.pathname.replace(
        /^\/gallery\//,
        ''
      )
    );

  } catch {
    return null;
  }
};

const deleteFromMinio =
  async (fileUrl) => {

    const key =
      getFileKey(fileUrl);

    if (!key) return;

    try {

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'gallery',
          Key: key,
        })
      );

    } catch (err) {

      console.error(
        'MinIO delete error:',
        err.message
      );
    }
  };


  //gallery crud operations
  
  router.get(
  '/',
  async (req, res) => {

    try {

      const section =
        await pool.query(`
          SELECT *
          FROM gallery_section
          LIMIT 1
        `);

      const images =
        await pool.query(`
          SELECT *
          FROM gallery_images
          ORDER BY id ASC
        `);

        res.json({
          heading_en:
            section.rows[0]
              ?.heading_en || '',

          heading_hi:
            section.rows[0]
              ?.heading_hi || '',

          description_en:
            section.rows[0]
              ?.description_en || '',

          description_hi:
            section.rows[0]
              ?.description_hi || '',

          images: images.rows.map(
            (img) => ({
              title_en:
                img.title_en,

              title_hi:
                img.title_hi,

              category_en:
                img.category_en,

              category_hi:
                img.category_hi,

              altText_en:
                img.alt_text_en,

              altText_hi:
                img.alt_text_hi,

              imageUrl:
                img.image_url,
            })
          ),
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });
    }
  }
);



router.put(
  '/',
  async (req, res) => {
    try {
      const {
        heading_en,
        heading_hi,
        description_en,
        description_hi,
        images,
      } = req.body;


      const section = await pool.query(`
        SELECT *
        FROM gallery_section
        LIMIT 1
      `);

      if (section.rows.length) {
        await pool.query(
          `
          UPDATE gallery_section
          SET
            heading_en = $1,
            heading_hi = $2,
            description_en = $3,
            description_hi = $4,
            updated_at = NOW()
          `,
          [
            heading_en,
            heading_hi,
            description_en,
            description_hi,
          ]
        );
      } else {
        await pool.query(
          `
          INSERT INTO gallery_section
          (
            heading_en,
            heading_hi,
            description_en,
            description_hi
          )
          VALUES
          ($1,$2,$3,$4)
          `,
          [
            heading_en,
            heading_hi,
            description_en,
            description_hi,
          ]
        );
      }


      const oldImages = await pool.query(`
        SELECT image_url
        FROM gallery_images
      `);

 
      await pool.query(`
        DELETE FROM gallery_images
      `);


      for (const image of images || []) {
        await pool.query(
          `
          INSERT INTO gallery_images
          (
            title_en,
            title_hi,
 
            category_en,
            category_hi,
 
            alt_text_en,
            alt_text_hi,
 
            image_url,
 
            created_at,
            updated_at
          )
          VALUES
          (
            $1,$2,
            $3,$4,
            $5,$6,
            $7,
            NOW(),
            NOW()
          )
          `,
          [
            image.title_en,
            image.title_hi,

            image.category_en,
            image.category_hi,

            image.altText_en,
            image.altText_hi,

            image.imageUrl,
          ]
        );
      }

       const newUrls = (images || []).map(
       (img) => img.imageUrl
        );

      for (const old of oldImages.rows) {
        if (
          old.image_url &&
          !newUrls.includes(old.image_url)
        ) {
          await deleteFromMinio(
            old.image_url
          );
        }
      }

      res.json({
        success: true,
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


router.delete(
  '/image/:id',
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *
          FROM gallery_images
          WHERE id=$1
        `,
          [req.params.id]
        );

      if (
        !result.rows.length
      ) {
        return res
          .status(404)
          .json({
            error:
              'Image not found',
          });
      }

      await deleteFromMinio(
        result.rows[0]
          .image_url
      );

      await pool.query(
        `
        DELETE
        FROM gallery_images
        WHERE id=$1
      `,
        [req.params.id]
      );

      res.json({
        success: true,
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });
    }
  }
);


module.exports = router;
