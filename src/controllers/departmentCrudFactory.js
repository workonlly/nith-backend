const pool = require('../db/db');
const { StatusCodes } = require('http-status-codes');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../db/minio');

const DEFAULT_MEDIA_BUCKET = 'images';

const sendResponse = (res, statusCode, success, message, data = null, count = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(statusCode).json(response);
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

const deleteMinioFile = async (fileUrl, bucketName = DEFAULT_MEDIA_BUCKET) => {
  if (!fileUrl) return;
  try {
    const fileKey = decodeURIComponent(fileUrl.split('/').pop());
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
    );
  } catch (error) {
    console.error('[MinIO] Error deleting file:', error);
  }
};

const buildPlaceholders = (count, startIndex = 1) => Array.from({ length: count }, (_, index) => `$${index + startIndex}`).join(', ');

const buildSetClauses = (fields, startIndex = 1) => fields.map((field, index) => `${field} = COALESCE($${index + startIndex}, ${field})`).join(', ');

const createSingletonHandlers = ({ tableName, deptCode, displayName, imageColumn = 'dept_image_url' }) => {
  const getDepartmentInfo = async (req, res) => {
    try {
      const { language = 'en' } = req.query;
      const result = await pool.query(
        `SELECT dt.* FROM ${tableName} dt
         JOIN department_master dm ON dt.department_id = dm.id
         WHERE dm.code = $1`,
        [deptCode]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} department info not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, `${displayName} info retrieved`, filterByLanguage(result.rows[0], language));
    } catch (error) {
      console.error(`Error fetching ${displayName} info:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error fetching ${displayName} info`);
    }
  };

  const createDepartmentInfo = async (req, res) => {
    try {
      const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url } = req.body;

      const deptResult = await pool.query(
        `SELECT id FROM department_master WHERE code = $1`,
        [deptCode]
      );

      if (deptResult.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} department master not found`);
      }

      const result = await pool.query(
        `INSERT INTO ${tableName}
         (department_id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, ${imageColumn}, default_language)
         VALUES ($1, $2, $3, $4, $5, $6, 'en')
         RETURNING *`,
        [deptResult.rows[0].id, intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url]
      );

      return sendResponse(res, StatusCodes.CREATED, true, `${displayName} info created`, result.rows[0]);
    } catch (error) {
      console.error(`Error creating ${displayName} info:`, error);
      if (error.code === '23505') {
        return sendResponse(res, StatusCodes.CONFLICT, false, `${displayName} info already exists`);
      }
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error creating ${displayName} info`);
    }
  };

  const updateDepartmentInfo = async (req, res) => {
    try {
      const { intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published } = req.body;

      if (dept_image_url) {
        const existing = await pool.query(
          `SELECT ${imageColumn} FROM ${tableName}
           WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
          [deptCode]
        );
        if (existing.rowCount > 0 && existing.rows[0][imageColumn] && existing.rows[0][imageColumn] !== dept_image_url) {
          await deleteMinioFile(existing.rows[0][imageColumn]);
        }
      }

      const result = await pool.query(
        `UPDATE ${tableName}
         SET intro_heading_en = COALESCE($1, intro_heading_en),
             intro_heading_hi = COALESCE($2, intro_heading_hi),
             intro_description_en = COALESCE($3, intro_description_en),
             intro_description_hi = COALESCE($4, intro_description_hi),
             ${imageColumn} = COALESCE($5, ${imageColumn}),
             is_published = COALESCE($6, is_published),
             updated_at = CURRENT_TIMESTAMP
         WHERE department_id = (SELECT id FROM department_master WHERE code = $7)
         RETURNING *`,
        [intro_heading_en, intro_heading_hi, intro_description_en, intro_description_hi, dept_image_url, is_published, deptCode]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} info not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, `${displayName} info updated`, result.rows[0]);
    } catch (error) {
      console.error(`Error updating ${displayName} info:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error updating ${displayName} info`);
    }
  };

  const deleteDepartmentInfo = async (req, res) => {
    try {
      const existing = await pool.query(
        `SELECT ${imageColumn} FROM ${tableName}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
        [deptCode]
      );

      if (existing.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} info not found`);
      }

      await deleteMinioFile(existing.rows[0][imageColumn]);

      const result = await pool.query(
        `DELETE FROM ${tableName}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)
         RETURNING id`,
        [deptCode]
      );

      return sendResponse(res, StatusCodes.OK, true, `${displayName} info deleted`, { id: result.rows[0].id });
    } catch (error) {
      console.error(`Error deleting ${displayName} info:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error deleting ${displayName} info`);
    }
  };

  const toggleLanguage = async (req, res) => {
    try {
      const { language } = req.body;
      if (!['en', 'hi'].includes(language)) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Language must be "en" or "hi"');
      }

      const result = await pool.query(
        `UPDATE ${tableName}
         SET default_language = $1, updated_at = CURRENT_TIMESTAMP
         WHERE department_id = (SELECT id FROM department_master WHERE code = $2)
         RETURNING default_language`,
        [language, deptCode]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} department not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, 'Language toggled successfully', {
        new_default_language: result.rows[0].default_language,
      });
    } catch (error) {
      console.error('Error toggling language:', error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error toggling language');
    }
  };

  return {
    getDepartmentInfo,
    createDepartmentInfo,
    updateDepartmentInfo,
    deleteDepartmentInfo,
    toggleLanguage,
  };
};

const createListHandlers = ({ tableName, deptTableName, deptCode, displayName, singularName, deptForeignKey, orderBy = 'order_index ASC', trackedFileColumn = null }) => {
  const getAll = async (req, res) => {
    try {
      const { language = 'en' } = req.query;
      const result = await pool.query(
        `SELECT * FROM ${tableName}
         WHERE ${deptForeignKey} = (SELECT id FROM ${deptTableName}
                                   WHERE department_id = (SELECT id FROM department_master WHERE code = $1))
         ORDER BY ${orderBy}`,
        [deptCode]
      );
      const filtered = result.rows.map((row) => filterByLanguage(row, language));
      return sendResponse(res, StatusCodes.OK, true, `${displayName} retrieved`, filtered, result.rowCount);
    } catch (error) {
      console.error(`Error fetching ${displayName.toLowerCase()}:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error fetching ${displayName.toLowerCase()}`);
    }
  };

  const getById = async (req, res) => {
    try {
      const { id } = req.params;
      const { language = 'en' } = req.query;
      const deptIdResult = await pool.query(
        `SELECT id FROM ${deptTableName}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
        [deptCode]
      );

      if (deptIdResult.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} setup not found`);
      }

      const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1 AND ${deptForeignKey} = $2`,
        [id, deptIdResult.rows[0].id]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${singularName} not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, `${singularName} retrieved`, filterByLanguage(result.rows[0], language));
    } catch (error) {
      console.error(`Error fetching ${singularName.toLowerCase()}:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error fetching ${singularName.toLowerCase()}`);
    }
  };

  const createOne = async (req, res) => {
    try {
      const payload = req.body;
      const deptIdResult = await pool.query(
        `SELECT id FROM ${deptTableName}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
        [deptCode]
      );

      if (deptIdResult.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${displayName} setup not found. Create department info first.`);
      }

      const insertableKeys = Object.keys(payload);
      const columns = [deptForeignKey, ...insertableKeys];
      const values = [deptIdResult.rows[0].id, ...insertableKeys.map((key) => payload[key])];
      const placeholders = buildPlaceholders(columns.length);

      const result = await pool.query(
        `INSERT INTO ${tableName} (${columns.join(', ')})
         VALUES (${placeholders})
         RETURNING *`,
        values
      );

      return sendResponse(res, StatusCodes.CREATED, true, `${singularName} created`, result.rows[0]);
    } catch (error) {
      console.error(`Error creating ${singularName.toLowerCase()}:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error creating ${singularName.toLowerCase()}`);
    }
  };

  const updateOne = async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const fields = Object.keys(payload);

      if (fields.length === 0) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'No fields provided');
      }

      const setClauses = buildSetClauses(fields);
      const values = fields.map((key) => payload[key]);
      values.push(id);

      const result = await pool.query(
        `UPDATE ${tableName}
         SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${fields.length + 1}
         RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${singularName} not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, `${singularName} updated`, result.rows[0]);
    } catch (error) {
      console.error(`Error updating ${singularName.toLowerCase()}:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error updating ${singularName.toLowerCase()}`);
    }
  };

  const deleteOne = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`,
        [id]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, `${singularName} not found`);
      }

      return sendResponse(res, StatusCodes.OK, true, `${singularName} deleted`, { id: result.rows[0].id });
    } catch (error) {
      console.error(`Error deleting ${singularName.toLowerCase()}:`, error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, `Error deleting ${singularName.toLowerCase()}`);
    }
  };

  return {
    getAll,
    getById,
    createOne,
    updateOne,
    deleteOne,
  };
};

