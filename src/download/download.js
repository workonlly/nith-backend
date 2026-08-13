const express = require('express');
const router = express.Router();
const { sql, s3Client } = require('../db/neon');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// File Upload Config
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'nit',
    
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
      cb(null, `downloads/${uniqueName}`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const fileUploads = upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'word_file', maxCount: 1 }
]);

// Helper to extract S3 key and delete file
const deleteS3File = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const urlObj = new URL(fileUrl);
    const key = urlObj.pathname.split('/nit/')[1];
    if (key) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: 'nit', Key: key }));
    }
  } catch (err) {
    console.error('Failed to delete from S3:', err);
  }
};

// ==========================================
// DATA ROUTES
// ==========================================

// GET /data
router.get('/data', async (req, res) => {
  try {
    const { type, category } = req.query;
    let data;
    
    if (type && category) {
      data = await sql`
        SELECT * FROM download_tables 
        WHERE type = ${type} AND (category_en = ${category} OR category_hi = ${category})
        ORDER BY id DESC
      `;
    } else if (type) {
      data = await sql`
        SELECT * FROM download_tables 
        WHERE type = ${type}
        ORDER BY id DESC
      `;
    } else {
      data = await sql`
        SELECT * FROM download_tables 
        ORDER BY id DESC
      `;
    }
    res.json(data);
  } catch (err) {
    console.error('GET /downloads/data error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /data
router.post('/data', fileUploads, async (req, res) => {
  try {
    const {
      rank, type, category_en, category_hi, title_en, title_hi,
      particulars_en, particulars_hi, name_en, name_hi, form_type
    } = req.body;
    
    let file_url = null;
    let word_url = null;
    
    if (req.files && req.files['pdf_file']) {
      file_url = req.files['pdf_file'][0].location;
    }
    if (req.files && req.files['word_file']) {
      word_url = req.files['word_file'][0].location;
    }

    const inserted = await sql`
      INSERT INTO download_tables (
        rank, type, category_en, category_hi, title_en, title_hi,
        particulars_en, particulars_hi, name_en, name_hi, form_type,
        file_url, word_url
      ) VALUES (
        ${rank ? Number(rank) : 1}, ${type || ''}, ${category_en || ''}, ${category_hi || ''}, ${title_en || ''}, ${title_hi || ''},
        ${particulars_en || ''}, ${particulars_hi || ''}, ${name_en || ''}, ${name_hi || ''}, ${form_type || ''},
        ${file_url}, ${word_url}
      ) RETURNING *
    `;
    res.json(inserted[0]);
  } catch (err) {
    console.error('POST /downloads/data error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /data/:id
router.put('/data/:id', fileUploads, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rank, type, category_en, category_hi, title_en, title_hi,
      particulars_en, particulars_hi, name_en, name_hi, form_type
    } = req.body;
    
    // Fetch old record
    const records = await sql`SELECT * FROM download_tables WHERE id = ${id}`;
    if (records.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    const oldRecord = records[0];
    
    let file_url = oldRecord.file_url;
    let word_url = oldRecord.word_url;
    
    if (req.files && req.files['pdf_file']) {
      if (file_url) await deleteS3File(file_url);
      file_url = req.files['pdf_file'][0].location;
    }
    if (req.files && req.files['word_file']) {
      if (word_url) await deleteS3File(word_url);
      word_url = req.files['word_file'][0].location;
    }

    const updated = await sql`
      UPDATE download_tables SET
        rank = ${rank ? Number(rank) : oldRecord.rank},
        type = ${type || oldRecord.type},
        category_en = ${category_en || oldRecord.category_en},
        category_hi = ${category_hi || oldRecord.category_hi},
        title_en = ${title_en || oldRecord.title_en},
        title_hi = ${title_hi || oldRecord.title_hi},
        particulars_en = ${particulars_en || oldRecord.particulars_en},
        particulars_hi = ${particulars_hi || oldRecord.particulars_hi},
        name_en = ${name_en || oldRecord.name_en},
        name_hi = ${name_hi || oldRecord.name_hi},
        form_type = ${form_type || oldRecord.form_type},
        file_url = ${file_url},
        word_url = ${word_url},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /downloads/data error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /data/:id
router.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const records = await sql`SELECT file_url, word_url FROM download_tables WHERE id = ${id}`;
    
    if (records.length > 0) {
      if (records[0].file_url) await deleteS3File(records[0].file_url);
      if (records[0].word_url) await deleteS3File(records[0].word_url);
    }
    
    await sql`DELETE FROM download_tables WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /downloads/data error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// META ROUTES
// ==========================================

// GET /meta
router.get('/meta', async (req, res) => {
  try {
    const data = await sql`SELECT * FROM download_page_meta ORDER BY id DESC`;
    res.json(data);
  } catch (err) {
    console.error('GET /downloads/meta error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /meta
router.post('/meta', async (req, res) => {
  try {
    const { page_type, heading_en, heading_hi, subheading_en, subheading_hi } = req.body;
    const inserted = await sql`
      INSERT INTO download_page_meta (page_type, heading_en, heading_hi, subheading_en, subheading_hi)
      VALUES (${page_type}, ${heading_en || ''}, ${heading_hi || ''}, ${subheading_en || ''}, ${subheading_hi || ''})
      ON CONFLICT (page_type) DO UPDATE SET
        heading_en = EXCLUDED.heading_en,
        heading_hi = EXCLUDED.heading_hi,
        subheading_en = EXCLUDED.subheading_en,
        subheading_hi = EXCLUDED.subheading_hi,
        updated_at = NOW()
      RETURNING *
    `;
    res.json(inserted[0]);
  } catch (err) {
    console.error('POST /downloads/meta error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /meta/:page_type
router.put('/meta/:page_type', async (req, res) => {
  try {
    const { page_type } = req.params;
    const { heading_en, heading_hi, subheading_en, subheading_hi } = req.body;
    
    const updated = await sql`
      UPDATE download_page_meta SET
        heading_en = ${heading_en || ''},
        heading_hi = ${heading_hi || ''},
        subheading_en = ${subheading_en || ''},
        subheading_hi = ${subheading_hi || ''},
        updated_at = NOW()
      WHERE page_type = ${page_type}
      RETURNING *
    `;
    
    if (updated.length === 0) {
       return res.status(404).json({ error: 'Not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /downloads/meta error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /meta/:page_type
router.delete('/meta/:page_type', async (req, res) => {
  try {
    const { page_type } = req.params;
    await sql`DELETE FROM download_page_meta WHERE page_type = ${page_type}`;
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /downloads/meta error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
