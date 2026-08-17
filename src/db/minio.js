require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

// Use Neon S3-compatible Object Storage (or MinIO if explicitly configured)
const endpoint = process.env.AWS_ENDPOINT_URL_S3 || process.env.MINIO_ENDPOINT;
const region = process.env.AWS_REGION || process.env.MINIO_REGION || 'us-east-2';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.MINIO_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.MINIO_SECRET_KEY;

const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  forcePathStyle: true
});

module.exports = s3Client;
