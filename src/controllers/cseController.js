// src/controllers/cseController.js
// CSE Department Controller - CRUD operations for all CSE-related tables
// Handles: department info, programmes, faculty, labs, contact, mission, research areas, publications, media
// Bilingual support with language filtering (?language=en|hi|both)

const pool = require("../db/db");
const { StatusCodes } = require("http-status-codes");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../db/minio");

const CSE_MEDIA_BUCKET = "images";

const deleteMinioFile = async (fileUrl, bucketName = CSE_MEDIA_BUCKET) => {
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

const getCSEDeptId = async () => {
  const result = await pool.query(
    `SELECT cd.id FROM cse_department cd
     JOIN department_master dm ON cd.department_id = dm.id
     WHERE dm.code = 'cse'`
  );
  return result.rowCount > 0 ? result.rows[0].id : null;
};

/**
 * Helper: Get language-filtered response
 * Returns only the requested language fields or both
 */
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

/**
 * Helper: Standard API response format
 */
const sendResponse = (res, statusCode, success, message, data = null, count = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(statusCode).json(response);
};

// ──────────────────────────────────────────
// CSE DEPARTMENT MAIN PAGE CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse - Get CSE department main page (with language filter)
 * Query params: ?language=en|hi|both (default: en)
 */
const getCSEDepartmentInfo = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT cd.* FROM cse_department cd
       JOIN department_master dm ON cd.department_id = dm.id
       WHERE dm.code = 'cse'`
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department info not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'CSE info retrieved', filtered);
  } catch (error) {
    console.error('Error fetching CSE info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching CSE info');
  }
};

/**
 * POST /api/v1/departments/cse - Create CSE department main page (Admin)
 */
const createCSEDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url } = req.body;

    // Get CSE department ID
    const deptResult = await pool.query(
      `SELECT id FROM department_master WHERE code = 'cse'`
    );

    if (deptResult.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department master not found');
    }

    const department_id = deptResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO cse_department 
       (department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, default_language)
       VALUES ($1, $2, $3, $4, $5, $6, 'en')
       RETURNING *`,
      [department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'CSE info created', result.rows[0]);
  } catch (error) {
    console.error('Error creating CSE info:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'CSE info already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating CSE info');
  }
};

/**
 * PUT /api/v1/departments/cse - Update CSE department main page (Admin)
 */
const updateCSEDepartmentInfo = async (req, res) => {
  try {
    const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published } = req.body;

    if (dept_image_url) {
      const existing = await pool.query(
        `SELECT dept_image_url FROM cse_department
         WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse')`
      );
      if (existing.rowCount > 0 && existing.rows[0].dept_image_url && existing.rows[0].dept_image_url !== dept_image_url) {
        await deleteMinioFile(existing.rows[0].dept_image_url);
      }
    }

    const result = await pool.query(
      `UPDATE cse_department 
       SET intro_heading_en = COALESCE($1, intro_heading_en),
           intro_heading_hi = COALESCE($2, intro_heading_hi),
           intro_description_en = COALESCE($3, intro_description_en),
           intro_description_hi = COALESCE($4, intro_description_hi),
           dept_image_url = COALESCE($5, dept_image_url),
           is_published = COALESCE($6, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse')
       RETURNING *`,
      [intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE info not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'CSE info updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating CSE info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating CSE info');
  }
};

/**
 * DELETE /v1/departments/cse - Delete CSE department main page (Admin, cascades child tables)
 */
const deleteCSEDepartmentInfo = async (req, res) => {
  try {
    const existing = await pool.query(
      `SELECT dept_image_url FROM cse_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse')`
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE info not found');
    }

    await deleteMinioFile(existing.rows[0].dept_image_url);

    const result = await pool.query(
      `DELETE FROM cse_department
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse')
       RETURNING id`
    );

    return sendResponse(res, StatusCodes.OK, true, 'CSE info deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting CSE info:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting CSE info');
  }
};

/**
 * PUT /v1/departments/cse/language-toggle - Toggle department language (en <-> hi)
 */
const toggleCSELanguage = async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'hi'].includes(language)) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Language must be "en" or "hi"');
    }

    const result = await pool.query(
      `UPDATE cse_department 
       SET default_language = $1, updated_at = CURRENT_TIMESTAMP
       WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse')
       RETURNING default_language`,
      [language]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Language toggled successfully', {
      new_default_language: result.rows[0].default_language
    });
  } catch (error) {
    console.error('Error toggling language:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error toggling language');
  }
};

// ──────────────────────────────────────────
// CSE PROGRAMMES CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/programmes - List all CSE programmes
 */
