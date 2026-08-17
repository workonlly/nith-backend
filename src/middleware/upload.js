const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Initialize S3 Client for Neon Object Storage
const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.S3_BUCKET || 'nit';

// S3 Storage Engine for Multer
const s3Storage = multerS3({
  s3: s3Client,
  bucket: BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueKey = `${Date.now()}-${cleanName}`;
    cb(null, uniqueKey);
  }
});

const upload = multer({
  storage: s3Storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadAuthorities = multer({
  storage: s3Storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Helper to delete a file from Neon Object Storage
const deleteS3File = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    let key = '';
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const urlObj = new URL(fileUrl);
      key = decodeURIComponent(urlObj.pathname.replace(/^\//, ''));
      if (key.startsWith(`${BUCKET_NAME}/`)) {
        key = key.substring(BUCKET_NAME.length + 1);
      }
    } else {
      key = fileUrl;
    }

    if (key) {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      }));
    }
  } catch (err) {
    console.error('Error deleting file from Neon S3 Object Storage:', err);
  }
};

const deleteLocalFile = deleteS3File;

module.exports = {
  s3Client,
  upload,
  uploadAuthorities,
  deleteS3File,
  deleteLocalFile,
  AUTHORITY_BUCKET: BUCKET_NAME
};