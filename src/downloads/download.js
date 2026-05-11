const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../db/db');        // Check this path matches your project structure
const s3Client = require('../db/minio'); // Check this path matches your project structure

const router = express.Router();

// ==========================================
// 1. MinIO / S3 Configuration
// ==========================================
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'downloads', // Ensure this bucket exists in MinIO
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Unique filename: timestamp-originalName
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Middleware to accept PDF and Word files
const uploadFields = upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'word_file', maxCount: 1 }
]);

// Helper: Delete file from MinIO
const deleteMinioFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const bucketName = 'downloads';
    // Extract key from full URL
    const fileKey = decodeURIComponent(fileUrl.split('/').pop());
    
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    }));
    console.log(`[MinIO] Deleted file: ${fileKey}`);
  } catch (err) {
    console.error('[MinIO] Error deleting file:', err);
  }
};

// ==================================================
// 2. ROUTES (Using table: ug_tables)
// ==================================================

// GET: Fetch all documents
router.get('/', async (req, res) => {
  try {
    // Note: ug_tables does not have a 'category' column, so we fetch everything.
    const query = 'SELECT * FROM ug_tables ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /downloads error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new document
router.post('/', uploadFields, async (req, res) => {
  try {
    // Note: 'category' removed from destructuring
    const { title, particulars, form_type, name } = req.body;
    
    // Check if files were uploaded
    const pdfUrl = req.files['pdf_file'] ? req.files['pdf_file'][0].location : '';
    const wordUrl = req.files['word_file'] ? req.files['word_file'][0].location : '';

    // Validation
    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF File is required' });
    }

    const result = await pool.query(
      `INSERT INTO ug_tables 
      (title, particulars, form_type, name, file_url, word_url) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [title, particulars, form_type, name, pdfUrl, wordUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /downloads error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update an existing document
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    // Note: 'category' removed
    const { title, particulars, form_type, name } = req.body;

    // 1. Fetch old record to get old file URLs
    const oldRecord = await pool.query('SELECT * FROM ug_tables WHERE id = $1', [id]);
    if (oldRecord.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    let pdfUrl = oldRecord.rows[0].file_url;
    let wordUrl = oldRecord.rows[0].word_url;

    // 2. If new PDF uploaded, delete old one and update URL
    if (req.files['pdf_file']) {
      await deleteMinioFile(pdfUrl); 
      pdfUrl = req.files['pdf_file'][0].location; 
    }

    // 3. If new Word doc uploaded, delete old one and update URL
    if (req.files['word_file']) {
      await deleteMinioFile(wordUrl); 
      wordUrl = req.files['word_file'][0].location; 
    }

    // 4. Update Database
    const result = await pool.query(
      `UPDATE ug_tables SET 
       title = $1, particulars = $2, form_type = $3, name = $4, 
       file_url = $5, word_url = $6, updated_at = NOW() 
       WHERE id = $7 RETURNING *`,
      [title, particulars, form_type, name, pdfUrl, wordUrl, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /downloads/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch record to get file URLs
    const result = await pool.query('SELECT * FROM ug_tables WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { file_url, word_url } = result.rows[0];

    // 2. Delete files from MinIO
    if (file_url) await deleteMinioFile(file_url);
    if (word_url) await deleteMinioFile(word_url);

    // 3. Delete row from Database
    await pool.query('DELETE FROM ug_tables WHERE id = $1', [id]);

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('DELETE /downloads/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;