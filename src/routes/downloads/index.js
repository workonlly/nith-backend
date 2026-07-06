const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const pool = require('../../db/db');
const s3Client = require('../../db/minio');

const router = express.Router();

// =============================
// MULTER CONFIG
// =============================
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'downloads',
    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },

    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadFields = upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'word_file', maxCount: 1 },
]);

// =============================
// MINIO KEY
// =============================
const getFileKey = (fileUrl) => {
  if (!fileUrl) return null;

  try {
    const url = new URL(fileUrl);
    return decodeURIComponent(url.pathname.replace(/^\/downloads\//, ''));
  } catch {
    return null;
  }
};

// =============================
// DELETE FROM MINIO
// =============================
const deleteFromMinio = async (fileUrl) => {
  const key = getFileKey(fileUrl);
  if (!key) return;

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'downloads',
        Key: key,
      })
    );
  } catch (err) {
    console.error('MinIO delete error:', err.message);
  }
};

// =============================
// GET ALL
// =============================
router.get('/data', async (req, res) => {
  try {
    const { type, category } = req.query;

    let query = 'SELECT * FROM download_tables WHERE 1=1';
    const values = [];

    if (type) {
      values.push(type);
      query += ` AND type = $${values.length}`;
    }

    if (category) {
      values.push(category);
      query += ` AND category_en = $${values.length}`;
    }

    query += ' ORDER BY rank ASC';

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET BY ID
// =============================
router.get('/data/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM download_tables WHERE id=$1',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// CREATE
// =============================
router.post('/data', uploadFields, async (req, res) => {
  try {
    const form_type = (req.body.form_type || "").toLowerCase();
    const pdf = req.files?.pdf_file?.[0];
    const word = req.files?.word_file?.[0];
     const file_url = pdf?.location || '';
    const word_url = word?.location || '';

    
    // optional strict safety
    if (form_type === "pdf" && word) {
         return res.status(400).json({ error: "Do not send word file for pdf type" });
        }

    if (form_type === "word" && pdf) {
         return res.status(400).json({ error: "Do not send pdf file for word type" });
        }




    const result = await pool.query(
      `INSERT INTO download_tables (
        rank,type,category_en,category_hi,
        title_en,title_hi,particulars_en,particulars_hi,
        name_en,name_hi,form_type,
        file_url,word_url,created_by,
        created_at,updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()
      ) RETURNING *`,
      [
        req.body.rank,
        req.body.type,
        req.body.category_en,
        req.body.category_hi,
        req.body.title_en,
        req.body.title_hi,
        req.body.particulars_en,
        req.body.particulars_hi,
        req.body.name_en,
        req.body.name_hi,
        form_type,
        file_url,
        word_url,
        req.body.created_by || 'admin',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// UPDATE
// =============================
router.put('/data/:id', uploadFields, async (req, res) => {
  try {
    const old = await pool.query(
      'SELECT * FROM download_tables WHERE id=$1',
      [req.params.id]
    );

    if (!old.rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    const oldDoc = old.rows[0];
    const form_type = (req.body.form_type || "").toLowerCase();
    let file_url = oldDoc.file_url;
    let word_url = oldDoc.word_url;
    const pdf = req.files?.pdf_file?.[0];
    const word = req.files?.word_file?.[0];

    // optional strict safety
    if (form_type === "pdf" && word) {
        return res.status(400).json({ error: "Do not send word file for pdf type" });
      }

    if (form_type === "word" && pdf) {
        return res.status(400).json({ error: "Do not send pdf file for word type" });
     }

        // ================= PDF =================

    if (form_type === 'pdf' || form_type === 'both') {
      if (pdf) {
        const oldPdfUrl = oldDoc.file_url;

        file_url = pdf.location;

        if (oldPdfUrl && oldPdfUrl !== file_url) {
          await deleteFromMinio(oldPdfUrl);
        }
      } else {
        file_url = oldDoc.file_url;    
      }
    } else {
      if (oldDoc.file_url) {
        await deleteFromMinio(oldDoc.file_url);
      }

      file_url = '';
    }

      // ================= WORD =================

    if (form_type === 'word' || form_type === 'both') {
      if (word) {
        const oldWordUrl = oldDoc.word_url;

        word_url = word.location;

        if (oldWordUrl && oldWordUrl !== word_url) {
          await deleteFromMinio(oldWordUrl);
        }
      } else {
        word_url = oldDoc.word_url;
      }
    } else {
      if (oldDoc.word_url) {
        await deleteFromMinio(oldDoc.word_url);
      }

      word_url = '';
    }


    const result = await pool.query(
      `UPDATE download_tables SET
        rank=$1,type=$2,category_en=$3,category_hi=$4,
        title_en=$5,title_hi=$6,particulars_en=$7,particulars_hi=$8,
        name_en=$9,name_hi=$10,form_type=$11,
        file_url=$12,word_url=$13,created_by=$14,
        updated_at=NOW()
      WHERE id=$15 RETURNING *`,
      [
        req.body.rank,
        req.body.type,
        req.body.category_en,
        req.body.category_hi,
        req.body.title_en,
        req.body.title_hi,
        req.body.particulars_en,
        req.body.particulars_hi,
        req.body.name_en,
        req.body.name_hi,
        form_type,
        file_url,
        word_url,
        req.body.created_by || oldDoc.created_by,
        req.params.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DELETE
// =============================
router.delete('/data/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM download_tables WHERE id=$1',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    const row = result.rows[0];

    await deleteFromMinio(row.file_url);
    await deleteFromMinio(row.word_url);

    await pool.query('DELETE FROM download_tables WHERE id=$1', [
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//routes for the heading and subheading

//GET ALL
router.get('/meta', async (req, res) => {
  try {
    const filters = req.query;

    let query = 'SELECT * FROM download_page_meta WHERE 1=1';
    const values = [];
    let index = 1;

    // dynamically build filters
    for (const key in filters) {
      query += ` AND ${key} = $${index}`;
      values.push(filters[key]);
      index++;
    }

    query += ' ORDER BY page_type ASC';

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET
router.get("/meta/:page_type", async (req, res) => {
  try {
    const { page_type } = req.params;

    const result = await pool.query(
      "SELECT * FROM download_page_meta WHERE page_type=$1",
      [page_type]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Meta not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Post
router.post("/meta", async (req, res) => {
  try {
    const {
      page_type,
      heading_en,
      heading_hi,
      subheading_en,
      subheading_hi,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO download_page_meta
      (page_type, heading_en, heading_hi, subheading_en, subheading_hi)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (page_type)
      DO UPDATE SET
        heading_en = EXCLUDED.heading_en,
        heading_hi = EXCLUDED.heading_hi,
        subheading_en = EXCLUDED.subheading_en,
        subheading_hi = EXCLUDED.subheading_hi,
        updated_at = NOW()
      RETURNING *
      `,
      [
        page_type,
        heading_en,
        heading_hi,
        subheading_en,
        subheading_hi,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE 
router.put("/meta/:page_type", async (req, res) => {
  try {
    const { page_type } = req.params;
    const {
      heading_en,
      heading_hi,
      subheading_en,
      subheading_hi,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE download_page_meta
      SET heading_en=$1,
          heading_hi=$2,
          subheading_en=$3,
          subheading_hi=$4,
          updated_at=NOW()
      WHERE page_type=$5
      RETURNING *
      `,
      [
        heading_en,
        heading_hi,
        subheading_en,
        subheading_hi,
        page_type,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete
router.delete('/meta/:page_type', async (req, res) => {
  try {
    const { page_type } = req.params;

    const result = await pool.query(
      "DELETE FROM download_page_meta WHERE page_type=$1 RETURNING *",
      [page_type]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Meta not found" });
    }

    res.json({
      success: true,
      deleted: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;