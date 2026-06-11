const express = require('express');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../db/db');
const s3Client = require('../db/minio');

const { uploadAuthorities, AUTHORITY_BUCKET } = require('../middleware/upload');

const router = express.Router();
const uploadFile = uploadAuthorities.single('file');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUuid = (req, res, next) => {
  if (!UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Malformed request: Invalid UUID format.' });
  }
  next();
};

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
    console.log(`[MinIO] Successfully purged key: ${fileKey}`);
  } catch (err) {
    console.error(`[MinIO] Failed to drop storage item (${fileUrl}):`, err);
  }
};

/* ==========================================================================
   FC MEMBERS ENDPOINTS
   ========================================================================== */

router.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fc_members ORDER BY created_at ASC');
    const mappedRows = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      designation: row.designation,
      affiliation: row.affiliation,
      position: row.position,
      email: row.email,
      contactPhone: row.contact_phone
    }));
    res.json(mappedRows);
  } catch (err) {
    console.error('GET /members error:', err);
    res.status(500).json({ error: 'Internal server error while fetching FC members.' });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { id, name, designation, affiliation, position, email, contactPhone } = req.body;
    if (!name) return res.status(400).json({ error: 'Member name is required.' });

    let query;
    let params;

    if (id && UUID_REGEX.test(id)) {
      query = `
        INSERT INTO fc_members (id, name, designation, affiliation, position, email, contact_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
      params = [id, name, designation, affiliation, position, email, contactPhone];
    } else {
      query = `
        INSERT INTO fc_members (name, designation, affiliation, position, email, contact_phone)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `;
      params = [name, designation, affiliation, position, email, contactPhone];
    }

    const result = await pool.query(query, params);
    const created = result.rows[0];

    res.status(201).json({
      id: created.id,
      name: created.name,
      designation: created.designation,
      affiliation: created.affiliation,
      position: created.position,
      email: created.email,
      contactPhone: created.contact_phone
    });
  } catch (err) {
    console.error('POST /members error:', err);
    res.status(500).json({ error: 'Failed to create member record.' });
  }
});

router.put('/members/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, affiliation, position, email, contactPhone } = req.body;
    if (!name) return res.status(400).json({ error: 'Member name is required.' });

    const query = `
      UPDATE fc_members
      SET name = $1, designation = $2, affiliation = $3, position = $4, email = $5, contact_phone = $6
      WHERE id = $7 RETURNING *
    `;
    const result = await pool.query(query, [name, designation, affiliation, position, email, contactPhone, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found.' });

    const updated = result.rows[0];
    res.json({
      id: updated.id,
      name: updated.name,
      designation: updated.designation,
      affiliation: updated.affiliation,
      position: updated.position,
      email: updated.email,
      contactPhone: updated.contact_phone
    });
  } catch (err) {
    console.error('PUT /members/:id error:', err);
    res.status(500).json({ error: 'Failed to update member record.' });
  }
});

router.delete('/members/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM fc_members WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found.' });
    res.json({ success: true, message: 'Member clean-up successful.' });
  } catch (err) {
    console.error('DELETE /members/:id error:', err);
    res.status(500).json({ error: 'Failed to erase member record.' });
  }
});

/* ==========================================================================
   MEETING MINUTES ENDPOINTS
   ========================================================================== */

router.get('/minutes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fc_minutes ORDER BY meeting_date DESC');
    const mappedRows = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      date: row.meeting_date ? row.meeting_date.toISOString().split('T')[0] : '',
      documentUrl: row.document_url,
      uploadedDate: row.uploaded_date ? row.uploaded_date.toISOString().split('T')[0] : '',
      uploadedBy: row.uploaded_by
    }));
    res.json(mappedRows);
  } catch (err) {
    console.error('GET /minutes error:', err);
    res.status(500).json({ error: 'Internal server error while fetching minutes.' });
  }
});

router.post('/minutes', uploadFile, async (req, res) => {
  let uploadedLocation = req.file ? req.file.location : null;
  try {
    const { title, date, uploadedBy } = req.body;
    if (!uploadedLocation) return res.status(400).json({ error: 'Document PDF file upload is required.' });
    if (!title || !date) {
      await deleteMinioFile(uploadedLocation); 
      return res.status(400).json({ error: 'Title and Date fields are required.' });
    }

    const query = `
      INSERT INTO fc_minutes (title, meeting_date, document_url, uploaded_by)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await pool.query(query, [title, date, uploadedLocation, uploadedBy || 'Admin']);
    const created = result.rows[0];

    res.status(201).json({
      id: created.id,
      title: created.title,
      date: created.meeting_date.toISOString().split('T')[0],
      documentUrl: created.document_url,
      uploadedDate: created.uploaded_date.toISOString().split('T')[0],
      uploadedBy: created.uploaded_by
    });
  } catch (err) {
    if (uploadedLocation) await deleteMinioFile(uploadedLocation);
    console.error('POST /minutes error:', err);
    res.status(500).json({ error: 'Failed to save meeting minutes record.' });
  }
});

router.put('/minutes/:id', validateUuid, uploadFile, async (req, res) => {
  let newUploadedLocation = req.file ? req.file.location : null;
  try {
    const { id } = req.params;
    const { title, date, uploadedBy } = req.body;

    const oldRecord = await pool.query('SELECT * FROM fc_minutes WHERE id = $1', [id]);
    if (oldRecord.rows.length === 0) {
      if (newUploadedLocation) await deleteMinioFile(newUploadedLocation);
      return res.status(404).json({ error: 'Meeting minutes record not found' });
    }

    let finalUrl = oldRecord.rows[0].document_url;
    if (newUploadedLocation) {
      await deleteMinioFile(finalUrl); 
      finalUrl = newUploadedLocation;
    }

    const query = `
      UPDATE fc_minutes
      SET title = $1, meeting_date = $2, document_url = $3, uploaded_by = $4
      WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(query, [
      title || oldRecord.rows[0].title,
      date || oldRecord.rows[0].meeting_date,
      finalUrl,
      uploadedBy || oldRecord.rows[0].uploaded_by,
      id
    ]);

    const updated = result.rows[0];
    res.json({
      id: updated.id,
      title: updated.title,
      date: updated.meeting_date.toISOString().split('T')[0],
      documentUrl: updated.document_url,
      uploadedDate: updated.uploaded_date.toISOString().split('T')[0],
      uploadedBy: updated.uploaded_by
    });
  } catch (err) {
    if (newUploadedLocation) await deleteMinioFile(newUploadedLocation);
    console.error('PUT /minutes/:id error:', err);
    res.status(500).json({ error: 'Failed to update meeting minutes.' });
  }
});

router.delete('/minutes/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query('SELECT document_url FROM fc_minutes WHERE id = $1', [id]);
    if (record.rows.length === 0) return res.status(404).json({ error: 'Minutes record not found.' });

    const fileUrl = record.rows[0].document_url;
    if (fileUrl) await deleteMinioFile(fileUrl);

    await pool.query('DELETE FROM fc_minutes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Meeting minutes and storage documents cleaned up.' });
  } catch (err) {
    console.error('DELETE /minutes/:id error:', err);
    res.status(500).json({ error: 'Failed to complete minutes deletion.' });
  }
});

module.exports = router;