const getCSEProgrammes = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_programmes 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       ORDER BY order_index ASC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Programmes retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programmes');
  }
};

/**
 * GET /v1/departments/cse/programmes/:id - Get single CSE programme by id
 */
const getCSEProgrammeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_programmes WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Programme retrieved', filtered);
  } catch (error) {
    console.error('Error fetching programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching programme');
  }
};

/**
 * POST /v1/departments/cse/programmes - Create CSE programme (Admin)
 */
const createCSEProgramme = async (req, res) => {
  try {
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!programme_type || !title_en) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'programme_type and title_en are required');
    }

    const result = await pool.query(
      `INSERT INTO cse_programmes 
       (cse_dept_id, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [cseDeptId, programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Programme created', result.rows[0]);
  } catch (error) {
    console.error('Error creating programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating programme');
  }
};

/**
 * PUT /api/v1/departments/cse/programmes/:id - Update CSE programme (Admin)
 */
const updateCSEProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { programme_type, title_en, title_hi, description_en, description_hi, duration_years, icon_emoji, order_index } = req.body;

    const result = await pool.query(
      `UPDATE cse_programmes 
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

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Programme updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating programme');
  }
};

/**
 * DELETE /api/v1/departments/cse/programmes/:id - Delete CSE programme (Admin)
 */
const deleteCSEProgramme = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM cse_programmes WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Programme not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Programme deleted');
  } catch (error) {
    console.error('Error deleting programme:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting programme');
  }
};

// ──────────────────────────────────────────
// CSE MISSION & VISION CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/mission-vision - Get CSE mission & vision (singleton)
 */
const getCSEMissionVision = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_mission_vision 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))`
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision retrieved', filtered);
  } catch (error) {
    console.error('Error fetching mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching mission & vision');
  }
};

/**
 * POST /api/v1/departments/cse/mission-vision - Create CSE mission & vision (Admin)
 */
const createCSEMissionVision = async (req, res) => {
  try {
    const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    const result = await pool.query(
      `INSERT INTO cse_mission_vision 
       (cse_dept_id, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [cseDeptId, mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Mission & Vision created', result.rows[0]);
  } catch (error) {
    console.error('Error creating mission & vision:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'Mission & Vision already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating mission & vision');
  }
};

/**
 * PUT /api/v1/departments/cse/mission-vision - Update CSE mission & vision (Admin)
 */
const updateCSEMissionVision = async (req, res) => {
  try {
    const { mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi } = req.body;

    const result = await pool.query(
      `UPDATE cse_mission_vision 
       SET mission_heading_en = COALESCE($1, mission_heading_en),
           mission_heading_hi = COALESCE($2, mission_heading_hi),
           mission_description_en = COALESCE($3, mission_description_en),
           mission_description_hi = COALESCE($4, mission_description_hi),
           mission_points_en = COALESCE($5, mission_points_en),
           mission_points_hi = COALESCE($6, mission_points_hi),
           updated_at = CURRENT_TIMESTAMP
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       RETURNING *`,
      [mission_heading_en, mission_heading_hi, mission_description_en, mission_description_hi, mission_points_en, mission_points_hi]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating mission & vision');
  }
};

/**
 * DELETE /v1/departments/cse/mission-vision - Delete CSE mission & vision (Admin)
 */
const deleteCSEMissionVision = async (req, res) => {
  try {
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `DELETE FROM cse_mission_vision WHERE cse_dept_id = $1 RETURNING id`,
      [cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Mission & Vision not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Mission & Vision deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting mission & vision:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting mission & vision');
  }
};

// ──────────────────────────────────────────
// CSE RESEARCH AREAS CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/research-areas - List all CSE research areas
 */
const getCSEResearchAreas = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_research_areas 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       ORDER BY order_index ASC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Research areas retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching research areas:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research areas');
  }
};

/**
 * GET /v1/departments/cse/research-areas/:id - Get single research area by id
 */
const getCSEResearchAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_research_areas WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Research area retrieved', filtered);
  } catch (error) {
    console.error('Error fetching research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching research area');
  }
};

/**
 * POST /v1/departments/cse/research-areas - Create research area (Admin)
 */
const createCSEResearchArea = async (req, res) => {
  try {
    const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!area_name_en) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'area_name_en is required');
    }

    const result = await pool.query(
      `INSERT INTO cse_research_areas 
       (cse_dept_id, area_name_en, area_name_hi, description_en, description_hi, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cseDeptId, area_name_en, area_name_hi, description_en, description_hi, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Research area created', result.rows[0]);
  } catch (error) {
    console.error('Error creating research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating research area');
  }
};

/**
 * PUT /api/v1/departments/cse/research-areas/:id - Update research area (Admin)
 */
const updateCSEResearchArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { area_name_en, area_name_hi, description_en, description_hi, order_index } = req.body;

    const result = await pool.query(
      `UPDATE cse_research_areas 
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

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Research area updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating research area');
  }
};

