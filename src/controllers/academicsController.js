const db = require('../db/db');

// ===================== ACADEMICS OVERVIEW CRUD =====================
exports.getAcademics = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM academics ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAcademics = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await db.query(
      'UPDATE academics SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== ACADEMICS TABLES CRUD =====================
exports.getAllAcademicTables = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM academic_tables ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAcademicTableEntry = async (req, res) => {
  try {
    const { table_name, name, responsibility, email, phone } = req.body;
    const result = await db.query(
      'INSERT INTO academic_tables (table_name, name, responsibility, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [table_name, name, responsibility, email, phone]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAcademicTableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { table_name, name, responsibility, email, phone } = req.body;
    const result = await db.query(
      'UPDATE academic_tables SET table_name = $1, name = $2, responsibility = $3, email = $4, phone = $5 WHERE id = $6 RETURNING *',
      [table_name, name, responsibility, email, phone, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAcademicTableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academic_tables WHERE id = $1', [id]);
    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== ACADEMICS LINKS CRUD =====================
exports.getAllAcademicLinks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM academics_links ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAcademicLink = async (req, res) => {
  try {
    const { title, name, title_href, word_url } = req.body;
    const result = await db.query(
      'INSERT INTO academics_links (title, name, title_href, word_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, name, title_href, word_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAcademicLink = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academics_links WHERE id = $1', [id]);
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ===================== ACADEMIC NOTICES CRUD =====================
exports.getAllAcademicNotices = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM academic_notices ORDER BY date DESC, id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAcademicNotice = async (req, res) => {
  try {
    const { title, description, category, date, view_url, download_url } = req.body;
    const result = await db.query(
      'INSERT INTO academic_notices (title, description, category, date, view_url, download_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, category, date, view_url, download_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAcademicNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, date, view_url, download_url } = req.body;
    const result = await db.query(
      'UPDATE academic_notices SET title = $1, description = $2, category = $3, date = $4, view_url = $5, download_url = $6 WHERE id = $7 RETURNING *',
      [title, description, category, date, view_url, download_url, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAcademicNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academic_notices WHERE id = $1', [id]);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== ACADEMIC CALENDARS CRUD =====================
exports.getAllAcademicCalendars = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM academic_calendars ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAcademicCalendar = async (req, res) => {
  try {
    const { title, description, pdf_url, view_url } = req.body;
    const result = await db.query(
      'INSERT INTO academic_calendars (title, description, pdf_url, view_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, pdf_url, view_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAcademicCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, pdf_url, view_url } = req.body;
    const result = await db.query(
      'UPDATE academic_calendars SET title = $1, description = $2, pdf_url = $3, view_url = $4 WHERE id = $5 RETURNING *',
      [title, description, pdf_url, view_url, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAcademicCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academic_calendars WHERE id = $1', [id]);
    res.json({ success: true, message: 'Calendar deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
