const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM achievements';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const resetQuery = `SELECT setval('achievements_id_seq', $1, true)`;
    await pool.query(resetQuery, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};

// GET all achievements
router.get('/achievements', async (req, res) => {
  try {
    const query = 'SELECT * FROM achievements ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Achievements fetched successfully',
      data: result.rows, // Note: Returning rows directly to match previous format
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message,
    });
  }
});

// GET single achievement by ID
router.get('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID',
      });
    }

    const query = 'SELECT * FROM achievements WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement',
      error: error.message,
    });
  }
});

// CREATE new achievement
router.post('/achievements', async (req, res) => {
  try {
    const {
      tagline_en,
      tagline_hi,
      heading_en,
      heading_hi,
      description_en,
      description_hi,
      image,
    } = req.body;

    const query =
      'INSERT INTO achievements (tagline_en, tagline_hi, heading_en, heading_hi, description_en, description_hi, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      tagline_en || '',
      tagline_hi || '',
      heading_en || '',
      heading_hi || '',
      description_en || '',
      description_hi || '',
      image || '',
    ];

    const result = await pool.query(query, values);

    await resetSequence();

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating achievement',
      error: error.message,
    });
  }
});

// UPDATE single achievement
router.put('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tagline_en,
      tagline_hi,
      heading_en,
      heading_hi,
      description_en,
      description_hi,
      image,
    } = req.body;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID',
      });
    }

    // Check if exists
    const checkQuery = 'SELECT id FROM achievements WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    const query =
      'UPDATE achievements SET tagline_en = $1, tagline_hi = $2, heading_en = $3, heading_hi = $4, description_en = $5, description_hi = $6, image = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
    const values = [
      tagline_en || '',
      tagline_hi || '',
      heading_en || '',
      heading_hi || '',
      description_en || '',
      description_hi || '',
      image || '',
      id,
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating achievement',
      error: error.message,
    });
  }
});

// DELETE achievement
router.delete('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID',
      });
    }

    // Check if exists
    const checkQuery = 'SELECT * FROM achievements WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    const deletedItem = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM achievements WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
      data: deletedItem,
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
      error: error.message,
    });
  }
});

// BULK UPDATE (Replace all achievements)
router.put('/achievements', async (req, res) => {
  try {
    console.log('PUT ACHIEVEMENTS BODY:', req.body);

    const { achievements } = req.body;

    if (!Array.isArray(achievements)) {
      return res.status(400).json({
        success: false,
        error: 'Achievements must be an array',
      });
    }

    // DELETE OLD DATA
    await pool.query('DELETE FROM achievements');

    // Reset sequence
    await pool.query(`SELECT setval('achievements_id_seq', 1, false)`);

    const insertedAchievements = [];

    for (const item of achievements) {
      const {
        tagline_en,
        tagline_hi,
        heading_en,
        heading_hi,
        description_en,
        description_hi,
        image,
      } = item;

      const result = await pool.query(
        `INSERT INTO achievements (tagline_en, tagline_hi, heading_en, heading_hi, description_en, description_hi, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          tagline_en || '',
          tagline_hi || '',
          heading_en || '',
          heading_hi || '',
          description_en || '',
          description_hi || '',
          image || '',
        ]
      );

      insertedAchievements.push(result.rows[0]);
    }

    res.json({
      success: true,
      data: insertedAchievements,
    });
  } catch (err) {
    console.error('PUT /achievements bulk error:', err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;