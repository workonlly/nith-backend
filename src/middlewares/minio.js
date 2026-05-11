const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../db/minio');  // Adjust path

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "images",
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
});

module.exports = upload;
