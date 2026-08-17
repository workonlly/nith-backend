const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../db/minio');

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: (req, file, cb) => {
      const bucketName = req.headers['x-bucket-name'] || process.env.S3_BUCKET || 'nit';
      cb(null, bucketName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`)
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;
