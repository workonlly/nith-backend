// src/middleware/upload.js
// Multer-S3 uploader configured for the authorities bucket in MinIO.
// Exports:
//   - uploadAuthorities : multer instance ready to use as middleware
//   - AUTHORITY_BUCKET  : bucket name constant (used by delete helpers)

const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../db/minio');

const AUTHORITY_BUCKET = process.env.AUTHORITY_BUCKET || 'authorities';

const uploadAuthorities = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AUTHORITY_BUCKET,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      // Prefix with timestamp to avoid name collisions
      const filename = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for meeting minutes
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for document uploads.'), false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
});

module.exports = { uploadAuthorities, AUTHORITY_BUCKET };
