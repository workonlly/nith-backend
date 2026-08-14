const { neon } = require('@neondatabase/serverless');
const { S3Client } = require('@aws-sdk/client-s3');

// Load environment variables if not already loaded
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// PostgreSQL Connection
const sql = neon(process.env.DATABASE_URL);

// Neon Object Storage S3 Client
const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

module.exports = { sql, s3Client };
