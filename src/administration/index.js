const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { upload, deleteLocalFile } = require('../middleware/upload');

// ==========================================
// 1. VISITOR
// ==========================================
router.get('/visitor', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_visitor ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('GET /visitor error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/visitor', upload.single('image_file'), async (req, res) => {
  const { heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi } = req.body;
  let image = req.body.image;
  if (req.file) {
    image = req.file.location;
  }

  try {
    const check = await pool.query('SELECT id FROM administration_visitor');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE administration_visitor 
         SET heading_en = $1, heading_hi = $2, designation_en = $3, designation_hi = $4,
             description_en = $5, description_hi = $6, image = COALESCE($7, image), updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO administration_visitor (heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /visitor error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CHIEF VIGILANCE OFFICER (CVO) & LINKS
// ==========================================
router.get('/cvo', async (req, res) => {
  try {
    const officer = await pool.query('SELECT * FROM administration_chief_vigilence_officer ORDER BY id DESC LIMIT 1');
    const links = await pool.query('SELECT * FROM administration_chief_vigilence_officer_links ORDER BY id ASC');
    res.json({
      officer: officer.rows[0] || {},
      links: links.rows || []
    });
  } catch (err) {
    console.error('GET /cvo error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/cvo', upload.single('photo_file'), async (req, res) => {
  const { name, responsibility, phone_no, email } = req.body;
  let photo = req.body.photo;
  if (req.file) photo = req.file.location;

  try {
    const check = await pool.query('SELECT id FROM administration_chief_vigilence_officer');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE administration_chief_vigilence_officer
         SET name = $1, responsibility = $2, phone_no = $3, email = $4,
             photo = COALESCE($5, photo), updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [name, responsibility, phone_no, email, photo, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO administration_chief_vigilence_officer (name, responsibility, phone_no, email, photo)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, responsibility, phone_no, email, photo]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /cvo error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/cvo/links', async (req, res) => {
  const { name, links } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO administration_chief_vigilence_officer_links (name, links) VALUES ($1, $2) RETURNING *',
      [name, links]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/cvo/links/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_chief_vigilence_officer_links WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. CHAIRPERSON & FORMER CHAIRPERSON
// ==========================================
router.get('/chairperson', async (req, res) => {
  try {
    const chair = await pool.query('SELECT * FROM administration_chairperson ORDER BY id DESC LIMIT 1');
    const former = await pool.query('SELECT * FROM administration_former_chairperson ORDER BY id ASC');
    res.json({
      chairperson: chair.rows[0] || {},
      formerChairpersons: former.rows || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/chairperson', upload.single('image_file'), async (req, res) => {
  const { heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi } = req.body;
  let image = req.body.image;
  if (req.file) image = req.file.location;

  try {
    const check = await pool.query('SELECT id FROM administration_chairperson');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE administration_chairperson 
         SET heading_en = $1, heading_hi = $2, designation_en = $3, designation_hi = $4,
             description_en = $5, description_hi = $6, image = COALESCE($7, image), updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO administration_chairperson (heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/former-chairperson', upload.single('image_file'), async (req, res) => {
  const { type, heading_en, heading_hi, dates } = req.body;
  let image = req.body.image || '';
  if (req.file) image = req.file.location;

  try {
    const result = await pool.query(
      `INSERT INTO administration_former_chairperson (type, heading_en, heading_hi, dates, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [type || 'Former Chairperson, BOG', heading_en, heading_hi || heading_en, dates, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/former-chairperson/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_former_chairperson WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. DIRECTOR, FORMER DIRECTORS, DIRECTOR OFFICE
// ==========================================
router.get('/director', async (req, res) => {
  try {
    const dir = await pool.query('SELECT * FROM administration_messagefromdir ORDER BY id DESC LIMIT 1');
    const former = await pool.query('SELECT * FROM administration_former_directors ORDER BY id ASC');
    const office = await pool.query('SELECT * FROM administration_directoroffice ORDER BY id ASC');
    res.json({
      director: dir.rows[0] || {},
      formerDirectors: former.rows || [],
      directorOffice: office.rows || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/director', upload.single('image_file'), async (req, res) => {
  const { heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi } = req.body;
  let image = req.body.image;
  if (req.file) image = req.file.location;

  try {
    const check = await pool.query('SELECT id FROM administration_messagefromdir');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE administration_messagefromdir 
         SET heading_en = $1, heading_hi = $2, designation_en = $3, designation_hi = $4,
             description_en = $5, description_hi = $6, image = COALESCE($7, image), updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO administration_messagefromdir (heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/former-directors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_former_directors ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/former-directors', upload.single('image_file'), async (req, res) => {
  const { type, heading_en, heading_hi, dates } = req.body;
  let image = req.body.image || '';
  if (req.file) image = req.file.location;

  try {
    const result = await pool.query(
      `INSERT INTO administration_former_directors (type, heading_en, heading_hi, dates, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [type || 'Former Directors, NIT Hamirpur', heading_en, heading_hi || heading_en, dates, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/former-directors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_former_directors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/director-office', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_directoroffice ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/director-office', async (req, res) => {
  const { name, designation, phone_no, email, faculty_id, type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_directoroffice (name, designation, phone_no, email, faculty_id, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, designation, phone_no, email, faculty_id || '', type || 'Staff']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/director-office/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_directoroffice WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. REGISTRAR & REGISTRAR OFFICE
// ==========================================
router.get('/registrar', async (req, res) => {
  try {
    const reg = await pool.query('SELECT * FROM administration_registrar ORDER BY id DESC LIMIT 1');
    const office = await pool.query('SELECT * FROM administration_registraroffice ORDER BY id ASC');
    res.json({
      registrar: reg.rows[0] || {},
      registrarOffice: office.rows || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/registrar', upload.single('image_file'), async (req, res) => {
  const { heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi } = req.body;
  let image = req.body.image;
  if (req.file) image = req.file.location;

  try {
    const check = await pool.query('SELECT id FROM administration_registrar');
    let result;
    if (check.rows.length > 0) {
      result = await pool.query(
        `UPDATE administration_registrar 
         SET heading_en = $1, heading_hi = $2, designation_en = $3, designation_hi = $4,
             description_en = $5, description_hi = $6, image = COALESCE($7, image), updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image, check.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO administration_registrar (heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi, image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/registrar-office', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_registraroffice ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/registrar-office', async (req, res) => {
  const { name, designation, phone_no, email, faculty_id, type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_registraroffice (name, designation, phone_no, email, faculty_id, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, designation, phone_no, email, faculty_id || '', type || 'Staff']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/registrar-office/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_registraroffice WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. DEANS & ASSOCIATE DEANS (Image 1)
// ==========================================
router.get('/deans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_dean_associate_dean ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/deans', async (req, res) => {
  const { type, sl_no, name, designation, department, responsibility, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_dean_associate_dean (type, sl_no, name, designation, department, responsibility, phone_no, email, faculty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [type || 'Deans', sl_no || '', name, designation || '', department || '', responsibility || '', phone_no || '', email || '', faculty_id || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/deans/:id', async (req, res) => {
  const { type, sl_no, name, designation, department, responsibility, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE administration_dean_associate_dean
       SET type = $1, sl_no = $2, name = $3, designation = $4, department = $5,
           responsibility = $6, phone_no = $7, email = $8, faculty_id = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [type || 'Deans', sl_no || '', name, designation || '', department || '', responsibility || '', phone_no || '', email || '', faculty_id || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/deans/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_dean_associate_dean WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. INSTITUTE COORDINATORS (Image 2)
// ==========================================
router.get('/coordinators', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_institutecoordinator ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/coordinators', async (req, res) => {
  const { type, sl_no, name, responsibility, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_institutecoordinator (type, sl_no, name, responsibility, phone_no, email, faculty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type || 'Coordinator', sl_no || '', name, responsibility || '', phone_no || '', email || '', faculty_id || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/coordinators/:id', async (req, res) => {
  const { type, sl_no, name, responsibility, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE administration_institutecoordinator
       SET type = $1, sl_no = $2, name = $3, responsibility = $4, phone_no = $5, email = $6, faculty_id = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [type || 'Coordinator', sl_no || '', name, responsibility || '', phone_no || '', email || '', faculty_id || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/coordinators/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_institutecoordinator WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. HEAD OF DEPARTMENTS (HOD) (Image 4)
// ==========================================
router.get('/hod', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_HOD ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/hod', async (req, res) => {
  const { type, sl_no, name, departments, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_HOD (type, sl_no, name, departments, designation, phone_no, email, faculty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [type || 'HOD', sl_no || '', name, departments || '', designation || '', phone_no || '', email || '', faculty_id || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/hod/:id', async (req, res) => {
  const { type, sl_no, name, departments, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE administration_HOD
       SET type = $1, sl_no = $2, name = $3, departments = $4, designation = $5, phone_no = $6, email = $7, faculty_id = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [type || 'HOD', sl_no || '', name, departments || '', designation || '', phone_no || '', email || '', faculty_id || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/hod/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_HOD WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. FACULTY IN-CHARGE (Image 5)
// ==========================================
router.get('/faculty-incharges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_faculty_incharge ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/faculty-incharges', async (req, res) => {
  const { type, sl_no, name, departments, responsibility, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_faculty_incharge (type, sl_no, name, departments, responsibility, designation, phone_no, email, faculty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [type || 'Faculty In-Charge', sl_no || '', name, departments || '', responsibility || '', designation || '', phone_no || '-', email || '', faculty_id || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/faculty-incharges/:id', async (req, res) => {
  const { type, sl_no, name, departments, responsibility, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE administration_faculty_incharge
       SET type = $1, sl_no = $2, name = $3, departments = $4, responsibility = $5, designation = $6, phone_no = $7, email = $8, faculty_id = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [type || 'Faculty In-Charge', sl_no || '', name, departments || '', responsibility || '', designation || '', phone_no || '-', email || '', faculty_id || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/faculty-incharges/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_faculty_incharge WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. NODAL OFFICERS (From User Text)
// ==========================================
router.get('/nodal-officers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administration_nodalofficers ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/nodal-officers', async (req, res) => {
  const { type, sl_no, name, responsibility, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administration_nodalofficers (type, sl_no, name, responsibility, designation, phone_no, email, faculty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [type || 'Nodal Officer', sl_no || '', name, responsibility || '', designation || '', phone_no || '', email || '', faculty_id || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/nodal-officers/:id', async (req, res) => {
  const { type, sl_no, name, responsibility, designation, phone_no, email, faculty_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE administration_nodalofficers
       SET type = $1, sl_no = $2, name = $3, responsibility = $4, designation = $5, phone_no = $6, email = $7, faculty_id = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [type || 'Nodal Officer', sl_no || '', name, responsibility || '', designation || '', phone_no || '', email || '', faculty_id || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/nodal-officers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM administration_nodalofficers WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;