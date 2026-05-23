const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM academics';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const resetQuery = `SELECT setval('academics_id_seq', $1, true)`;
    await pool.query(resetQuery, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};

// GET all academics
router.get('/academic', async (req, res) => {
  try {
    const query = 'SELECT * FROM academics ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Academics fetched successfully',
      data: {
        academics: result.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching academics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academics',
      error: error.message,
    });
  }
});

// GET single academic by ID
router.get('/academic/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid academic ID',
      });
    }

    const query = 'SELECT * FROM academics WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Academic not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Academic fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching academic:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academic',
      error: error.message,
    });
  }
});

// CREATE new academic
router.post('/academic', async (req, res) => {
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
      'INSERT INTO academics (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
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
      message: 'Academic created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating academic:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating academic',
      error: error.message,
    });
  }
});

// UPDATE academic
router.put('/academic/:id', async (req, res) => {
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
        message: 'Invalid academic ID',
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

    // Check if academic exists
    const checkQuery = 'SELECT id FROM academics WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Academic not found',
      });
    }

    const query =
      'UPDATE academics SET title_en = $1, title_hi = $2, date = $3, description_en = $4, description_hi = $5, category_en = $6, category_hi = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
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
      message: 'Academic updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating academic:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating academic',
      error: error.message,
    });
  }
});

// DELETE academic
router.delete('/academic/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid academic ID',
      });
    }

    // Check if academic exists
    const checkQuery = 'SELECT * FROM academics WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Academic not found',
      });
    }

    const deletedAcademic = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM academics WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Reset the sequence after deletion to maintain consecutive IDs
    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'Academic deleted successfully',
      data: deletedAcademic,
    });
  } catch (error) {
    console.error('Error deleting academic:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting academic',
      error: error.message,
    });
  }
});

// SAVE ALL academics (bulk update) - Pracademics ID duplication
router.post('/academic/bulk/save', async (req, res) => {
  try {
    const { academics } = req.body;

    if (!Array.isArray(academics)) {
      return res.status(400).json({
        success: false,
        message: 'Academics must be an array',
      });
    }

    if (academics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Academics array cannot be empty',
      });
    }

    // Validation for each academic
    for (let academic of academics) {
      if (
        !academic.title_en ||
        !academic.title_hi ||
        !academic.date ||
        !academic.description_en ||
        !academic.description_hi ||
        !academic.category_en ||
        !academic.category_hi
      ) {
        return res.status(400).json({
          success: false,
          message:
            'All academic fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
        });
      }

      // Trim and validate
      const trimmedTitleEn = String(academic.title_en).trim();
      const trimmedTitleHi = String(academic.title_hi).trim();
      const trimmedDescriptionEn = String(academic.description_en).trim();
      const trimmedDescriptionHi = String(academic.description_hi).trim();
      const trimmedCategoryEn = String(academic.category_en).trim();
      const trimmedCategoryHi = String(academic.category_hi).trim();

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

      if (isNaN(Date.parse(academic.date))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format',
        });
      }
    }

    // Delete all existing academics
    await pool.query('DELETE FROM academics');

    // Reset sequence to 0 before inserting new academics
    await pool.query(`SELECT setval('academics_id_seq', 1, false)`);

    // Insert new academics - IDs will be auto-assigned starting from 1
    const insertQuery =
      'INSERT INTO academics (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    const insertedAcademics = [];
    for (let academic of academics) {
      const trimmedTitleEn = String(academic.title_en).trim();
      const trimmedTitleHi = String(academic.title_hi).trim();
      const trimmedDescriptionEn = String(academic.description_en).trim();
      const trimmedDescriptionHi = String(academic.description_hi).trim();
      const trimmedCategoryEn = String(academic.category_en).trim();
      const trimmedCategoryHi = String(academic.category_hi).trim();

      const result = await pool.query(insertQuery, [
        trimmedTitleEn,
        trimmedTitleHi,
        academic.date,
        trimmedDescriptionEn,
        trimmedDescriptionHi,
        trimmedCategoryEn,
        trimmedCategoryHi,
      ]);
      insertedAcademics.push(result.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: 'All academics saved successfully',
      data: {
        academics: insertedAcademics,
      },
    });
  } catch (error) {
    console.error('Error saving academics:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving academics',
      error: error.message,
    });
  }
});

module.exports = router;