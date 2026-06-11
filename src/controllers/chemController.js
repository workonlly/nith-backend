// src/controllers/chemController.js
// CHEM Department Controller - CRUD operations for Chemistry-related tables
// Pattern copied from cseController.js and adapted for 'chem'

const pool = require("../db/db");
const { StatusCodes } = require("http-status-codes");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../db/minio");

const CHEM_MEDIA_BUCKET = "images";

const deleteMinioFile = async (fileUrl, bucketName = CHEM_MEDIA_BUCKET) => {
  if (!fileUrl) return;
  try {
    const fileKey = decodeURIComponent(fileUrl.split("/").pop());
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
    );
  } catch (err) {
    console.error("[MinIO] Error deleting file:", err);
  }
};

const getCHEMDeptId = async () => {
  const result = await pool.query(
    `SELECT cd.id FROM chem_department cd
     JOIN department_master dm ON cd.department_id = dm.id
     WHERE dm.code = 'chem'`
  );
  return result.rowCount > 0 ? result.rows[0].id : null;
};

const filterByLanguage = (data, language = 'en') => {
  if (!data) return null;
  if (language === 'both') return data;

  const filtered = {};
  Object.keys(data).forEach((key) => {
    if (key.endsWith('_en') || key.endsWith('_hi')) {
      const baseName = key.slice(0, -3);
      if (key.endsWith(`_${language}`)) {
        filtered[baseName] = data[key];
      }
    } else {
      filtered[key] = data[key];
    }
  });
  return filtered;
};

const sendResponse = (res, statusCode, success, message, data = null, count = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(statusCode).json(response);
};

// CHEM main page CRUD
const getCHEMDepartmentInfo = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT cd.* FROM chem_department cd
       JOIN department_master dm ON cd.department_id = dm.id
       WHERE dm.code = 'chem'`
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department info not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'CHEM info retrieved', filtered);
  } catch (error) {
    console.error('Error fetching CHEM info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching CHEM info');
  }
};

const createCHEMDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url } = req.body;

    const deptResult = await pool.query(`SELECT id FROM department_master WHERE code = 'chem'`);
    if (deptResult.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department master not found');
    }

    const department_id = deptResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO chem_department 
       (department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, default_language)
       VALUES ($1, $2, $3, $4, $5, $6, 'en')
       RETURNING *`,
      [department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'CHEM info created', result.rows[0]);
  } catch (error) {
    console.error('Error creating CHEM info:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'CHEM info already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating CHEM info');
  }
};

const updateCHEMDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published } = req.body;

    if (dept_image_url) {
      const existing = await pool.query(
        `SELECT dept_image_url FROM chem_department
         WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')`
      );
      if (existing.rowCount > 0 && existing.rows[0].dept_image_url && existing.rows[0].dept_image_url !== dept_image_url) {
        await deleteMinioFile(existing.rows[0].dept_image_url);
      }
    }

    const result = await pool.query(
      `UPDATE chem_department 
       SET intro_heading_en = COALESCE($1, intro_heading_en),
           intro_heading_hi = COALESCE($2, intro_heading_hi),
           intro_description_en = COALESCE($3, intro_description_en),
           intro_description_hi = COALESCE($4, intro_description_hi),
           dept_image_url = COALESCE($5, dept_image_url),
           is_published = COALESCE($6, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')
       RETURNING *`,
      [intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM info not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'CHEM info updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating CHEM info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating CHEM info');
  }
};

const deleteCHEMDepartmentInfo = async (req, res) => {
  try {
    const existing = await pool.query(
      `SELECT dept_image_url FROM chem_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')`
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM info not found');
    }

    await deleteMinioFile(existing.rows[0].dept_image_url);

    const result = await pool.query(
      `DELETE FROM chem_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')
       RETURNING id`
    );

    return sendResponse(res, StatusCodes.OK, true, 'CHEM info deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting CHEM info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting CHEM info');
  }
};

const toggleCHEMLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!['en', 'hi'].includes(language)) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Language must be "en" or "hi"');
    }

    const result = await pool.query(
      `UPDATE chem_department 
       SET default_language = $1, updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')
       RETURNING default_language`,
      [language]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Language toggled successfully', {
      new_default_language: result.rows[0].default_language
    });
  } catch (error) {
    console.error('Error toggling language:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error toggling language');
  }
};

// CHEM Programmes CRUD
const getCHEMProgrammes = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT * FROM chem_programmes 
       WHERE chem_dept_id = (SELECT id FROM chem_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem'))
       ORDER BY order_index ASC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Programmes retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programmes');
  }
};

const getCHEMProgrammeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const chemDeptId = await getCHEMDeptId();
    if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found');

    const result = await pool.query(`SELECT * FROM chem_programmes WHERE id = $1 AND chem_dept_id = $2`, [id, chemDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Programme retrieved', filtered);
  } catch (error) {
    console.error('Error fetching programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programme');
  }
};

const createCHEMProgramme = async (req, res) => {
  try {
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;
    const chemDeptId = await getCHEMDeptId();
    if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.');

    if (!programme_type || !title_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'programme_type and title_en are required');

    const result = await pool.query(
      `INSERT INTO chem_programmes 
       (chem_dept_id, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [chemDeptId, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Programme created', result.rows[0]);
  } catch (error) {
    console.error('Error creating programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating programme');
  }
};

const updateCHEMProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;

    const result = await pool.query(
      `UPDATE chem_programmes 
       SET programme_type = COALESCE($1, programme_type),
           title_en = COALESCE($2, title_en),
           title_hi = COALESCE($3, title_hi),
           description_en = COALESCE($4, description_en),
           description_hi = COALESCE($5, description_hi),
           duration_years = COALESCE($6, duration_years),
           icon_emoji = COALESCE($7, icon_emoji),
           order_index = COALESCE($8, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index, id]
    );

    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    return sendResponse(res, StatusCodes.OK, true, 'Programme updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating programme');
  }
};

const deleteCHEMProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM chem_programmes WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    return sendResponse(res, StatusCodes.OK, true, 'Programme deleted');
  } catch (error) {
    console.error('Error deleting programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting programme');
  }
};