/**
 * DELETE /api/v1/departments/cse/research-areas/:id - Delete research area (Admin)
 */
const deleteCSEResearchArea = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM cse_research_areas WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Research area not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Research area deleted');
  } catch (error) {
    console.error('Error deleting research area:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting research area');
  }
};

// ──────────────────────────────────────────
// CSE PUBLICATIONS CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/publications - List all CSE publications
 */
const getCSEPublications = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_publications 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       ORDER BY published_at DESC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Publications retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publications');
  }
};

/**
 * GET /v1/departments/cse/publications/:id - Get single publication by id
 */
const getCSEPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_publications WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Publication retrieved', filtered);
  } catch (error) {
    console.error('Error fetching publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching publication');
  }
};

/**
 * POST /v1/departments/cse/publications - Create publication (Admin)
 */
const createCSEPublication = async (req, res) => {
  try {
    const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!title_en) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'title_en is required');
    }

    if (published_at && Number.isNaN(Date.parse(published_at))) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Invalid published_at date format');
    }

    const result = await pool.query(
      `INSERT INTO cse_publications 
       (cse_dept_id, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [cseDeptId, title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Publication created', result.rows[0]);
  } catch (error) {
    console.error('Error creating publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating publication');
  }
};

/**
 * PUT /api/v1/departments/cse/publications/:id - Update publication (Admin)
 */
const updateCSEPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_hi, authors, published_at, venue, url, abstract_en, abstract_hi } = req.body;

    const result = await pool.query(
      `UPDATE cse_publications 
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

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Publication updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating publication');
  }
};

/**
 * DELETE /api/v1/departments/cse/publications/:id - Delete publication (Admin)
 */
const deleteCSEPublication = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM cse_publications WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Publication not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Publication deleted');
  } catch (error) {
    console.error('Error deleting publication:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting publication');
  }
};

// ──────────────────────────────────────────
// CSE FACULTY CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/faculty - List all CSE faculty
 */
const getCSEFaculty = async (req, res) => {
  try {
    const { language = 'en', active_only = false } = req.query;

    let query = `SELECT * FROM cse_faculty 
                 WHERE cse_dept_id = (SELECT id FROM cse_department 
                                      WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))`;
    
    if (active_only === 'true') {
      query += ` AND is_active = true`;
    }

    query += ` ORDER BY order_index ASC`;

    const result = await pool.query(query);

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Faculty retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty');
  }
};

/**
 * GET /v1/departments/cse/faculty/:id - Get single faculty member by id
 */
const getCSEFacultyMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_faculty WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Faculty member retrieved', filtered);
  } catch (error) {
    console.error('Error fetching faculty member:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching faculty member');
  }
};

/**
 * POST /v1/departments/cse/faculty - Create faculty member (Admin)
 */
const createCSEFacultyMember = async (req, res) => {
  try {
    const { faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, order_index } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!name || !email) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'name and email are required');
    }

    const result = await pool.query(
      `INSERT INTO cse_faculty 
       (cse_dept_id, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [cseDeptId, faculty_id, name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Faculty member created', result.rows[0]);
  } catch (error) {
    console.error('Error creating faculty:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating faculty');
  }
};

/**
 * PUT /api/v1/departments/cse/faculty/:id - Update faculty member (Admin)
 */
const updateCSEFacultyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index } = req.body;

    if (photo_url) {
      const existing = await pool.query(
        `SELECT photo_url FROM cse_faculty WHERE id = $1`,
        [id]
      );
      if (existing.rowCount > 0 && existing.rows[0].photo_url && existing.rows[0].photo_url !== photo_url) {
        await deleteMinioFile(existing.rows[0].photo_url);
      }
    }

    const result = await pool.query(
      `UPDATE cse_faculty 
       SET name = COALESCE($1, name),
           position_en = COALESCE($2, position_en),
           position_hi = COALESCE($3, position_hi),
           email = COALESCE($4, email),
           phone = COALESCE($5, phone),
           photo_url = COALESCE($6, photo_url),
           bio_en = COALESCE($7, bio_en),
           bio_hi = COALESCE($8, bio_hi),
           specialization = COALESCE($9, specialization),
           is_active = COALESCE($10, is_active),
           order_index = COALESCE($11, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [name, position_en, position_hi, email, phone, photo_url, bio_en, bio_hi, specialization, is_active, order_index, id]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Faculty member updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating faculty:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating faculty');
  }
};

