const express = require('express');
const pool = require('../db/db');
const { uploadAuthorities, AUTHORITY_BUCKET } = require('../middleware/upload');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../db/minio');

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
    console.log(`[MinIO] Deleted key: ${fileKey}`);
  } catch (err) {
    console.error(`[MinIO] Failed to delete file (${fileUrl}):`, err);
  }
};

/**
 * Creates a generic CRUD router for a given table.
 * @param {string} tableName - The name of the table in the database.
 * @param {Object} options - Configuration options.
 * @param {boolean} [options.isSingleton=false] - If true, restricts to a single row (id=1).
 * @param {string} [options.fileField] - The column name for file uploads (e.g., 'pdf_url', 'attachment_url').
 */
function createGenericRouter(tableName, options = {}) {
  const router = express.Router();
  const { isSingleton = false, fileField = null } = options;
  
  const uploadMiddleware = fileField ? uploadAuthorities.single('file') : (req, res, next) => next();

  // GET all records (or the singleton record)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
      res.json(result.rows);
    } catch (err) {
      console.error(`GET /${tableName} error:`, err);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  // POST a new record
  router.post('/', uploadMiddleware, async (req, res) => {
    try {
      if (isSingleton) {
        const existing = await pool.query(`SELECT id FROM ${tableName} LIMIT 1`);
        if (existing.rows.length > 0) {
          return res.status(400).json({ error: 'Singleton table already has a record. Use PUT.' });
        }
      }

      const body = { ...req.body };
      if (fileField && req.file) {
        body[fileField] = req.file.location;
      }

      const keys = Object.keys(body);
      const values = Object.values(body);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO ${tableName} (${keys.join(', ')})
        VALUES (${placeholders}) RETURNING *
      `;
      
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (req.file) await deleteMinioFile(req.file.location);
      console.error(`POST /${tableName} error:`, err);
      res.status(500).json({ error: 'Failed to create record' });
    }
  });

  // PUT (update) a record
  router.put('/:id', uploadMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Fetch old record to manage file replacement
      const oldRecordRes = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
      if (oldRecordRes.rows.length === 0) {
        if (req.file) await deleteMinioFile(req.file.location);
        return res.status(404).json({ error: 'Record not found' });
      }
      const oldRecord = oldRecordRes.rows[0];

      const body = { ...req.body };
      let newFileUrl = req.file ? req.file.location : null;

      if (fileField) {
        if (newFileUrl) {
           // Delete old file if a new one is provided
           if (oldRecord[fileField]) {
             await deleteMinioFile(oldRecord[fileField]);
           }
           body[fileField] = newFileUrl;
        } else {
           // Retain old file if no new file provided
           body[fileField] = oldRecord[fileField];
        }
      }

      // If body is empty after file logic, nothing to update
      if (Object.keys(body).length === 0) {
        return res.json(oldRecord);
      }

      const keys = Object.keys(body);
      const values = Object.values(body);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      values.push(id); // push id as the last parameter

      const query = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = $${values.length} RETURNING *
      `;
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      if (req.file) await deleteMinioFile(req.file.location);
      console.error(`PUT /${tableName}/:id error:`, err);
      res.status(500).json({ error: 'Failed to update record' });
    }
  });

  // DELETE a record
  router.delete('/:id', async (req, res) => {
    try {
      if (isSingleton) {
        return res.status(400).json({ error: 'Cannot delete from a singleton table' });
      }

      const { id } = req.params;
      const oldRecordRes = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
      if (oldRecordRes.rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const oldRecord = oldRecordRes.rows[0];
      if (fileField && oldRecord[fileField]) {
         await deleteMinioFile(oldRecord[fileField]);
      }

      await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
      res.json({ success: true, message: 'Record deleted' });
    } catch (err) {
      console.error(`DELETE /${tableName}/:id error:`, err);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  });

  return router;
}

module.exports = createGenericRouter;
