const express = require('express');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../db/db');
const s3Client = require('../db/minio');

// Import your custom middleware and bucket name constant
const { uploadAuthorities, AUTHORITY_BUCKET } = require('../middleware/upload'); 

const router = express.Router();
const uploadFile = uploadAuthorities.single('file');

// Helper to clean up overwritten or deleted files from MinIO bucket
const deleteMinioFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split(`/${AUTHORITY_BUCKET}/`);
    if (urlParts.length < 2) return;
    const fileKey = decodeURIComponent(urlParts[1]);

    await s3Client.send(new DeleteObjectCommand({
      Bucket: AUTHORITY_BUCKET,
      Key: fileKey,
    }));
    console.log(`[MinIO] Cleaned storage space. Deleted key: ${fileKey}`);
  } catch (err) {
    console.error(`[MinIO] Failed to prune storage item (${fileUrl}):`, err);
  }
};

/* ==========================================================================
   BOG MEMBERS ENDPOINTS
   ========================================================================== */

router.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bog_members ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /members error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { name, designation, affiliation, position, email, contactPhone } = req.body;
    const query = `
      INSERT INTO bog_members (name, designation, affiliation, position, email, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const result = await pool.query(query, [name, designation, affiliation, position, email, contactPhone]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /members error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, affiliation, position, email, contactPhone } = req.body;
    const query = `
      UPDATE bog_members
      SET name = $1, designation = $2, affiliation = $3, position = $4, email = $5, contact_phone = $6
      WHERE id = $7 RETURNING *
    `;
    const result = await pool.query(query, [name, designation, affiliation, position, email, contactPhone, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /members/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM bog_members WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    console.error('DELETE /members/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   MEETING MINUTES ENDPOINTS
   ========================================================================== */

router.get('/minutes', async (req, res) => {
  try {
    const query = 'SELECT * FROM bog_minutes ORDER BY meeting_date DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /minutes error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/minutes', uploadFile, async (req, res) => {
  try {
    const { title, date, uploadedBy } = req.body;
    const documentUrl = req.file ? req.file.location : null;

    if (!documentUrl) {
      return res.status(400).json({ error: 'Document PDF file upload is required.' });
    }

    const query = `
      INSERT INTO bog_minutes (title, meeting_date, document_url, uploaded_by)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await pool.query(query, [title, date, documentUrl, uploadedBy || 'Admin']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /minutes error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/minutes/:id', uploadFile, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, uploadedBy } = req.body;

    const oldRecord = await pool.query('SELECT * FROM bog_minutes WHERE id = $1', [id]);
    if (oldRecord.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting minutes record not found' });
    }

    let currentUrl = oldRecord.rows[0].document_url;

    if (req.file) {
      await deleteMinioFile(currentUrl);
      currentUrl = req.file.location;
    }

    const query = `
      UPDATE bog_minutes
      SET title = $1, meeting_date = $2, document_url = $3, uploaded_by = $4
      WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(query, [title, date, currentUrl, uploadedBy || 'Admin', id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /minutes/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/minutes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const record = await pool.query('SELECT document_url FROM bog_minutes WHERE id = $1', [id]);
    if (record.rows.length === 0) {
      return res.status(404).json({ error: 'Minutes record not found' });
    }

    const fileUrl = record.rows[0].document_url;
    if (fileUrl) {
      await deleteMinioFile(fileUrl);
    }

    await pool.query('DELETE FROM bog_minutes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Meeting minutes deleted successfully' });
  } catch (err) {
    console.error('DELETE /minutes/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;