/**
 * DELETE /api/v1/departments/cse/faculty/:id - Delete faculty member (Admin)
 */
const deleteCSEFacultyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT photo_url FROM cse_faculty WHERE id = $1`,
      [id]
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Faculty member not found');
    }

    await deleteMinioFile(existing.rows[0].photo_url);

    const result = await pool.query(
      `DELETE FROM cse_faculty WHERE id = $1 RETURNING id`,
      [id]
    );

    return sendResponse(res, StatusCodes.OK, true, 'Faculty member deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting faculty');
  }
};

// ──────────────────────────────────────────
// CSE LABS CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/labs - List all CSE labs
 */
const getCSELabs = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_labs 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       ORDER BY order_index ASC`
    );

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Labs retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching labs:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching labs');
  }
};

/**
 * GET /v1/departments/cse/labs/:id - Get single lab by id
 */
const getCSELabById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_labs WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Lab retrieved', filtered);
  } catch (error) {
    console.error('Error fetching lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching lab');
  }
};

/**
 * POST /v1/departments/cse/labs - Create lab (Admin)
 */
const createCSELab = async (req, res) => {
  try {
    const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!lab_name_en) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'lab_name_en is required');
    }

    const result = await pool.query(
      `INSERT INTO cse_labs 
       (cse_dept_id, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [cseDeptId, lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index || 0]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Lab created', result.rows[0]);
  } catch (error) {
    console.error('Error creating lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating lab');
  }
};

/**
 * PUT /api/v1/departments/cse/labs/:id - Update lab (Admin)
 */
const updateCSELab = async (req, res) => {
  try {
    const { id } = req.params;
    const { lab_name_en, lab_name_hi, description_en, description_hi, location, incharge_name, incharge_email, incharge_phone, lab_image_url, order_index } = req.body;

    if (lab_image_url) {
      const existing = await pool.query(
        `SELECT lab_image_url FROM cse_labs WHERE id = $1`,
        [id]
      );
      if (existing.rowCount > 0 && existing.rows[0].lab_image_url && existing.rows[0].lab_image_url !== lab_image_url) {
        await deleteMinioFile(existing.rows[0].lab_image_url);
      }
    }

    const result = await pool.query(
      `UPDATE cse_labs 
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

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Lab updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating lab');
  }
};

/**
 * DELETE /api/v1/departments/cse/labs/:id - Delete lab (Admin)
 */
const deleteCSELab = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT lab_image_url FROM cse_labs WHERE id = $1`,
      [id]
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Lab not found');
    }

    await deleteMinioFile(existing.rows[0].lab_image_url);

    const result = await pool.query(
      `DELETE FROM cse_labs WHERE id = $1 RETURNING id`,
      [id]
    );

    return sendResponse(res, StatusCodes.OK, true, 'Lab deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting lab:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting lab');
  }
};

// ──────────────────────────────────────────
// CSE CONTACT CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/contact - Get CSE contact info (singleton)
 */
const getCSEContact = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const result = await pool.query(
      `SELECT * FROM cse_contact 
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))`
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Contact info retrieved', filtered);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching contact');
  }
};

/**
 * POST /api/v1/departments/cse/contact - Create contact info (Admin)
 */
const createCSEContact = async (req, res) => {
  try {
    const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    const result = await pool.query(
      `INSERT INTO cse_contact 
       (cse_dept_id, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [cseDeptId, office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Contact info created', result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'Contact info already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating contact');
  }
};

/**
 * PUT /api/v1/departments/cse/contact - Update contact info (Admin)
 */
const updateCSEContact = async (req, res) => {
  try {
    const { office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone } = req.body;

    const result = await pool.query(
      `UPDATE cse_contact 
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
       WHERE cse_dept_id = (SELECT id FROM cse_department 
                            WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))
       RETURNING *`,
      [office_address_en, office_address_hi, phone, fax, email, website_url, map_embed_url, head_of_dept_name, head_of_dept_email, head_of_dept_phone]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Contact info updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating contact');
  }
};

/**
 * DELETE /v1/departments/cse/contact - Delete CSE contact info (Admin)
 */
const deleteCSEContact = async (req, res) => {
  try {
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `DELETE FROM cse_contact WHERE cse_dept_id = $1 RETURNING id`,
      [cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact info not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Contact info deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting contact');
  }
};

// ──────────────────────────────────────────
// CSE MEDIA CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments/cse/media - List all CSE media
 */
const getCSEMedia = async (req, res) => {
  try {
    const { language = 'en', category } = req.query;

    let query = `SELECT * FROM cse_media 
                 WHERE cse_dept_id = (SELECT id FROM cse_department 
                                      WHERE department_id = (SELECT id FROM department_master WHERE code = 'cse'))`;
    
    let params = [];
    if (category) {
      query += ` AND category = $1`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    const filtered = result.rows.map(row => filterByLanguage(row, language));
    return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', filtered, result.rowCount);
  } catch (error) {
    console.error('Error fetching media:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media');
  }
};

/**
 * GET /v1/departments/cse/media/:id - Get single media item by id
 */
const getCSEMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found');
    }

    const result = await pool.query(
      `SELECT * FROM cse_media WHERE id = $1 AND cse_dept_id = $2`,
      [id, cseDeptId]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found');
    }

    const filtered = filterByLanguage(result.rows[0], language);
    return sendResponse(res, StatusCodes.OK, true, 'Media retrieved', filtered);
  } catch (error) {
    console.error('Error fetching media:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching media');
  }
};

