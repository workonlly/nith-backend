// src/controllers/departmentController.js
// Master Department Controller - CRUD operations for department_master table only
// Handles: Department creation, reading, updating, deleting
// For CSE-specific operations, see cseController.js; for MNE, see mneController.js, etc.

const pool = require("../db/db");
const { StatusCodes } = require("http-status-codes");

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
// DEPARTMENT MASTER CRUD
// ──────────────────────────────────────────

/**
 * GET /api/v1/departments - List all departments
 */
const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM department_master ORDER BY created_at DESC`
    );
    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      'Departments retrieved successfully',
      result.rows,
      result.rowCount
    );
  } catch (error) {
    console.error('Error fetching departments:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching departments', null);
  }
};

/**
 * GET /api/v1/departments/:deptCode - Get single department by code
 */
const getDepartmentByCode = async (req, res) => {
  try {
    const { deptCode } = req.params;
    const result = await pool.query(
      `SELECT * FROM department_master WHERE code = $1`,
      [deptCode]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Department not found');
    }

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      'Department retrieved successfully',
      result.rows[0]
    );
  } catch (error) {
    console.error('Error fetching department:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error fetching department');
  }
};

/**
 * POST /api/v1/departments - Create new department (Admin)
 */
const createDepartment = async (req, res) => {
  try {
    const { code, name_en, name_hi, slug, description_short_en, description_short_hi } = req.body;

    if (!code || !name_en) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'Code and name_en are required');
    }

    const result = await pool.query(
      `INSERT INTO department_master 
       (code, name_en, name_hi, slug, description_short_en, description_short_hi, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [code, name_en, name_hi, slug || code.toLowerCase(), description_short_en, description_short_hi]
    );

    return sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      'Department created successfully',
      result.rows[0]
    );
  } catch (error) {
    console.error('Error creating department:', error);
    if (error.code === '23505') {
      return sendResponse(res, StatusCodes.CONFLICT, false, 'Department code already exists');
    }
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error creating department');
  }
};

/**
 * PUT /api/v1/departments/:deptCode - Update department (Admin)
 */
const updateDepartment = async (req, res) => {
  try {
    const { deptCode } = req.params;
    const { name_en, name_hi, slug, description_short_en, description_short_hi, is_active } = req.body;

    const result = await pool.query(
      `UPDATE department_master 
       SET name_en = COALESCE($1, name_en),
           name_hi = COALESCE($2, name_hi),
           slug = COALESCE($3, slug),
           description_short_en = COALESCE($4, description_short_en),
           description_short_hi = COALESCE($5, description_short_hi),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE code = $7
       RETURNING *`,
      [name_en, name_hi, slug, description_short_en, description_short_hi, is_active, deptCode]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Department not found');
    }

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      'Department updated successfully',
      result.rows[0]
    );
  } catch (error) {
    console.error('Error updating department:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error updating department');
  }
};

/**
 * DELETE /api/v1/departments/:deptCode - Delete department (Admin)
 */
const deleteDepartment = async (req, res) => {
  try {
    const { deptCode } = req.params;

    const result = await pool.query(
      `DELETE FROM department_master WHERE code = $1 RETURNING id`,
      [deptCode]
    );

    if (result.rowCount === 0) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, 'Department not found');
    }

    return sendResponse(res, StatusCodes.OK, true, 'Department deleted successfully');
  } catch (error) {
    console.error('Error deleting department:', error);
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, 'Error deleting department');
  }
};

// ──────────────────────────────────────────
// EXPORTS
// ──────────────────────────────────────────

module.exports = {
  // Department Master
  getAllDepartments,
  getDepartmentByCode,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};