// Mission & Vision
const getCHEMMissionVision = async (req, res) => {
  try { const { language = 'en' } = req.query; const result = await pool.query(`SELECT * FROM chem_mission_vision WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem'))`); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision retrieved', filtered); } catch (error) { console.error('Error fetching mission & vision:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching mission & vision'); }
};

const createCHEMMissionVision = async (req, res) => {
  try { const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.'); const result = await pool.query(`INSERT INTO chem_mission_vision (chem_dept_id, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [chemDeptId, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]); return sendResponse(res, StatusCodes.CREATED, true, 'Mission & Vision created', result.rows[0]); } catch (error) { console.error('Error creating mission & vision:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating mission & vision'); }
};

const updateCHEMMissionVision = async (req, res) => {
  try { const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body; const result = await pool.query(`UPDATE chem_mission_vision SET mission_heading_en = COALESCE($1, mission_heading_en), mission_heading_hi = COALESCE($2, mission_heading_hi), mission_description_en = COALESCE($3, mission_description_en), mission_description_hi = COALESCE($4, mission_description_hi), mission_points_en = COALESCE($5, mission_points_en), mission_points_hi = COALESCE($6, mission_points_hi), updated_at = CURRENT_TIMESTAMP WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')) RETURNING *`, [mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found'); return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision updated', result.rows[0]); } catch (error) { console.error('Error updating mission & vision:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating mission & vision'); }
};

const deleteCHEMMissionVision = async (req, res) => {
  try { const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`DELETE FROM chem_mission_vision WHERE chem_dept_id = $1 RETURNING id`, [chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found'); return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision deleted', { id: result.rows[0].id }); } catch (error) { console.error('Error deleting mission & vision:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting mission & vision'); }
};

// Research areas
const getCHEMResearchAreas = async (req, res) => {
  try { const { language = 'en' } = req.query; const result = await pool.query(`SELECT * FROM chem_research_areas WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')) ORDER BY order_index ASC`); const filtered = result.rows.map(row => filterByLanguage(row, language)); return sendResponse(res, StatusCodes.OK, true, 'Research areas retrieved', filtered, result.rowCount); } catch (error) { console.error('Error fetching research areas:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research areas'); }
};

const getCHEMResearchAreaById = async (req, res) => {
  try { const { id } = req.params; const { language = 'en' } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`SELECT * FROM chem_research_areas WHERE id = $1 AND chem_dept_id = $2`, [id, chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Research area retrieved', filtered); } catch (error) { console.error('Error fetching research area:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research area'); }
};

const createCHEMResearchArea = async (req, res) => {
  try { const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.'); if (!area_name_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'area_name_en is required'); const result = await pool.query(`INSERT INTO chem_research_areas (chem_dept_id, area_name_en, area_name_hi, description_en, description_hi, order_index) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [chemDeptId, area_name_en, area_name_hi, description_en, description_hi, order_index || 0]); return sendResponse(res, StatusCodes.CREATED, true, 'Research area created', result.rows[0]); } catch (error) { console.error('Error creating research area:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating research area'); }
};

const updateCHEMResearchArea = async (req, res) => {
  try { const { id } = req.params; const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body; const result = await pool.query(`UPDATE chem_research_areas SET area_name_en = COALESCE($1, area_name_en), area_name_hi = COALESCE($2, area_name_hi), description_en = COALESCE($3, description_en), description_hi = COALESCE($4, description_hi), order_index = COALESCE($5, order_index), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`, [area_name_en, area_name_hi, description_en, description_hi, order_index, id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found'); return sendResponse(res, StatusCodes.OK, true, 'Research area updated', result.rows[0]); } catch (error) { console.error('Error updating research area:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating research area'); }
};

const deleteCHEMResearchArea = async (req, res) => {
  try { const { id } = req.params; const result = await pool.query(`DELETE FROM chem_research_areas WHERE id = $1 RETURNING id`, [id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found'); return sendResponse(res, StatusCodes.OK, true, 'Research area deleted'); } catch (error) { console.error('Error deleting research area:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting research area'); }
};

// Publications (chem_publications)
const getCHEMPublications = async (req, res) => {
  try { const { language = 'en' } = req.query; const result = await pool.query(`SELECT * FROM chem_publications WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')) ORDER BY published_at DESC`); const filtered = result.rows.map(row => filterByLanguage(row, language)); return sendResponse(res, StatusCodes.OK, true, 'Publications retrieved', filtered, result.rowCount); } catch (error) { console.error('Error fetching publications:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publications'); }
};

const getCHEMPublicationById = async (req, res) => {
  try { const { id } = req.params; const { language = 'en' } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`SELECT * FROM chem_publications WHERE id = $1 AND chem_dept_id = $2`, [id, chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Publication retrieved', filtered); } catch (error) { console.error('Error fetching publication:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publication'); }
};

const createCHEMPublication = async (req, res) => {
  try { const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.'); if (!title_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'title_en is required'); if (published_at && Number.isNaN(Date.parse(published_at))) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Invalid published_at date format'); const result = await pool.query(`INSERT INTO chem_publications (chem_dept_id, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [chemDeptId, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi]); return sendResponse(res, StatusCodes.CREATED, true, 'Publication created', result.rows[0]); } catch (error) { console.error('Error creating publication:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating publication'); }
};

const updateCHEMPublication = async (req, res) => {
  try { const { id } = req.params; const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body; const result = await pool.query(`UPDATE chem_publications SET title_en = COALESCE($1, title_en), title_hi = COALESCE($2, title_hi), authors = COALESCE($3, authors), published_at = COALESCE($4, published_at), venue = COALESCE($5, venue), url = COALESCE($6, url), abstract_en = COALESCE($7, abstract_en), abstract_hi = COALESCE($8, abstract_hi), updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *`, [title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi, id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found'); return sendResponse(res, StatusCodes.OK, true, 'Publication updated', result.rows[0]); } catch (error) { console.error('Error updating publication:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating publication'); }
};

const deleteCHEMPublication = async (req, res) => {
  try { const { id } = req.params; const result = await pool.query(`DELETE FROM chem_publications WHERE id = $1 RETURNING id`, [id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found'); return sendResponse(res, StatusCodes.OK, true, 'Publication deleted'); } catch (error) { console.error('Error deleting publication:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting publication'); }
};

// Faculty
const getCHEMFaculty = async (req, res) => { try { const { language = 'en', active_only = false } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const whereClause = active_only ? 'AND is_active = true' : ''; const result = await pool.query(`SELECT * FROM chem_faculty WHERE chem_dept_id = $1 ${whereClause} ORDER BY order_index ASC`, [chemDeptId]); const filtered = result.rows.map(row => filterByLanguage(row, language)); return sendResponse(res, StatusCodes.OK, true, 'Faculty retrieved', filtered, result.rowCount); } catch (error) { console.error('Error fetching faculty:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty'); } };

const getCHEMFacultyMemberById = async (req, res) => { try { const { id } = req.params; const { language = 'en' } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`SELECT * FROM chem_faculty WHERE id = $1 AND chem_dept_id = $2`, [id, chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Faculty member retrieved', filtered); } catch (error) { console.error('Error fetching faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty member'); } };

const createCHEMFacultyMember = async (req, res) => { try { const { name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index, faculty_id } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`INSERT INTO chem_faculty (chem_dept_id, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`, [chemDeptId, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active || true, order_index || 0]); return sendResponse(res, StatusCodes.CREATED, true, 'Faculty member created', result.rows[0]); } catch (error) { console.error('Error creating faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating faculty member'); } };

const updateCHEMFacultyMember = async (req, res) => { try { const { id } = req.params; const fields = req.body; const setClauses = []; const params = []; let idx = 1; Object.keys(fields).forEach(k => { setClauses.push(`${k} = COALESCE($${idx}, ${k})`); params.push(fields[k]); idx++; }); params.push(id); const q = `UPDATE chem_faculty SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`; const result = await pool.query(q, params); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found'); return sendResponse(res, StatusCodes.OK, true, 'Faculty member updated', result.rows[0]); } catch (error) { console.error('Error updating faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating faculty member'); } };

const deleteCHEMFacultyMember = async (req, res) => { try { const { id } = req.params; const existing = await pool.query(`SELECT photo_url FROM chem_faculty WHERE id = $1`, [id]); if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found'); await deleteMinioFile(existing.rows[0].photo_url); await pool.query(`DELETE FROM chem_faculty WHERE id = $1`, [id]); return sendResponse(res, StatusCodes.OK, true, 'Faculty member deleted'); } catch (error) { console.error('Error deleting faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting faculty member'); } };

// Labs CRUD
const getCHEMLabs = async (req, res) => { try { const { language = 'en' } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`SELECT * FROM chem_labs WHERE chem_dept_id = $1 ORDER BY order_index ASC`, [chemDeptId]); const filtered = result.rows.map(r => filterByLanguage(r, language)); return sendResponse(res, StatusCodes.OK, true, 'Labs retrieved', filtered, result.rowCount); } catch (error) { console.error('Error fetching labs:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching labs'); } };

const getCHEMLabById = async (req, res) => { try { const { id } = req.params; const { language = 'en' } = req.query; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`SELECT * FROM chem_labs WHERE id = $1 AND chem_dept_id = $2`, [id, chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Lab retrieved', filtered); } catch (error) { console.error('Error fetching lab:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching lab'); } };

const createCHEMLab = async (req, res) => { try { const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.'); if (!lab_name_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'lab_name_en is required'); const result = await pool.query(`INSERT INTO chem_labs (chem_dept_id, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [chemDeptId, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index || 0]); return sendResponse(res, StatusCodes.CREATED, true, 'Lab created', result.rows[0]); } catch (error) { console.error('Error creating lab:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating lab'); } };

const updateCHEMLab = async (req, res) => { try { const { id } = req.params; const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body; if (lab_image_url) { const existing = await pool.query(`SELECT lab_image_url FROM chem_labs WHERE id = $1`, [id]); if (existing.rowCount > 0 && existing.rows[0].lab_image_url && existing.rows[0].lab_image_url !== lab_image_url) { await deleteMinioFile(existing.rows[0].lab_image_url); } } const result = await pool.query(`UPDATE chem_labs SET lab_name_en = COALESCE($1, lab_name_en), lab_name_hi = COALESCE($2, lab_name_hi), description_en = COALESCE($3, description_en), description_hi = COALESCE($4, description_hi), location = COALESCE($5, location), incharge_name = COALESCE($6, incharge_name), incharge_email = COALESCE($7, incharge_email), incharge_phone = COALESCE($8, incharge_phone), lab_image_url = COALESCE($9, lab_image_url), order_index = COALESCE($10, order_index), updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *`, [lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index, id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found'); return sendResponse(res, StatusCodes.OK, true, 'Lab updated', result.rows[0]); } catch (error) { console.error('Error updating lab:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating lab'); } };

const deleteCHEMLab = async (req, res) => { try { const { id } = req.params; const existing = await pool.query(`SELECT lab_image_url FROM chem_labs WHERE id = $1`, [id]); if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found'); await deleteMinioFile(existing.rows[0].lab_image_url); const result = await pool.query(`DELETE FROM chem_labs WHERE id = $1 RETURNING id`, [id]); return sendResponse(res, StatusCodes.OK, true, 'Lab deleted', { id: result.rows[0].id }); } catch (error) { console.error('Error deleting lab:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting lab'); } };

// Contact CRUD
const getCHEMContact = async (req, res) => { try { const { language = 'en' } = req.query; const result = await pool.query(`SELECT * FROM chem_contact WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem'))`); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Contact retrieved', filtered); } catch (error) { console.error('Error fetching contact:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching contact'); } };

const createCHEMContact = async (req, res) => { try { const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found. Create CHEM department info first.'); const result = await pool.query(`INSERT INTO chem_contact (chem_dept_id, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [chemDeptId, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]); return sendResponse(res, StatusCodes.CREATED, true, 'Contact info created', result.rows[0]); } catch (error) { console.error('Error creating contact:', error); if (error.code === '23505') return sendResponse(res, StatusCodes.CONFLICT, false, 'Contact info already exists'); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating contact'); } };

const updateCHEMContact = async (req, res) => { try { const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body; const result = await pool.query(`UPDATE chem_contact SET office_address_en = COALESCE($1, office_address_en), office_address_hi = COALESCE($2, office_address_hi), phone = COALESCE($3, phone), fax = COALESCE($4, fax), email = COALESCE($5, email), website_url = COALESCE($6, website_url), map_embed_url = COALESCE($7, map_embed_url), head_of_dept_name = COALESCE($8, head_of_dept_name), head_of_dept_email = COALESCE($9, head_of_dept_email), head_of_dept_phone = COALESCE($10, head_of_dept_phone), updated_at = CURRENT_TIMESTAMP WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')) RETURNING *`, [office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found'); return sendResponse(res, StatusCodes.OK, true, 'Contact info updated', result.rows[0]); } catch (error) { console.error('Error updating contact:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating contact'); } };

const deleteCHEMContact = async (req, res) => { try { const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); const result = await pool.query(`DELETE FROM chem_contact WHERE chem_dept_id = $1 RETURNING id`, [chemDeptId]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found'); return sendResponse(res, StatusCodes.OK, true, 'Contact info deleted', { id: result.rows[0].id }); } catch (error) { console.error('Error deleting contact:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting contact'); } };

const getCHEMMedia = async (req, res) => { try { const result = await pool.query(`SELECT * FROM chem_media WHERE chem_dept_id = (SELECT id FROM chem_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'chem')) ORDER BY created_at DESC`); return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', result.rows, result.rowCount); } catch (error) { console.error('Error fetching media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media'); } };

const getCHEMMediaById = async (req, res) => { try { const { id } = req.params; const result = await pool.query(`SELECT * FROM chem_media WHERE id = $1`, [id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', result.rows[0]); } catch (error) { console.error('Error fetching media by id:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media'); } };

const uploadCHEMMedia = async (req, res) => { try { const { media_type, file_name, file_url, caption_en, caption_hi, category } = req.body; const chemDeptId = await getCHEMDeptId(); if (!chemDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CHEM department setup not found'); if (!file_url) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'file_url is required'); const result = await pool.query(`INSERT INTO chem_media (chem_dept_id, media_type, file_name, file_url, caption_en, caption_hi, category) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [chemDeptId, media_type, file_name, file_url, caption_en, caption_hi, category]); return sendResponse(res, StatusCodes.CREATED, true, 'Media uploaded', result.rows[0]); } catch (error) { console.error('Error uploading media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error uploading media'); } };

const updateCHEMMedia = async (req, res) => { try { const { id } = req.params; const fields = req.body; const setClauses = []; const params = []; let idx = 1; Object.keys(fields).forEach(k => { setClauses.push(`${k} = COALESCE($${idx}, ${k})`); params.push(fields[k]); idx++; }); params.push(id); const q = `UPDATE chem_media SET ${setClauses.join(', ')}, created_at = COALESCE(created_at, CURRENT_TIMESTAMP) WHERE id = $${idx} RETURNING *`; const result = await pool.query(q, params); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); return sendResponse(res, StatusCodes.OK, true, 'Media updated', result.rows[0]); } catch (error) { console.error('Error updating media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating media'); } };

const deleteCHEMMedia = async (req, res) => { try { const { id } = req.params; const existing = await pool.query(`SELECT file_url FROM chem_media WHERE id = $1`, [id]); if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); await deleteMinioFile(existing.rows[0].file_url); await pool.query(`DELETE FROM chem_media WHERE id = $1`, [id]); return sendResponse(res, StatusCodes.OK, true, 'Media deleted'); } catch (error) { console.error('Error deleting media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting media'); } };

module.exports = {
  getCHEMDepartmentInfo,
  createCHEMDepartmentInfo,
  updateCHEMDepartmentInfo,
  deleteCHEMDepartmentInfo,
  toggleCHEMLanguage,
  getCHEMProgrammes,
  getCHEMProgrammeById,
  createCHEMProgramme,
  updateCHEMProgramme,
  deleteCHEMProgramme,
  getCHEMMissionVision,
  createCHEMMissionVision,
  updateCHEMMissionVision,
  deleteCHEMMissionVision,
  getCHEMResearchAreas,
  getCHEMResearchAreaById,
  createCHEMResearchArea,
  updateCHEMResearchArea,
  deleteCHEMResearchArea,
  getCHEMPublications,
  getCHEMPublicationById,
  createCHEMPublication,
  updateCHEMPublication,
  deleteCHEMPublication,
  getCHEMFaculty,
  getCHEMFacultyMemberById,
  createCHEMFacultyMember,
  updateCHEMFacultyMember,
  deleteCHEMFacultyMember,
  getCHEMLabs,
  getCHEMLabById,
  createCHEMLab,
  updateCHEMLab,
  deleteCHEMLab,
  getCHEMContact,
  createCHEMContact,
  updateCHEMContact,
  deleteCHEMContact,
  getCHEMMedia,
  getCHEMMediaById,
  uploadCHEMMedia,
  updateCHEMMedia,
  deleteCHEMMedia
};
