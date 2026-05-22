const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../db/minio'); // Adjust path as necessary

const IMAGE_BUCKET = process.env.MINIO_IMAGE_BUCKET || 'images';
const AUTHORITY_BUCKET = process.env.MINIO_BUCKET_NAME || 'authorities';

// Helper to determine route configurations dynamically
const getRouteConfig = (url) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('building') || lowerUrl.includes('bwc')) {
    return { prefix: 'bwc', sizeLimit: 15 * 1024 * 1024 }; // 15MB
  }
  if (lowerUrl.includes('finance') || lowerUrl.includes('fc')) {
    return { prefix: 'fc', sizeLimit: 15 * 1024 * 1024 }; // 15MB
  }
  if (lowerUrl.includes('senate')) {
    return { prefix: 'senate', sizeLimit: 10 * 1024 * 1024 }; // 10MB
  }
  return { prefix: 'bog', sizeLimit: Infinity }; // Default fallback for Board of Governors
};

// Single dynamic middleware for all authority routes
const uploadAuthorities = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AUTHORITY_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      // req.baseUrl captures the root mount path of the router (e.g., /api/senate)
      const { prefix } = getRouteConfig(req.baseUrl || req.originalUrl);
      const uniqueName = `${prefix}/minutes/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: (req, file, cb) => {
      const { sizeLimit } = getRouteConfig(req.baseUrl || req.originalUrl);
      return sizeLimit;
    }
  }
});

// Middleware for general images
const uploadImages = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: IMAGE_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => cb(null, `images/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
  })
});

module.exports = {
  uploadAuthorities,
  uploadImages,
  AUTHORITY_BUCKET,
  IMAGE_BUCKET
};