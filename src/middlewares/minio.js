const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../db/minio');  // Adjust path

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: (req, file, cb) => {
      const bucketName = req.headers['x-bucket-name'] || 'images';
      cb(null, bucketName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
});

module.exports = upload;
