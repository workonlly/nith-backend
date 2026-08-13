// ﻿// src/homepage/hero.js
// 
// const express = require('express');
// 
// const multer = require('multer');
// 
// const multerS3 = require('multer-s3');
// 
// const {
//   DeleteObjectCommand
// } = require('@aws-sdk/client-s3');
// 
// const path = require('path');
// 
// const pool = require('../db/db');
// 
// const s3Client = require('../db/minio');
// 
// const router = express.Router();
// 
// 
// // ======================================================
// // MULTER CONFIG (MinIO Upload)
// // ======================================================
// 
// const upload = multer({
// 
//   storage: multerS3({
// 
//     s3: s3Client,
// 
//     bucket: 'images',
// 
//     contentType: multerS3.AUTO_CONTENT_TYPE,
// 
//     metadata: (req, file, cb) => {
// 
//       cb(null, {
//         fieldName: file.fieldname,
//       });
//     },
// 
//     key: (req, file, cb) => {
// 
//       const uniqueName =
//         Date.now() +
//         '-' +
//         Math.round(Math.random() * 1e9) +
//         path.extname(file.originalname);
// 
//       cb(null, uniqueName);
//     },
//   }),
// 
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// 
//   fileFilter: (req, file, cb) => {
// 
//     const allowedTypes = [
//       'image/jpeg',
//       'image/png',
//       'image/webp',
//       'image/jpg',
//     ];
// 
//     if (!allowedTypes.includes(file.mimetype)) {
// 
//       return cb(
//         new Error(
//           'Only JPG, PNG and WEBP images are allowed'
//         )
//       );
//     }
// 
//     cb(null, true);
//   },
// });
// 
// 
// // ======================================================
// // GET HERO DATA
// // ======================================================
// 
// router.get('/hero', async (req, res) => {
// 
//   try {
// 
//     const result = await pool.query(`
//       SELECT *
//       FROM homepage
//       ORDER BY id DESC
//       LIMIT 1
//     `);
// 
//     if (result.rows.length === 0) {
// 
//       const insertResult = await pool.query(`
//         INSERT INTO homepage (
// 
//           heromaintext_en,
//           heromaintext_hi,
// 
//           herosubheading_en,
//           herosubheading_hi,
// 
//           herodescheading_en,
//           herodescheading_hi,
// 
//           aboutdesc
// 
//         )
//         VALUES (
// 
//           'NIT HAMIRPUR',
//           'αñÅαñ¿αñåαñêαñƒαÑÇ αñ╣αñ«αÑÇαñ░αñ¬αÑüαñ░',
// 
//           'Shaping Minds. Building Futures.',
//           'αñªαñ┐αñ«αñ╛αñù αñòαÑï αñåαñòαñ╛αñ░ αñªαÑçαñ¿αñ╛αÑñ αñ¡αñ╡αñ┐αñ╖αÑìαñ» αñòαñ╛ αñ¿αñ┐αñ░αÑìαñ«αñ╛αñú αñòαñ░αñ¿αñ╛αÑñ',
// 
//           'NIT Hamirpur is committed to academic excellence.',
//           'αñÅαñ¿αñåαñêαñƒαÑÇ αñ╣αñ«αÑÇαñ░αñ¬αÑüαñ░ αñ╢αÑêαñòαÑìαñ╖αñúαñ┐αñò αñëαññαÑìαñòαÑâαñ╖αÑìαñƒαññαñ╛ αñòαÑç αñ▓αñ┐αñÅ αñ¬αÑìαñ░αññαñ┐αñ¼αñªαÑìαñº αñ╣αÑêαÑñ',
// 
//           ''
// 
//         )
//         RETURNING *;
//       `);
// 
//       return res.json({
//         success: true,
//         data: insertResult.rows[0],
//       });
//     }
// 
//     res.json({
//       success: true,
//       data: result.rows[0],
//     });
// 
//   } catch (err) {
// 
//     console.error('GET /hero error:', err);
// 
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
// 
// 
// // ======================================================
// // UPDATE HERO DATA
// // ======================================================
// 
// router.put('/hero', async (req, res) => {
// 
//   try {
// 
//     const {
// 
//       heromaintext_en,
//       heromaintext_hi,
// 
//       herosubheading_en,
//       herosubheading_hi,
// 
//       herodescheading_en,
//       herodescheading_hi,
// 
//       aboutdesc,
// 
//     } = req.body;
// 
//     const result = await pool.query(
// 
//       `
//       UPDATE homepage
//       SET
// 
//         heromaintext_en = $1,
//         heromaintext_hi = $2,
// 
//         herosubheading_en = $3,
//         herosubheading_hi = $4,
// 
//         herodescheading_en = $5,
//         herodescheading_hi = $6,
// 
//         aboutdesc = $7,
// 
//         updatedat = NOW()
// 
//       WHERE id = 1
// 
//       RETURNING *;
//       `,
// 
//       [
// 
//         heromaintext_en,
//         heromaintext_hi,
// 
//         herosubheading_en,
//         herosubheading_hi,
// 
//         herodescheading_en,
//         herodescheading_hi,
// 
//         aboutdesc || '',
// 
//       ]
//     );
// 
//     res.json({
//       success: true,
//       message: 'Hero updated successfully',
//       data: result.rows[0],
//     });
// 
//   } catch (err) {
// 
//     console.error('PUT /hero error:', err);
// 
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
// 
// 
// // ======================================================
// // GET HERO IMAGES
// // ======================================================
// 
// router.get('/hero/hero-image', async (req, res) => {
// 
//   try {
// 
//     const result = await pool.query(`
//       SELECT *
//       FROM hero_image
//       ORDER BY id DESC
//     `);
// 
//     res.json({
//       success: true,
//       images: result.rows,
//     });
// 
//   } catch (err) {
// 
//     console.error('GET /hero/hero-image error:', err);
// 
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
// 
// 
// // ======================================================
// // UPLOAD HERO IMAGE
// // ======================================================
// 
// router.post(
// 
//   '/hero/hero-image',
// 
//   upload.single('image'),
// 
//   async (req, res) => {
// 
//     try {
// 
//       if (!req.file) {
// 
//         return res.status(400).json({
//           success: false,
//           error: 'No image uploaded',
//         });
//       }
// 
//       console.log('Uploaded File:', req.file);
// 
//       const imageName = req.file.key;
// 
//       const imageUrl =
//         `${process.env.MINIO_ENDPOINT}/images/${imageName}`;
// 
//       const result = await pool.query(
// 
//         `
//         INSERT INTO hero_image (
// 
//           image,
//           image_url
// 
//         )
//         VALUES ($1, $2)
//         RETURNING *;
//         `,
// 
//         [
//           imageName,
//           imageUrl,
//         ]
//       );
// 
//       res.status(201).json({
// 
//         success: true,
// 
//         message: 'Hero image uploaded successfully',
// 
//         data: result.rows[0],
//       });
// 
//     } catch (err) {
// 
//       console.error(
//         'POST /hero/hero-image error:',
//         err
//       );
// 
//       res.status(500).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }
// );
// 
// 
// // ======================================================
// // DELETE HERO IMAGE
// // ======================================================
// 
// router.delete('/hero/hero-image/:id', async (req, res) => {
// 
//   try {
// 
//     const id = req.params.id;
// 
//     const fileResult = await pool.query(
//       `
//       SELECT *
//       FROM hero_image
//       WHERE id = $1
//       `,
//       [id]
//     );
// 
//     if (fileResult.rows.length === 0) {
// 
//       return res.status(404).json({
//         success: false,
//         error: 'Image not found',
//       });
//     }
// 
//     const fileRow = fileResult.rows[0];
// 
//     const fileKey = fileRow.image;
// 
//     // =========================================
//     // DELETE FROM MINIO
//     // =========================================
// 
//     const deleteCommand =
//       new DeleteObjectCommand({
// 
//         Bucket: 'images',
// 
//         Key: fileKey,
//       });
// 
//     await s3Client.send(deleteCommand);
// 
//     console.log(
//       'MinIO image deleted successfully'
//     );
// 
//     // =========================================
//     // DELETE FROM DATABASE
//     // =========================================
// 
//     await pool.query(
//       `
//       DELETE FROM hero_image
//       WHERE id = $1
//       `,
//       [id]
//     );
// 
//     res.json({
//       success: true,
//       message: 'Hero image deleted successfully',
//     });
// 
//   } catch (err) {
// 
//     console.error(
//       'DELETE /hero/hero-image/:id error:',
//       err
//     );
// 
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
// 
// module.exports = router;
// 

