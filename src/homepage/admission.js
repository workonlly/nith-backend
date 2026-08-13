const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM admissions';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const resetQuery = `SELECT setval('admissions_id_seq', $1, true)`;
    await pool.query(resetQuery, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};

// GET all admissions
router.get('/admission', async (req, res) => {
  try {
    const query = 'SELECT * FROM admissions ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Admissions fetched successfully',
      data: {
        admissions: result.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message,
    });
  }
});

// GET single admission by ID
router.get('/admission/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID',
      });
    }

    const query = 'SELECT * FROM admissions WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admission fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message,
    });
  }
});

// CREATE new admission
router.post('/admission', async (req, res) => {
  try {
    const {
      title_en,
      title_hi,
      date,
      description_en,
      description_hi,
      category_en,
      category_hi,
    } = req.body;

    // Validation
    if (
      !title_en ||
      !title_hi ||
      !date ||
      !description_en ||
      !description_hi ||
      !category_en ||
      !category_hi
    ) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
      });
    }

    // Trim whitespace
    const trimmedTitleEn = String(title_en).trim();
    const trimmedTitleHi = String(title_hi).trim();
    const trimmedDescriptionEn = String(description_en).trim();
    const trimmedDescriptionHi = String(description_hi).trim();
    const trimmedCategoryEn = String(category_en).trim();
    const trimmedCategoryHi = String(category_hi).trim();

    if (
      !trimmedTitleEn ||
      !trimmedTitleHi ||
      !trimmedDescriptionEn ||
      !trimmedDescriptionHi ||
      !trimmedCategoryEn ||
      !trimmedCategoryHi
    ) {
      return res.status(400).json({
        success: false,
        message: 'Fields cannot be empty or whitespace only',
      });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format',
      });
    }

    const query =
      'INSERT INTO admissions (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      trimmedTitleEn,
      trimmedTitleHi,
      date,
      trimmedDescriptionEn,
      trimmedDescriptionHi,
      trimmedCategoryEn,
      trimmedCategoryHi,
    ];

    const result = await pool.query(query, values);

    // Reset the sequence to ensure proper ID sequence
    await resetSequence();

    res.status(201).json({
      success: true,
      message: 'Admission created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admission',
      error: error.message,
    });
  }
});

// UPDATE admission
router.put('/admission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_en,
      title_hi,
      date,
      description_en,
      description_hi,
      category_en,
      category_hi,
    } = req.body;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID',
      });
    }

    // Validation
    if (
      !title_en ||
      !title_hi ||
      !date ||
      !description_en ||
      !description_hi ||
      !category_en ||
      !category_hi
    ) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
      });
    }

    // Trim whitespace
    const trimmedTitleEn = String(title_en).trim();
    const trimmedTitleHi = String(title_hi).trim();
    const trimmedDescriptionEn = String(description_en).trim();
    const trimmedDescriptionHi = String(description_hi).trim();
    const trimmedCategoryEn = String(category_en).trim();
    const trimmedCategoryHi = String(category_hi).trim();

    if (
      !trimmedTitleEn ||
      !trimmedTitleHi ||
      !trimmedDescriptionEn ||
      !trimmedDescriptionHi ||
      !trimmedCategoryEn ||
      !trimmedCategoryHi
    ) {
      return res.status(400).json({
        success: false,
        message: 'Fields cannot be empty or whitespace only',
      });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format',
      });
    }

    // Check if admission exists
    const checkQuery = 'SELECT id FROM admissions WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    const query =
      'UPDATE admissions SET title_en = $1, title_hi = $2, date = $3, description_en = $4, description_hi = $5, category_en = $6, category_hi = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
    const values = [
      trimmedTitleEn,
      trimmedTitleHi,
      date,
      trimmedDescriptionEn,
      trimmedDescriptionHi,
      trimmedCategoryEn,
      trimmedCategoryHi,
      id,
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Admission updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admission',
      error: error.message,
    });
  }
});

// DELETE admission
router.delete('/admission/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID',
      });
    }

    // Check if admission exists
    const checkQuery = 'SELECT * FROM admissions WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    const deletedAdmission = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM admissions WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Reset the sequence after deletion to maintain consecutive IDs
    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully',
      data: deletedAdmission,
    });
  } catch (error) {
    console.error('Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message,
    });
  }
});

// SAVE ALL admissions (bulk update) - Prevents ID duplication
router.post('/admission/bulk/save', async (req, res) => {
  try {
    const { admissions } = req.body;

    if (!Array.isArray(admissions)) {
      return res.status(400).json({
        success: false,
        message: 'Admissions must be an array',
      });
    }

    if (admissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Admissions array cannot be empty',
      });
    }

    // Validation for each admission
    for (let admission of admissions) {
      if (
        !admission.title_en ||
        !admission.title_hi ||
        !admission.date ||
        !admission.description_en ||
        !admission.description_hi ||
        !admission.category_en ||
        !admission.category_hi
      ) {
        return res.status(400).json({
          success: false,
          message:
            'All admission fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
        });
      }

      // Trim and validate
      const trimmedTitleEn = String(admission.title_en).trim();
      const trimmedTitleHi = String(admission.title_hi).trim();
      const trimmedDescriptionEn = String(admission.description_en).trim();
      const trimmedDescriptionHi = String(admission.description_hi).trim();
      const trimmedCategoryEn = String(admission.category_en).trim();
      const trimmedCategoryHi = String(admission.category_hi).trim();

      if (
        !trimmedTitleEn ||
        !trimmedTitleHi ||
        !trimmedDescriptionEn ||
        !trimmedDescriptionHi ||
        !trimmedCategoryEn ||
        !trimmedCategoryHi
      ) {
        return res.status(400).json({
          success: false,
          message: 'Fields cannot be empty or whitespace only',
        });
      }

      if (isNaN(Date.parse(admission.date))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format',
        });
      }
    }

    // Delete all existing admissions
    await pool.query('DELETE FROM admissions');

    // Reset sequence to 0 before inserting new admissions
    await pool.query(`SELECT setval('admissions_id_seq', 1, false)`);

    // Insert new admissions - IDs will be auto-assigned starting from 1
    const insertQuery =
      'INSERT INTO admissions (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    const insertedAdmissions = [];
    for (let admission of admissions) {
      const trimmedTitleEn = String(admission.title_en).trim();
      const trimmedTitleHi = String(admission.title_hi).trim();
      const trimmedDescriptionEn = String(admission.description_en).trim();
      const trimmedDescriptionHi = String(admission.description_hi).trim();
      const trimmedCategoryEn = String(admission.category_en).trim();
      const trimmedCategoryHi = String(admission.category_hi).trim();

      const result = await pool.query(insertQuery, [
        trimmedTitleEn,
        trimmedTitleHi,
        admission.date,
        trimmedDescriptionEn,
        trimmedDescriptionHi,
        trimmedCategoryEn,
        trimmedCategoryHi,
      ]);
      insertedAdmissions.push(result.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: 'All admissions saved successfully',
      data: {
        admissions: insertedAdmissions,
      },
    });
  } catch (error) {
    console.error('Error saving admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving admissions',
      error: error.message,
    });
  }
});

module.exports = router;