// src/controllers/mncController.js
// MNC Department Controller - CRUD operations for MNC-related tables
// Pattern copied from cseController.js and adapted for 'mnc'

const pool = require("../db/db");
const { StatusCodes } = require("http-status-codes");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../db/minio");

const MNC_MEDIA_BUCKET = "images";

const deleteMinioFile = async (fileUrl, bucketName = MNC_MEDIA_BUCKET) => {
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

const getMNCDeptId = async () => {
  const result = await pool.query(
    `SELECT md.id FROM mnc_department md
     JOIN department_master dm ON md.department_id = dm.id
     WHERE dm.code = 'mnc'`
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

// MNC main page CRUD
const getMNCDepartmentInfo = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT md.* FROM mnc_department md
       JOIN department_master dm ON md.department_id = dm.id
       WHERE dm.code = 'mnc'`
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department info not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'MNC info retrieved', filtered);
  } catch (error) {
    console.error('Error fetching MNC info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching MNC info');
  }
};

const createMNCDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url } = req.body;

    const deptResult = await pool.query(`SELECT id FROM department_master WHERE code = 'mnc'`);
    if (deptResult.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department master not found');
    }

    const department_id = deptResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO mnc_department 
       (department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, default_language)
       VALUES ($1, $2, $3, $4, $5, $6, 'en')
       RETURNING *`,
      [department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'MNC info created', result.rows[0]);
  } catch (error) {
    console.error('Error creating MNC info:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'MNC info already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating MNC info');
  }
};

const updateMNCDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published } = req.body;

    if (dept_image_url) {
      const existing = await pool.query(
        `SELECT dept_image_url FROM mnc_department
         WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')`
      );
      if (existing.rowCount > 0 && existing.rows[0].dept_image_url && existing.rows[0].dept_image_url !== dept_image_url) {
        await deleteMinioFile(existing.rows[0].dept_image_url);
      }
    }

    const result = await pool.query(
      `UPDATE mnc_department 
       SET intro_heading_en = COALESCE($1, intro_heading_en),
           intro_heading_hi = COALESCE($2, intro_heading_hi),
           intro_description_en = COALESCE($3, intro_description_en),
           intro_description_hi = COALESCE($4, intro_description_hi),
           dept_image_url = COALESCE($5, dept_image_url),
           is_published = COALESCE($6, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')
       RETURNING *`,
      [intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC info not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'MNC info updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating MNC info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating MNC info');
  }
};

const deleteMNCDepartmentInfo = async (req, res) => {
  try {
    const existing = await pool.query(
      `SELECT dept_image_url FROM mnc_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')`
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC info not found');
    }

    await deleteMinioFile(existing.rows[0].dept_image_url);

    const result = await pool.query(
      `DELETE FROM mnc_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')
       RETURNING id`
    );

    return sendResponse(res, StatusCodes.OK, true, 'MNC info deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting MNC info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting MNC info');
  }
};

const toggleMNCLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!['en', 'hi'].includes(language)) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Language must be "en" or "hi"');
    }

    const result = await pool.query(
      `UPDATE mnc_department 
       SET default_language = $1, updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')
       RETURNING default_language`,
      [language]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Language toggled successfully', {
      new_default_language: result.rows[0].default_language
    });
  } catch (error) {
    console.error('Error toggling language:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error toggling language');
  }
};

// MNC Programmes CRUD
const getMNCProgrammes = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT * FROM mnc_programmes 
       WHERE mnc_dept_id = (SELECT id FROM mnc_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))
       ORDER BY order_index ASC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Programmes retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programmes');
  }
};

const getMNCProgrammeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');

    const result = await pool.query(`SELECT * FROM mnc_programmes WHERE id = $1 AND mnc_dept_id = $2`, [id, mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Programme retrieved', filtered);
  } catch (error) {
    console.error('Error fetching programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programme');
  }
};

