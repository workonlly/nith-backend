const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/auth");

// POST /auth/faculty/login — verify credentials and issue JWT
router.post("/faculty/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Query faculties_table to verify if faculty exists
    const query = `
      SELECT id, name_en, email, password, status, tag, faculty_id, department_en, role_en, designation_en 
      FROM faculties_table 
      WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Faculty account not found."
      });
    }

    const faculty = result.rows[0];

    // Password verification
    if (faculty.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Issue JWT token with id, status, tag, and faculty details
    const payload = {
      id: faculty.id,
      faculty_id: faculty.faculty_id,
      email: faculty.email,
      name: faculty.name_en,
      status: faculty.status,
      tag: faculty.tag,
      department: faculty.department_en,
      designation: faculty.designation_en
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'nith_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      faculty: {
        id: faculty.id,
        faculty_id: faculty.faculty_id,
        name: faculty.name_en,
        email: faculty.email,
        status: faculty.status,
        tag: faculty.tag,
        department: faculty.department_en,
        designation: faculty.designation_en
      }
    });

  } catch (err) {
    console.error("Faculty login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
});

// GET /auth/faculty/verify — verify JWT token and confirm faculty still exists in DB
router.get("/faculty/verify", authenticateToken, async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware (contains id, email, status, tag, etc.)
    const { id } = req.user;

    // Cross-check that faculty still exists in faculties_table
    const result = await pool.query(
      `SELECT id, name_en, email, status, tag, faculty_id, department_en, designation_en
       FROM faculties_table
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Faculty account no longer exists."
      });
    }

    const faculty = result.rows[0];

    return res.status(200).json({
      success: true,
      message: "Token is valid. Faculty verified.",
      faculty: {
        id: faculty.id,
        faculty_id: faculty.faculty_id,
        name: faculty.name_en,
        email: faculty.email,
        status: faculty.status,
        tag: faculty.tag,
        department: faculty.department_en,
        designation: faculty.designation_en
      }
    });

  } catch (err) {
    console.error("Faculty verify error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during verification"
    });
  }
});

module.exports = router;