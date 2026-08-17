const express = require('express');
const pool = require('../db/db');
const { uploadAuthorities, deleteLocalFile } = require('../middleware/upload');

const router = express.Router();
const uploadFile = uploadAuthorities.single('file');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUuid = (req, res, next) => {
  if (!UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Malformed request: Invalid UUID format.' });
  }
  next();
};

/* ==========================================================================
   SENATE MEMBERS ENDPOINTS (with photo support)
   ========================================================================== */

router.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM senate_members ORDER BY created_at ASC');
    const mappedRows = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      designation: row.designation,
      affiliation: row.affiliation,
      position: row.position,
      email: row.email,
      contactPhone: row.contact_phone,
      contact_phone: row.contact_phone,
      photo: row.photo,
      imageUrl: row.photo,
    }));
    res.json(mappedRows);
  } catch (err) {
    console.error('GET /members error:', err);
    res.status(500).json({ error: 'Internal server error while fetching members.' });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { id, name, designation, affiliation, position, email, contactPhone, contact_phone, photo, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'Name field is required.' });

    const phoneVal = contactPhone || contact_phone || '';
    const photoVal = photo || imageUrl || '';

    let query;
    let params;

    if (id && UUID_REGEX.test(id)) {
      query = `
        INSERT INTO senate_members (id, name, designation, affiliation, position, email, contact_phone, photo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
      `;
      params = [id, name, designation, affiliation, position, email, phoneVal, photoVal];
    } else {
      query = `
        INSERT INTO senate_members (name, designation, affiliation, position, email, contact_phone, photo)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
      params = [name, designation, affiliation, position, email, phoneVal, photoVal];
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
      contactPhone: created.contact_phone,
      contact_phone: created.contact_phone,
      photo: created.photo,
    });
  } catch (err) {
    console.error('POST /members error:', err);
    res.status(500).json({ error: 'Failed to add member record.' });
  }
});

router.put('/members/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, affiliation, position, email, contactPhone, contact_phone, photo, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    const phoneVal = contactPhone || contact_phone || '';
    const photoVal = photo || imageUrl || '';

    const query = `
      UPDATE senate_members
      SET name = $1, designation = $2, affiliation = $3, position = $4, email = $5, contact_phone = $6, photo = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *
    `;
    const result = await pool.query(query, [name, designation, affiliation, position, email, phoneVal, photoVal, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member record not found.' });

    const updated = result.rows[0];
    res.json({
      id: updated.id,
      name: updated.name,
      designation: updated.designation,
      affiliation: updated.affiliation,
      position: updated.position,
      email: updated.email,
      contactPhone: updated.contact_phone,
      contact_phone: updated.contact_phone,
      photo: updated.photo,
    });
  } catch (err) {
    console.error('PUT /members/:id error:', err);
    res.status(500).json({ error: 'Failed to update member record.' });
  }
});

router.delete('/members/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM senate_members WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member record not found.' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    console.error('DELETE /members/:id error:', err);
    res.status(500).json({ error: 'Failed to delete member record.' });
  }
});

/* ==========================================================================
   SENATE MINUTES ENDPOINTS
   ========================================================================== */

router.get('/minutes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM senate_minutes ORDER BY meeting_date DESC');
    const mappedRows = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      meeting_date: row.meeting_date,
      date: row.meeting_date ? new Date(row.meeting_date).toISOString().split('T')[0] : '',
      document_url: row.document_url,
      documentUrl: row.document_url,
      uploaded_date: row.uploaded_date,
      uploadedDate: row.uploaded_date,
      uploaded_by: row.uploaded_by,
      uploadedBy: row.uploaded_by,
    }));
    res.json(mappedRows);
  } catch (err) {
    console.error('GET /minutes error:', err);
    res.status(500).json({ error: 'Internal server error while fetching minutes.' });
  }
});

router.post('/minutes', (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const { title, date, meetingDate, meeting_date, uploadedBy, uploaded_by, documentUrl, document_url } = req.body;
    const finalDocUrl = req.file ? req.file.location : (documentUrl || document_url);

    if (!title || !finalDocUrl) {
      return res.status(400).json({ error: 'Title and Document URL/file are required.' });
    }

    const meetingDateVal = date || meetingDate || meeting_date || new Date().toISOString().split('T')[0];
    const uploader = uploadedBy || uploaded_by || 'Admin';

    const query = `
      INSERT INTO senate_minutes (title, meeting_date, document_url, uploaded_by)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await pool.query(query, [title, meetingDateVal, finalDocUrl, uploader]);
    const created = result.rows[0];

    res.status(201).json({
      id: created.id,
      title: created.title,
      date: created.meeting_date,
      meeting_date: created.meeting_date,
      documentUrl: created.document_url,
      document_url: created.document_url,
      uploadedBy: created.uploaded_by,
    });
  } catch (err) {
    console.error('POST /minutes error:', err);
    res.status(500).json({ error: 'Failed to record meeting minutes.' });
  }
});

router.put('/minutes/:id', validateUuid, (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, meetingDate, meeting_date, uploadedBy, uploaded_by, documentUrl, document_url } = req.body;

    const oldRecord = await pool.query('SELECT * FROM senate_minutes WHERE id = $1', [id]);
    if (oldRecord.rows.length === 0) return res.status(404).json({ error: 'Record not found.' });

    let currentUrl = oldRecord.rows[0].document_url;
    if (req.file) {
      await deleteLocalFile(currentUrl);
      currentUrl = req.file.location;
    } else if (documentUrl || document_url) {
      currentUrl = documentUrl || document_url;
    }

    const meetingDateVal = date || meetingDate || meeting_date || oldRecord.rows[0].meeting_date;
    const uploader = uploadedBy || uploaded_by || oldRecord.rows[0].uploaded_by;

    const query = `
      UPDATE senate_minutes
      SET title = $1, meeting_date = $2, document_url = $3, uploaded_by = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(query, [title || oldRecord.rows[0].title, meetingDateVal, currentUrl, uploader, id]);
    const updated = result.rows[0];

    res.json({
      id: updated.id,
      title: updated.title,
      date: updated.meeting_date,
      meeting_date: updated.meeting_date,
      documentUrl: updated.document_url,
      document_url: updated.document_url,
      uploadedBy: updated.uploaded_by,
    });
  } catch (err) {
    console.error('PUT /minutes/:id error:', err);
    res.status(500).json({ error: 'Failed to update meeting minutes.' });
  }
});

router.delete('/minutes/:id', validateUuid, async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query('SELECT document_url FROM senate_minutes WHERE id = $1', [id]);
    if (record.rows.length === 0) return res.status(404).json({ error: 'Record not found.' });

    const fileUrl = record.rows[0].document_url;
    if (fileUrl) await deleteLocalFile(fileUrl);

    await pool.query('DELETE FROM senate_minutes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Meeting minutes deleted successfully.' });
  } catch (err) {
    console.error('DELETE /minutes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete meeting minutes.' });
  }
});

module.exports = router;