const createDepartmentController = ({ code, displayName, tablePrefix }) => {
  const departmentTable = `${tablePrefix}_department`;
  const programmesTable = `${tablePrefix}_programmes`;
  const facultyTable = `${tablePrefix}_faculty`;
  const labsTable = `${tablePrefix}_labs`;
  const publicationsTable = `${tablePrefix}_publications`;
  const contactTable = `${tablePrefix}_contact`;
  const mediaTable = `${tablePrefix}_media`;
  const deptForeignKey = `${tablePrefix}_dept_id`;

  const singleton = createSingletonHandlers({
    tableName: departmentTable,
    deptCode: code,
    displayName,
    imageColumn: 'dept_image_url',
  });

  const programme = createListHandlers({
    tableName: programmesTable,
    deptTableName: departmentTable,
    deptCode: code,
    displayName: 'Programmes',
    singularName: 'Programme',
    deptForeignKey,
    orderBy: 'order_index ASC',
  });

  const faculty = createListHandlers({
    tableName: facultyTable,
    deptTableName: departmentTable,
    deptCode: code,
    displayName: 'Faculty',
    singularName: 'Faculty member',
    deptForeignKey,
    orderBy: 'order_index ASC',
        trackedFileColumn: 'photo_url',
  });

  const labs = createListHandlers({
    tableName: labsTable,
    deptTableName: departmentTable,
    deptCode: code,
    displayName: 'Labs',
    singularName: 'Lab',
    deptForeignKey,
    orderBy: 'order_index ASC',
        trackedFileColumn: 'lab_image_url',
  });

  const publications = createListHandlers({
    tableName: publicationsTable,
    deptTableName: departmentTable,
    deptCode: code,
    displayName: 'Publications',
    singularName: 'Publication',
    deptForeignKey,
    orderBy: 'published_at DESC',
  });

  const media = createListHandlers({
    tableName: mediaTable,
    deptTableName: departmentTable,
    deptCode: code,
    displayName: 'Media',
    singularName: 'Media item',
    deptForeignKey,
    orderBy: 'created_at DESC',
        trackedFileColumn: 'file_url',
  });

  const getContact = async (req, res) => {
    try {
      const { language = 'en' } = req.query;
      const result = await pool.query(
        `SELECT * FROM ${contactTable}
         WHERE ${deptForeignKey} = (SELECT id FROM ${departmentTable}
                                   WHERE department_id = (SELECT id FROM department_master WHERE code = $1))`,
        [code]
      );

      if (result.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact not found');
      }

      return sendResponse(res, StatusCodes.OK, true, 'Contact retrieved', filterByLanguage(result.rows[0], language));
    } catch (error) {
      console.error('Error fetching contact:', error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching contact');
    }
  };

  const createContact = async (req, res) => {
    try {
      const payload = req.body;
      const deptIdResult = await pool.query(
        `SELECT id FROM ${departmentTable}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
        [code]
      );

      if (deptIdResult.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Contact setup not found. Create department info first.');
      }

      const fields = Object.keys(payload);
      const columns = [deptForeignKey, ...fields];
      const values = [deptIdResult.rows[0].id, ...fields.map((field) => payload[field])];
      const placeholders = buildPlaceholders(columns.length);

      const result = await pool.query(
        `INSERT INTO ${contactTable} (${columns.join(', ')})
         VALUES (${placeholders})
         RETURNING *`,
        values
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

  const updateContact = async (req, res) => {
    try {
      const payload = req.body;
      const fields = Object.keys(payload);
      if (fields.length === 0) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'No fields provided');
      }

      const setClauses = buildSetClauses(fields);
      const values = fields.map((field) => payload[field]);

      const result = await pool.query(
        `UPDATE ${contactTable}
         SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
         WHERE ${deptForeignKey} = (SELECT id FROM ${departmentTable}
                                   WHERE department_id = (SELECT id FROM department_master WHERE code = $${fields.length + 1}))
         RETURNING *`,
        [...values, code]
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

  const deleteContact = async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM ${contactTable}
         WHERE ${deptForeignKey} = (SELECT id FROM ${departmentTable}
                                   WHERE department_id = (SELECT id FROM department_master WHERE code = $1))
         RETURNING id`,
        [code]
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

  const createMedia = async (req, res) => {
    try {
      const payload = req.body;
      if (!payload.file_url) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'file_url is required');
      }
      const deptIdResult = await pool.query(
        `SELECT id FROM ${departmentTable}
         WHERE department_id = (SELECT id FROM department_master WHERE code = $1)`,
        [code]
      );
      if (deptIdResult.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media setup not found. Create department info first.');
      }

      const fields = Object.keys(payload);
      const columns = [deptForeignKey, ...fields];
      const values = [deptIdResult.rows[0].id, ...fields.map((field) => payload[field])];
      const placeholders = buildPlaceholders(columns.length);

      const result = await pool.query(
        `INSERT INTO ${mediaTable} (${columns.join(', ')})
         VALUES (${placeholders})
         RETURNING *`,
        values
      );

      return sendResponse(res, StatusCodes.CREATED, true, 'Media uploaded', result.rows[0]);
    } catch (error) {
      console.error('Error uploading media:', error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error uploading media');
    }
  };

  const updateMedia = async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const fields = Object.keys(payload);
      if (fields.length === 0) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'No fields provided');
      }

      const setClauses = buildSetClauses(fields);
      const values = fields.map((field) => payload[field]);
      values.push(id);

      const result = await pool.query(
        `UPDATE ${mediaTable}
         SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${fields.length + 1}
         RETURNING *`,
        values
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

  const deleteMedia = async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await pool.query(
        `SELECT file_url FROM ${mediaTable} WHERE id = $1`,
        [id]
      );
      if (existing.rowCount === 0) {
        return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Media not found');
      }
      await deleteMinioFile(existing.rows[0].file_url);
      const result = await pool.query(
        `DELETE FROM ${mediaTable} WHERE id = $1 RETURNING id`,
        [id]
      );
      return sendResponse(res, StatusCodes.OK, true, 'Media deleted', { id: result.rows[0].id });
    } catch (error) {
      console.error('Error deleting media:', error);
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting media');
    }
  };

  return {
    ...singleton,
    getProgrammes: programme.getAll,
    getProgrammeById: programme.getById,
    createProgramme: programme.createOne,
    updateProgramme: programme.updateOne,
    deleteProgramme: programme.deleteOne,
    getFaculty: faculty.getAll,
    getFacultyMemberById: faculty.getById,
    createFacultyMember: faculty.createOne,
    updateFacultyMember: faculty.updateOne,
    deleteFacultyMember: faculty.deleteOne,
    getLabs: labs.getAll,
    getLabById: labs.getById,
    createLab: labs.createOne,
    updateLab: labs.updateOne,
    deleteLab: labs.deleteOne,
    getPublications: publications.getAll,
    getPublicationById: publications.getById,
    createPublication: publications.createOne,
    updatePublication: publications.updateOne,
    deletePublication: publications.deleteOne,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    getMedia: media.getAll,
    getMediaById: media.getById,
    createMedia,
    updateMedia,
    deleteMedia,
  };
};

module.exports = {
  createDepartmentController,
};
