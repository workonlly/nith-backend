const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const { sql, s3Client } = require('../db/neon');

// ======================================================
// MULTER CONFIG (Neon S3 Upload)
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
      cb(null, `gallery/${uniqueName}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for gallery images
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG and WEBP images are allowed'));
    }
    cb(null, true);
  },
});

// ======================================================
// GET GALLERY IMAGES
// ======================================================
router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM gallery ORDER BY id DESC`;
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('GET /gallery error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================
// UPLOAD GALLERY IMAGE
// ======================================================
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const imageName = req.file.key;
    const imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/nit/${imageName}`;
    const id = Date.now().toString();

    const result = await sql`
      INSERT INTO gallery (id, imageurl)
      VALUES (${id}, ${imageUrl})
      RETURNING *
    `;
    
    res.status(201).json({ success: true, data: result[0] });
  } catch (err) {
    console.error('POST /gallery/upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================
// DELETE GALLERY IMAGE
// ======================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await sql`SELECT imageurl FROM gallery WHERE id = ${id}`;
    if (record.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found in database' });
    }
    
    const imageUrl = record[0].imageurl;
    // Extract key. URL format: .../nit/gallery/filename.ext
    const urlParts = imageUrl.split('/nit/');
    if (urlParts.length > 1) {
      const fileKey = urlParts[1];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: 'nit',
        Key: fileKey,
      });
      await s3Client.send(deleteCommand);
      console.log('S3 image deleted successfully');
    }

    await sql`DELETE FROM gallery WHERE id = ${id}`;
    
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (err) {
    console.error('DELETE /gallery/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