/**
 * POST /v1/departments/cse/media - Upload media (Admin, expects MinIO URL in body)
 */
const uploadCSEMedia = async (req, res) => {
  try {
    const { media_type, file_name, file_url, caption_en, caption_hi, category } = req.body;
    const cseDeptId = await getCSEDeptId();

    if (!cseDeptId) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'CSE department setup not found. Create CSE department info first.');
    }

    if (!file_url) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'file_url is required (MinIO URL)');
    }

    const result = await pool.query(
      `INSERT INTO cse_media 
       (cse_dept_id, media_type, file_name, file_url, caption_en, caption_hi, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [cseDeptId, media_type || 'image', file_name, file_url, caption_en, caption_hi, category || 'general']
    );

    return sendResponse(res, StatusCodes.CREATED, true, 'Media uploaded', result.rows[0]);
  } catch (error) {
    console.error('Error uploading media:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error uploading media');
  }
};

/**
 * PUT /api/v1/departments/cse/media/:id - Update media caption (Admin)
 */
const updateCSEMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption_en, caption_hi, category } = req.body;

    const result = await pool.query(
      `UPDATE cse_media 
       SET caption_en = COALESCE($1, caption_en),
           caption_hi = COALESCE($2, caption_hi),
           category = COALESCE($3, category)
       WHERE id = $4
       RETURNING *`,
      [caption_en, caption_hi, category, id]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Media updated', result.rows[0]);
  } catch (error) {
    console.error('Error updating media:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating media');
  }
};

/**
 * DELETE /api/v1/departments/cse/media/:id - Delete media (Admin)
 */
const deleteCSEMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT file_url FROM cse_media WHERE id = $1`,
      [id]
    );

    if (existing.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found');
    }

    await deleteMinioFile(existing.rows[0].file_url);

    const result = await pool.query(
      `DELETE FROM cse_media WHERE id = $1 RETURNING id`,
      [id]
    );

    return sendResponse(res, StatusCodes.OK, true, 'Media deleted', { id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting media:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting media');
  }
};

// ──────────────────────────────────────────
// EXPORTS
// ──────────────────────────────────────────

module.exports = {
  // CSE Department Main Page
  getCSEDepartmentInfo,
  createCSEDepartmentInfo,
  updateCSEDepartmentInfo,
  deleteCSEDepartmentInfo,
  toggleCSELanguage,

  // CSE Programmes
  getCSEProgrammes,
  getCSEProgrammeById,
  createCSEProgramme,
  updateCSEProgramme,
  deleteCSEProgramme,

  // CSE Mission & Vision
  getCSEMissionVision,
  createCSEMissionVision,
  updateCSEMissionVision,
  deleteCSEMissionVision,

  // CSE Research Areas
  getCSEResearchAreas,
  getCSEResearchAreaById,
  createCSEResearchArea,
  updateCSEResearchArea,
  deleteCSEResearchArea,

  // CSE Publications
  getCSEPublications,
  getCSEPublicationById,
  createCSEPublication,
  updateCSEPublication,
  deleteCSEPublication,

  // CSE Faculty
  getCSEFaculty,
  getCSEFacultyMemberById,
  createCSEFacultyMember,
  updateCSEFacultyMember,
  deleteCSEFacultyMember,

  // CSE Labs
  getCSELabs,
  getCSELabById,
  createCSELab,
  updateCSELab,
  deleteCSELab,

  // CSE Contact
  getCSEContact,
  createCSEContact,
  updateCSEContact,
  deleteCSEContact,

  // CSE Media
  getCSEMedia,
  getCSEMediaById,
  uploadCSEMedia,
  updateCSEMedia,
  deleteCSEMedia,
};
