const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

// ── S3 Upload helper ─────────────────────────────────────────────────────────
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const upload = multer({ storage: multer.memoryStorage() });

async function uploadToS3(file) {
  const key = `departments/${randomUUID()}-${file.originalname.replace(/\s+/g, '-')}`;
  await s3.send(new PutObjectCommand({
    Bucket: 'nit',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return `${process.env.AWS_ENDPOINT_URL_S3}/nit/${key}`;
}

// ── GET all departments ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET one department (full data) ────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [dept, vision, faculty, staff, progs, labs, contact, pubs, projects, written, supervision] =
      await Promise.all([
        pool.query('SELECT * FROM departments WHERE id=$1', [id]),
        pool.query('SELECT * FROM department_visions WHERE department_id=$1', [id]),
        pool.query('SELECT * FROM department_faculty WHERE department_id=$1 ORDER BY type, sl_no', [id]),
        pool.query('SELECT * FROM department_staff WHERE department_id=$1 ORDER BY type, sl_no', [id]),
        pool.query('SELECT * FROM department_prog WHERE department_id=$1 ORDER BY sl_no', [id]),
        pool.query('SELECT * FROM department_labs WHERE department_id=$1 ORDER BY sl_no', [id]),
        pool.query('SELECT * FROM department_contact WHERE department_id=$1', [id]),
        pool.query('SELECT * FROM department_research_publications WHERE department_id=$1 ORDER BY year DESC', [id]),
        pool.query('SELECT * FROM department_research_projects WHERE department_id=$1 ORDER BY id', [id]),
        pool.query('SELECT * FROM department_research_written WHERE department_id=$1 ORDER BY id', [id]),
        pool.query('SELECT * FROM department_research_supervision WHERE department_id=$1 ORDER BY id', [id]),
      ]);

    if (!dept.rows.length) return res.status(404).json({ error: 'Department not found' });

    res.json({
      department: dept.rows[0],
      vision: vision.rows[0] || null,
      faculty: faculty.rows,
      staff: staff.rows,
      programmes: progs.rows,
      labs: labs.rows,
      contact: contact.rows[0] || null,
      research: {
        publications: pubs.rows,
        projects: projects.rows,
        written: written.rows,
        supervision: supervision.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST create department ────────────────────────────────────────────────────
router.post('/', upload.single('photo_file'), async (req, res) => {
  try {
    const { name_en, name_hn, description_en, description_hn } = req.body;
    let photo_url = req.body.photo_url || null;
    if (req.file) photo_url = await uploadToS3(req.file);

    const result = await pool.query(
      `INSERT INTO departments (name_en, name_hn, description_en, description_hn, photo_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name_en, name_hn, description_en, description_hn, photo_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT update department ─────────────────────────────────────────────────────
router.put('/:id', upload.single('photo_file'), async (req, res) => {
  const { id } = req.params;
  try {
    const { name_en, name_hn, description_en, description_hn } = req.body;
    let photo_url = req.body.photo_url || null;
    if (req.file) photo_url = await uploadToS3(req.file);

    const result = await pool.query(
      `UPDATE departments SET name_en=$1, name_hn=$2, description_en=$3, description_hn=$4,
       photo_url=COALESCE($5,photo_url), updated_at=NOW() WHERE id=$6 RETURNING *`,
      [name_en, name_hn, description_en, description_hn, photo_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE department ─────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM departments WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// VISION & MISSION
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/vision', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_visions WHERE department_id=$1', [req.params.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/vision', async (req, res) => {
  const { id } = req.params;
  const { vision_en, vision_hn, mission_en, mission_hn } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM department_visions WHERE department_id=$1', [id]);
    let result;
    if (existing.rows.length) {
      result = await pool.query(
        `UPDATE department_visions SET vision_en=$1, vision_hn=$2, mission_en=$3, mission_hn=$4, updated_at=NOW()
         WHERE department_id=$5 RETURNING *`,
        [vision_en, vision_hn, mission_en, mission_hn, id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO department_visions (department_id, vision_en, vision_hn, mission_en, mission_hn)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, vision_en, vision_hn, mission_en, mission_hn]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// FACULTY
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/faculty', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM department_faculty WHERE department_id=$1 ORDER BY type, sl_no', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/faculty', async (req, res) => {
  const { id } = req.params;
  const { faculty_id, type, name, name_en, area_of_interest, email, profile_link, sl_no } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_faculty (department_id, faculty_id, type, name, name_en, area_of_interest, email, profile_link, sl_no)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, faculty_id || null, type, name || name_en, name_en || name, area_of_interest, email, profile_link, sl_no || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/faculty/:fid', async (req, res) => {
  const { fid } = req.params;
  const { faculty_id, type, name, name_en, area_of_interest, email, profile_link, sl_no } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_faculty SET faculty_id=$1, type=$2, name=$3, name_en=$4,
       area_of_interest=$5, email=$6, profile_link=$7, sl_no=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [faculty_id || null, type, name || name_en, name_en || name, area_of_interest, email, profile_link, sl_no || 1, fid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/faculty/:fid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_faculty WHERE id=$1', [req.params.fid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// STAFF
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/staff', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM department_staff WHERE department_id=$1 ORDER BY type, sl_no', [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/staff', async (req, res) => {
  const { id } = req.params;
  const { type, name, designation, phone_no, email, sl_no } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_staff (department_id, type, name, name_en, designation, phone_no, email, sl_no)
       VALUES ($1,$2,$3,$3,$4,$5,$6,$7) RETURNING *`,
      [id, type || 'Office Staff', name, designation, phone_no, email, sl_no || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/staff/:sid', async (req, res) => {
  const { sid } = req.params;
  const { type, name, designation, phone_no, email, sl_no } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_staff SET type=$1, name=$2, name_en=$2, designation=$3,
       phone_no=$4, email=$5, sl_no=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [type, name, designation, phone_no, email, sl_no || 1, sid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/staff/:sid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_staff WHERE id=$1', [req.params.sid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// PROGRAMMES
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/programmes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_prog WHERE department_id=$1 ORDER BY sl_no', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/programmes', async (req, res) => {
  const { id } = req.params;
  const { program_name_en, program_name_hn, sl_no } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_prog (department_id, program_name_en, program_name_hn, sl_no) VALUES ($1,$2,$3,$4) RETURNING *`,
      [id, program_name_en, program_name_hn, sl_no || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/programmes/:pid', async (req, res) => {
  const { pid } = req.params;
  const { program_name_en, program_name_hn, sl_no } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_prog SET program_name_en=$1, program_name_hn=$2, sl_no=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
      [program_name_en, program_name_hn, sl_no, pid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/programmes/:pid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_prog WHERE id=$1', [req.params.pid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// LABS
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/labs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_labs WHERE department_id=$1 ORDER BY sl_no', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/labs', async (req, res) => {
  const { id } = req.params;
  const { lab_name_en, lab_name_hn, sl_no } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_labs (department_id, lab_name_en, lab_name_hn, sl_no) VALUES ($1,$2,$3,$4) RETURNING *`,
      [id, lab_name_en, lab_name_hn, sl_no || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/labs/:lid', async (req, res) => {
  const { lid } = req.params;
  const { lab_name_en, lab_name_hn, sl_no } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_labs SET lab_name_en=$1, lab_name_hn=$2, sl_no=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
      [lab_name_en, lab_name_hn, sl_no, lid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/labs/:lid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_labs WHERE id=$1', [req.params.lid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// CONTACT
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_contact WHERE department_id=$1', [req.params.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/contact', async (req, res) => {
  const { id } = req.params;
  const { hod_en, hod_hn, phone_no, hod_email, office_email, department, college, address } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM department_contact WHERE department_id=$1', [id]);
    let result;
    if (existing.rows.length) {
      result = await pool.query(
        `UPDATE department_contact SET hod_en=$1, hod_hn=$2, phone_no=$3, hod_email=$4,
         office_email=$5, department=$6, college=$7, address=$8, updated_at=NOW()
         WHERE department_id=$9 RETURNING *`,
        [hod_en, hod_hn, phone_no, hod_email, office_email, department, college, address, id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO department_contact (department_id, hod_en, hod_hn, phone_no, hod_email, office_email, department, college, address)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [id, hod_en, hod_hn, phone_no, hod_email, office_email, department, college, address]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// RESEARCH PUBLICATIONS
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/research/publications', async (req, res) => {
  try {
    const { page = 1, limit = 25, year, search } = req.query;
    let q = 'SELECT * FROM department_research_publications WHERE department_id=$1';
    const params = [req.params.id];
    if (year) { params.push(year); q += ` AND year=$${params.length}`; }
    if (search) { params.push(`%${search}%`); q += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length})`; }
    q += ' ORDER BY year DESC';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const countQ = q.replace('SELECT *', 'SELECT COUNT(*)');
    const [data, count] = await Promise.all([
      pool.query(q + ` LIMIT ${limit} OFFSET ${offset}`, params),
      pool.query(countQ, params),
    ]);
    res.json({ data: data.rows, total: parseInt(count.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/research/publications', async (req, res) => {
  const { id } = req.params;
  const { journal_name, title, author, sci, year, volume, doi } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_research_publications (department_id, journal_name, title, author, sci, year, volume, doi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, journal_name, title, author, sci, year, volume, doi]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/research/publications/:rid', async (req, res) => {
  const { rid } = req.params;
  const { journal_name, title, author, sci, year, volume, doi } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_research_publications SET journal_name=$1, title=$2, author=$3, sci=$4, year=$5, volume=$6, doi=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [journal_name, title, author, sci, year, volume, doi, rid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/research/publications/:rid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_research_publications WHERE id=$1', [req.params.rid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// RESEARCH PROJECTS
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/research/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_research_projects WHERE department_id=$1 ORDER BY id', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/research/projects', async (req, res) => {
  const { id } = req.params;
  const { role, project_type, title, funding_agency, from_date, to_date, amount, status, co_investigator, sanction_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_research_projects (department_id, role, project_type, title, funding_agency, from_date, to_date, amount, status, co_investigator, sanction_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, role, project_type, title, funding_agency, from_date, to_date, amount, status, co_investigator, sanction_order]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/research/projects/:pid', async (req, res) => {
  const { pid } = req.params;
  const { role, project_type, title, funding_agency, from_date, to_date, amount, status, co_investigator, sanction_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE department_research_projects SET role=$1, project_type=$2, title=$3, funding_agency=$4,
       from_date=$5, to_date=$6, amount=$7, status=$8, co_investigator=$9, sanction_order=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [role, project_type, title, funding_agency, from_date, to_date, amount, status, co_investigator, sanction_order, pid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/research/projects/:pid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_research_projects WHERE id=$1', [req.params.pid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// RESEARCH — BOOKS/CHAPTERS WRITTEN
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/research/written', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_research_written WHERE department_id=$1 ORDER BY year DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/research/written', async (req, res) => {
  const { id } = req.params;
  const { type, title, publisher, author, isbn, year } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_research_written (department_id, type, title, publisher, author, isbn, year) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, type, title, publisher, author, isbn, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/research/written/:wid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_research_written WHERE id=$1', [req.params.wid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// RESEARCH — SUPERVISION
// ════════════════════════════════════════════════════════════════════════════
router.get('/:id/research/supervision', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department_research_supervision WHERE department_id=$1 ORDER BY year DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/research/supervision', async (req, res) => {
  const { id } = req.params;
  const { program_name, scholar_name, research_topic, status, year, co_supervisor } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO department_research_supervision (department_id, program_name, scholar_name, research_topic, status, year, co_supervisor)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, program_name, scholar_name, research_topic, status, year, co_supervisor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/research/supervision/:sid', async (req, res) => {
  try {
    await pool.query('DELETE FROM department_research_supervision WHERE id=$1', [req.params.sid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;