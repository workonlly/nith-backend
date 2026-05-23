const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM newss';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const resetQuery = `SELECT setval('newss_id_seq', $1, true)`;
    await pool.query(resetQuery, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};

// GET all newss
router.get('/news', async (req, res) => {
  try {
    const query = 'SELECT * FROM newss ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Newss fetched successfully',
      data: {
        newss: result.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching newss:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newss',
      error: error.message,
    });
  }
});

// GET single news by ID
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      });
    }

    const query = 'SELECT * FROM newss WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'News fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// CREATE new news
router.post('/news', async (req, res) => {
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
      'INSERT INTO newss (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
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
      message: 'News created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message,
    });
  }
});

// UPDATE news
router.put('/news/:id', async (req, res) => {
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
        message: 'Invalid news ID',
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

    // Check if news exists
    const checkQuery = 'SELECT id FROM newss WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    const query =
      'UPDATE newss SET title_en = $1, title_hi = $2, date = $3, description_en = $4, description_hi = $5, category_en = $6, category_hi = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
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
      message: 'News updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message,
    });
  }
});

// DELETE news
router.delete('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      });
    }

    // Check if news exists
    const checkQuery = 'SELECT * FROM newss WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    const deletedNews = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM newss WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Reset the sequence after deletion to maintain consecutive IDs
    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
      data: deletedNews,
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message,
    });
  }
});

// SAVE ALL newss (bulk update) - Prevents ID duplication
router.post('/news/bulk/save', async (req, res) => {
  try {
    const { newss } = req.body;

    if (!Array.isArray(newss)) {
      return res.status(400).json({
        success: false,
        message: 'Newss must be an array',
      });
    }

    if (newss.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Newss array cannot be empty',
      });
    }

    // Validation for each news
    for (let news of newss) {
      if (
        !news.title_en ||
        !news.title_hi ||
        !news.date ||
        !news.description_en ||
        !news.description_hi ||
        !news.category_en ||
        !news.category_hi
      ) {
        return res.status(400).json({
          success: false,
          message:
            'All news fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
        });
      }

      // Trim and validate
      const trimmedTitleEn = String(news.title_en).trim();
      const trimmedTitleHi = String(news.title_hi).trim();
      const trimmedDescriptionEn = String(news.description_en).trim();
      const trimmedDescriptionHi = String(news.description_hi).trim();
      const trimmedCategoryEn = String(news.category_en).trim();
      const trimmedCategoryHi = String(news.category_hi).trim();

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

      if (isNaN(Date.parse(news.date))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format',
        });
      }
    }

    // Delete all existing newss
    await pool.query('DELETE FROM newss');

    // Reset sequence to 0 before inserting new newss
    await pool.query(`SELECT setval('newss_id_seq', 1, false)`);

    // Insert new newss - IDs will be auto-assigned starting from 1
    const insertQuery =
      'INSERT INTO newss (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    const insertedNewss = [];
    for (let news of newss) {
      const trimmedTitleEn = String(news.title_en).trim();
      const trimmedTitleHi = String(news.title_hi).trim();
      const trimmedDescriptionEn = String(news.description_en).trim();
      const trimmedDescriptionHi = String(news.description_hi).trim();
      const trimmedCategoryEn = String(news.category_en).trim();
      const trimmedCategoryHi = String(news.category_hi).trim();

      const result = await pool.query(insertQuery, [
        trimmedTitleEn,
        trimmedTitleHi,
        news.date,
        trimmedDescriptionEn,
        trimmedDescriptionHi,
        trimmedCategoryEn,
        trimmedCategoryHi,
      ]);
      insertedNewss.push(result.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: 'All newss saved successfully',
      data: {
        newss: insertedNewss,
      },
    });
  } catch (error) {
    console.error('Error saving newss:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving newss',
      error: error.message,
    });
  }
});

module.exports = router;