const createMNCProgramme = async (req, res) => {
  try {
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');

    if (!programme_type || !title_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'programme_type and title_en are required');

    const result = await pool.query(
      `INSERT INTO mnc_programmes 
       (mnc_dept_id, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [mncDeptId, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Programme created', result.rows[0]);
  } catch (error) {
    console.error('Error creating programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating programme');
  }
};

const updateMNCProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;

    const result = await pool.query(
      `UPDATE mnc_programmes 
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

const deleteMNCProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM mnc_programmes WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    return sendResponse(res, StatusCodes.OK, true, 'Programme deleted');
  } catch (error) {
    console.error('Error deleting programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting programme');
  }
};

// For brevity, reuse patterns for mission, research, publications, faculty, labs, contact, media
// Implementations follow same pattern as above but reference mnc_* tables and mnc_dept_id

// Mission & Vision
const getMNCMissionVision = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT * FROM mnc_mission_vision 
       WHERE mnc_dept_id = (SELECT id FROM mnc_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))`
    );
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision retrieved', filtered);
  } catch (error) {
    console.error('Error fetching mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching mission & vision');
  }
};

const createMNCMissionVision = async (req, res) => {
  try {
    const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');
    const result = await pool.query(
      `INSERT INTO mnc_mission_vision 
       (mnc_dept_id, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [mncDeptId, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]
    );
    return sendResponse(res, StatusCodes.CREATED, true, 'Mission & Vision created', result.rows[0]);
  } catch (error) {
    console.error('Error creating mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating mission & vision');
  }
};

const updateMNCMissionVision = async (req, res) => {
  try {
    const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body;
    const result = await pool.query(
      `UPDATE mnc_mission_vision 
       SET mission_heading_en = COALESCE($1, mission_heading_en),
           mission_heading_hi = COALESCE($2, mission_heading_hi),
           mission_description_en = COALESCE($3, mission_description_en),
           mission_description_hi = COALESCE($4, mission_description_hi),
           mission_points_en = COALESCE($5, mission_points_en),
           mission_points_hi = COALESCE($6, mission_points_hi),
           updated_at = CURRENT_TIMESTAMP
       WHERE mnc_dept_id = (SELECT id FROM mnc_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))
       RETURNING *`,
      [mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]
    );
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating mission & vision');
  }
};

const deleteMNCMissionVision = async (req, res) => {
  try {
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const result = await pool.query(`DELETE FROM mnc_mission_vision WHERE mnc_dept_id = $1 RETURNING id`, [mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting mission & vision');
  }
};

// Research areas
const getMNCResearchAreas = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT * FROM mnc_research_areas 
       WHERE mnc_dept_id = (SELECT id FROM mnc_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))
       ORDER BY order_index ASC`
    );
    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Research areas retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching research areas:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research areas');
  }
};

const getMNCResearchAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const result = await pool.query(`SELECT * FROM mnc_research_areas WHERE id = $1 AND mnc_dept_id = $2`, [id, mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Research area retrieved', filtered);
  } catch (error) {
    console.error('Error fetching research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research area');
  }
};

const createMNCResearchArea = async (req, res) => {
  try {
    const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');
    if (!area_name_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'area_name_en is required');
    const result = await pool.query(
      `INSERT INTO mnc_research_areas 
       (mnc_dept_id, area_name_en, area_name_hi, description_en, description_hi, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [mncDeptId, area_name_en, area_name_hi, description_en, description_hi, order_index || 0]
    );
    return sendResponse(res, StatusCodes.CREATED, true, 'Research area created', result.rows[0]);
  } catch (error) {
    console.error('Error creating research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating research area');
  }
};

const updateMNCResearchArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body;
    const result = await pool.query(
      `UPDATE mnc_research_areas 
       SET area_name_en = COALESCE($1, area_name_en),
           area_name_hi = COALESCE($2, area_name_hi),
           description_en = COALESCE($3, description_en),
           description_hi = COALESCE($4, description_hi),
           order_index = COALESCE($5, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [area_name_en, area_name_hi, description_en, description_hi, order_index, id]
    );
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    return sendResponse(res, StatusCodes.OK, true, 'Research area updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating research area');
  }
};

const deleteMNCResearchArea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM mnc_research_areas WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    return sendResponse(res, StatusCodes.OK, true, 'Research area deleted');
  } catch (error) {
    console.error('Error deleting research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting research area');
  }
};

// Publications (similar to cse_publications)
const getMNCPublications = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const result = await pool.query(
      `SELECT * FROM mnc_publications 
       WHERE mnc_dept_id = (SELECT id FROM mnc_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))
       ORDER BY published_at DESC`
    );
    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Publications retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publications');
  }
};

const getMNCPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const result = await pool.query(`SELECT * FROM mnc_publications WHERE id = $1 AND mnc_dept_id = $2`, [id, mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Publication retrieved', filtered);
  } catch (error) {
    console.error('Error fetching publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publication');
  }
};

const createMNCPublication = async (req, res) => {
  try {
    const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');
    if (!title_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'title_en is required');
    if (published_at && Number.isNaN(Date.parse(published_at))) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Invalid published_at date format');
    const result = await pool.query(
      `INSERT INTO mnc_publications 
       (mnc_dept_id, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [mncDeptId, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi]
    );
    return sendResponse(res, StatusCodes.CREATED, true, 'Publication created', result.rows[0]);
  } catch (error) {
    console.error('Error creating publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating publication');
  }
};

const updateMNCPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body;
    const result = await pool.query(
      `UPDATE mnc_publications 
       SET title_en = COALESCE($1, title_en),
           title_hi = COALESCE($2, title_hi),
           authors = COALESCE($3, authors),
           published_at = COALESCE($4, published_at),
           venue = COALESCE($5, venue),
           url = COALESCE($6, url),
           abstract_en = COALESCE($7, abstract_en),
           abstract_hi = COALESCE($8, abstract_hi),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi, id]
    );
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    return sendResponse(res, StatusCodes.OK, true, 'Publication updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating publication');
  }
};

const deleteMNCPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM mnc_publications WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    return sendResponse(res, StatusCodes.OK, true, 'Publication deleted');
  } catch (error) {
    console.error('Error deleting publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting publication');
  }
};

// Faculty, Labs, Contact, Media follow same patterns; implement CRUDs referencing respective tables
// Faculty
const getMNCFaculty = async (req, res) => {
  try {
    const { language = 'en', active_only = false } = req.query;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const whereClause = active_only ? 'AND is_active = true' : '';
    const result = await pool.query(`SELECT * FROM mnc_faculty WHERE mnc_dept_id = $1 ${whereClause} ORDER BY order_index ASC`, [mncDeptId]);
    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Faculty retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty');
  }
};

const getMNCFacultyMemberById = async (req, res) => {
  try {
    const { id } = req.params; const { language = 'en' } = req.query; const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const result = await pool.query(`SELECT * FROM mnc_faculty WHERE id = $1 AND mnc_dept_id = $2`, [id, mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found');
    const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Faculty member retrieved', filtered);
  } catch (error) { console.error('Error fetching faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty member'); }
};

const createMNCFacultyMember = async (req, res) => {
  try {
    const { name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index, faculty_id } = req.body;
    const mncDeptId = await getMNCDeptId(); if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    const result = await pool.query(
      `INSERT INTO mnc_faculty (mnc_dept_id, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [mncDeptId, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active || true, order_index || 0]
    );
    return sendResponse(res, StatusCodes.CREATED, true, 'Faculty member created', result.rows[0]);
  } catch (error) { console.error('Error creating faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating faculty member'); }
};