// ======================================================
// NEON SERVERLESS + S3 STORAGE IMPLEMENTATION
// ======================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const { sql, s3Client } = require('../db/neon');

// ======================================================
// MULTER CONFIG (MinIO Upload)
// ======================================================

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'nit',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG and WEBP images are allowed'));
    }
    cb(null, true);
  },
});


// ======================================================
// GET HERO IMAGES
// ======================================================
router.get('/hero', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM heroImage`;
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('GET /hero error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ======================================================
// UPLOAD HERO IMAGE
// ======================================================
router.post("/heropost", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const imageName = req.file.key;
    const imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/nit/${imageName}`;
    const id = Date.now().toString(); // Basic unique ID generation

    const result = await sql`
      INSERT INTO heroImage (id, heroURL)
      VALUES (${id}, ${imageUrl})
      RETURNING *
    `;
    
    res.status(201).json({ success: true, data: result[0] });
  } catch (err) {
    console.error('POST /heropost error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ======================================================
// DELETE HERO IMAGE
// ======================================================
router.delete("/herodelete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Get the image URL from DB to find the filename
    const record = await sql`SELECT heroURL FROM heroImage WHERE id = ${id}`;
    if (record.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found in database' });
    }
    
    const heroURL = record[0].herourl; // postgres forces column names to lowercase by default
    const fileKey = heroURL.split('/').pop();

    // 2. Delete from MinIO bucket
    const deleteCommand = new DeleteObjectCommand({
      Bucket: 'nit',
      Key: fileKey,
    });
    await s3Client.send(deleteCommand);
    console.log('Neon Object Storage image deleted successfully');

    // 3. Delete from Database
    await sql`DELETE FROM heroImage WHERE id = ${id}`;
    
    res.json({ success: true, message: 'Hero image deleted successfully' });
  } catch (err) {
    console.error('DELETE /herodelete error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// ======================================================
// HOTLINKS (CAROUSEL AT BOTTOM OF HERO)
// ======================================================

router.get('/hotlinks', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM hotlinks ORDER BY id DESC`;
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('GET /hotlinks error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/hotlinks', async (req, res) => {
  try {
    const { name, links } = req.body;
    if (!name || !links) return res.status(400).json({ success: false, error: 'Name and Link are required' });

    const id = Date.now().toString();
    const result = await sql`
      INSERT INTO hotlinks (id, name, links)
      VALUES (${id}, ${name}, ${links})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: result[0] });
  } catch (err) {
    console.error('POST /hotlinks error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/hotlinks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, links } = req.body;
    if (!name || !links) return res.status(400).json({ success: false, error: 'Name and Link are required' });

    const result = await sql`
      UPDATE hotlinks
      SET name = ${name}, links = ${links}
      WHERE id = ${id}
      RETURNING *
    `;
    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    console.error('PUT /hotlinks/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/hotlinks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM hotlinks WHERE id = ${id}`;
    res.json({ success: true, message: 'Hotlink deleted successfully' });
  } catch (err) {
    console.error('DELETE /hotlinks/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;