const updateMNCFacultyMember = async (req, res) => {
  try {
    const { id } = req.params; const fields = req.body; const setClauses = [];
    const params = []; let idx = 1; Object.keys(fields).forEach(k => { setClauses.push(`${k} = COALESCE($${idx}, ${k})`); params.push(fields[k]); idx++; });
    params.push(id);
    const q = `UPDATE mnc_faculty SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(q, params);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found');
    return sendResponse(res, StatusCodes.OK, true, 'Faculty member updated', result.rows[0]);
  } catch (error) { console.error('Error updating faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating faculty member'); }
};

const deleteMNCFacultyMember = async (req, res) => {
  try { const { id } = req.params; const existing = await pool.query(`SELECT photo_url FROM mnc_faculty WHERE id = $1`, [id]); if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found'); await deleteMinioFile(existing.rows[0].photo_url); await pool.query(`DELETE FROM mnc_faculty WHERE id = $1`, [id]); return sendResponse(res, StatusCodes.OK, true, 'Faculty member deleted'); } catch (error) { console.error('Error deleting faculty member:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting faculty member'); }
};

// Labs CRUD
const getMNCLabs = async (req, res) => {
  try { const { language = 'en' } = req.query; const mncDeptId = await getMNCDeptId(); if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found'); const result = await pool.query(`SELECT * FROM mnc_labs WHERE mnc_dept_id = $1 ORDER BY order_index ASC`, [mncDeptId]); const filtered = result.rows.map(r => filterByLanguage(r, language)); return sendResponse(res, StatusCodes.OK, true, 'Labs retrieved', filtered, result.rowCount); } catch (error) { console.error('Error fetching labs:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching labs'); }
};

const getMNCLabById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');

    const result = await pool.query(`SELECT * FROM mnc_labs WHERE id = $1 AND mnc_dept_id = $2`, [id, mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Lab retrieved', filtered);
  } catch (error) {
    console.error('Error fetching lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching lab');
  }
};

const createMNCLab = async (req, res) => {
  try {
    const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');
    if (!lab_name_en) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'lab_name_en is required');

    const result = await pool.query(
      `INSERT INTO mnc_labs (mnc_dept_id, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [mncDeptId, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Lab created', result.rows[0]);
  } catch (error) {
    console.error('Error creating lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating lab');
  }
};

const updateMNCLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body;

    if (lab_image_url) {
      const existing = await pool.query(`SELECT lab_image_url FROM mnc_labs WHERE id = $1`, [id]);
      if (existing.rowCount > 0 && existing.rows[0].lab_image_url && existing.rows[0].lab_image_url !== lab_image_url) {
        await deleteMinioFile(existing.rows[0].lab_image_url);
      }
    }

    const result = await pool.query(
      `UPDATE mnc_labs
       SET lab_name_en = COALESCE($1, lab_name_en),
           lab_name_hi = COALESCE($2, lab_name_hi),
           description_en = COALESCE($3, description_en),
           description_hi = COALESCE($4, description_hi),
           location = COALESCE($5, location),
           incharge_name = COALESCE($6, incharge_name),
           incharge_email = COALESCE($7, incharge_email),
           incharge_phone = COALESCE($8, incharge_phone),
           lab_image_url = COALESCE($9, lab_image_url),
           order_index = COALESCE($10, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index, id]
    );

    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');
    return sendResponse(res, StatusCodes.OK, true, 'Lab updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating lab');
  }
};

const deleteMNCLab = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(`SELECT lab_image_url FROM mnc_labs WHERE id = $1`, [id]);
    if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');

    await deleteMinioFile(existing.rows[0].lab_image_url);

    const result = await pool.query(`DELETE FROM mnc_labs WHERE id = $1 RETURNING id`, [id]);
    return sendResponse(res, StatusCodes.OK, true, 'Lab deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting lab');
  }
};

// Contact CRUD
const getMNCContact = async (req, res) => {
  try { const { language = 'en' } = req.query; const result = await pool.query(`SELECT * FROM mnc_contact WHERE mnc_dept_id = (SELECT id FROM mnc_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))`); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact not found'); const filtered = filterByLanguage(result.rows[0], language); return sendResponse(res, StatusCodes.OK, true, 'Contact retrieved', filtered); } catch (error) { console.error('Error fetching contact:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching contact'); }
};

const createMNCContact = async (req, res) => {
  try {
    const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body;
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found. Create MNC department info first.');

    const result = await pool.query(
      `INSERT INTO mnc_contact (mnc_dept_id, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [mncDeptId, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Contact info created', result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.code === '23505') return sendResponse(res, StatusCodes.CONFLICT, false, 'Contact info already exists');
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating contact');
  }
};

const updateMNCContact = async (req, res) => {
  try {
    const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body;

    const result = await pool.query(
      `UPDATE mnc_contact
       SET office_address_en = COALESCE($1, office_address_en),
           office_address_hi = COALESCE($2, office_address_hi),
           phone = COALESCE($3, phone),
           fax = COALESCE($4, fax),
           email = COALESCE($5, email),
           website_url = COALESCE($6, website_url),
           map_embed_url = COALESCE($7, map_embed_url),
           head_of_dept_name = COALESCE($8, head_of_dept_name),
           head_of_dept_email = COALESCE($9, head_of_dept_email),
           head_of_dept_phone = COALESCE($10, head_of_dept_phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE mnc_dept_id = (SELECT id FROM mnc_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc'))
       RETURNING *`,
      [office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]
    );

    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found');
    return sendResponse(res, StatusCodes.OK, true, 'Contact info updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating contact');
  }
};

const deleteMNCContact = async (req, res) => {
  try {
    const mncDeptId = await getMNCDeptId();
    if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');

    const result = await pool.query(`DELETE FROM mnc_contact WHERE mnc_dept_id = $1 RETURNING id`, [mncDeptId]);
    if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found');

    return sendResponse(res, StatusCodes.OK, true, 'Contact info deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting contact');
  }
};

const getMNCMedia = async (req, res) => {
  try { const result = await pool.query(`SELECT * FROM mnc_media WHERE mnc_dept_id = (SELECT id FROM mnc_department WHERE department_id = (SELECT id FROM department_master WHERE code = 'mnc')) ORDER BY created_at DESC`); return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', result.rows, result.rowCount); } catch (error) { console.error('Error fetching media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media'); }
};

const getMNCMediaById = async (req, res) => {
  try { const { id } = req.params; const result = await pool.query(`SELECT * FROM mnc_media WHERE id = $1`, [id]); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', result.rows[0]); } catch (error) { console.error('Error fetching media by id:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media'); }
};

const uploadMNCMedia = async (req, res) => {
  try {
    const { media_type, file_name, file_url, caption_en, caption_hi, category } = req.body;
    const mncDeptId = await getMNCDeptId(); if (!mncDeptId) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'MNC department setup not found');
    if (!file_url) return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'file_url is required');
    const result = await pool.query(`INSERT INTO mnc_media (mnc_dept_id, media_type, file_name, file_url, caption_en, caption_hi, category) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [mncDeptId, media_type, file_name, file_url, caption_en, caption_hi, category]);
    return sendResponse(res, StatusCodes.CREATED, true, 'Media uploaded', result.rows[0]);
  } catch (error) { console.error('Error uploading media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error uploading media'); }
};

const updateMNCMedia = async (req, res) => {
  try { const { id } = req.params; const fields = req.body; const setClauses = []; const params = []; let idx = 1; Object.keys(fields).forEach(k => { setClauses.push(`${k} = COALESCE($${idx}, ${k})`); params.push(fields[k]); idx++; }); params.push(id); const q = `UPDATE mnc_media SET ${setClauses.join(', ')}, created_at = COALESCE(created_at, CURRENT_TIMESTAMP) WHERE id = $${idx} RETURNING *`; const result = await pool.query(q, params); if (result.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); return sendResponse(res, StatusCodes.OK, true, 'Media updated', result.rows[0]); } catch (error) { console.error('Error updating media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating media'); }
};

const deleteMNCMedia = async (req, res) => {
  try { const { id } = req.params; const existing = await pool.query(`SELECT file_url FROM mnc_media WHERE id = $1`, [id]); if (existing.rowCount === 0) return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found'); await deleteMinioFile(existing.rows[0].file_url); await pool.query(`DELETE FROM mnc_media WHERE id = $1`, [id]); return sendResponse(res, StatusCodes.OK, true, 'Media deleted'); } catch (error) { console.error('Error deleting media:', error); return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting media'); }
};

module.exports = {
  getMNCDepartmentInfo,
  createMNCDepartmentInfo,
  updateMNCDepartmentInfo,
  deleteMNCDepartmentInfo,
  toggleMNCLanguage,
  getMNCProgrammes,
  getMNCProgrammeById,
  createMNCProgramme,
  updateMNCProgramme,
  deleteMNCProgramme,
  getMNCMissionVision,
  createMNCMissionVision,
  updateMNCMissionVision,
  deleteMNCMissionVision,
  getMNCResearchAreas,
  getMNCResearchAreaById,
  createMNCResearchArea,
  updateMNCResearchArea,
  deleteMNCResearchArea,
  getMNCPublications,
  getMNCPublicationById,
  createMNCPublication,
  updateMNCPublication,
  deleteMNCPublication,
  getMNCFaculty,
  getMNCFacultyMemberById,
  createMNCFacultyMember,
  updateMNCFacultyMember,
  deleteMNCFacultyMember,
  getMNCLabs,
  getMNCLabById,
  createMNCLab,
  updateMNCLab,
  deleteMNCLab,
  getMNCContact,
  createMNCContact,
  updateMNCContact,
  deleteMNCContact,
  getMNCMedia,
  getMNCMediaById,
  uploadMNCMedia,
  updateMNCMedia,
  deleteMNCMedia
};
