const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM admissions';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    await pool.query(`SELECT setval('admissions_id_seq', $1, true)`, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};



router.get('/admission', async (req, res) => {
  try {
    const query = 'SELECT * FROM admissions ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Admissions fetched successfully',
      data: {
        heading_en: result.rows[0]?.heading_en || '',
        heading_hi: result.rows[0]?.heading_hi || '',
        admissions: result.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message,
    });
  }
});





router.get('/admission/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID',
      });
    }

    const result = await pool.query(
      'SELECT * FROM admissions WHERE id = $1',
      [id]
    );

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
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message,
    });
  }
});


router.post('/admission/bulk/save', async (req, res) => {
  try {
    const { heading_en, heading_hi, admissions } = req.body;

    // Validate global heading
    if (!heading_en || !heading_hi) {
      return res.status(400).json({
        success: false,
        message: 'Heading EN/HI is required',
      });
    }

    if (!Array.isArray(admissions)) {
      return res.status(400).json({
        success: false,
        message: 'Admissions must be an array',
      });
    }

    if (admissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Admissions cannot be empty',
      });
    }

    // Validate each admission
    for (let a of admissions) {
      if (
        !a.title_en || !a.title_hi ||
        !a.description_en || !a.description_hi
      ) {
        return res.status(400).json({
          success: false,
          message: 'All title/description EN/HI fields are required',
        });
      }
    }

    // CLEAR OLD DATA
    await pool.query('DELETE FROM admissions');
    await pool.query(`SELECT setval('admissions_id_seq', 1, false)`);

    const insertQuery = `
      INSERT INTO admissions
      (
        heading_en,
        heading_hi,
        title_en,
        title_hi,
        description_en,
        description_hi
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const inserted = [];

    for (let a of admissions) {
      const result = await pool.query(insertQuery, [
        heading_en.trim(),
        heading_hi.trim(),
        a.title_en.trim(),
        a.title_hi.trim(),
        a.description_en.trim(),
        a.description_hi.trim(),
      ]);

      inserted.push(result.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: 'Admissions saved successfully',
      data: {
        heading_en,
        heading_hi,
        admissions: inserted,
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



router.delete('/admission/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID',
      });
    }

    const check = await pool.query(
      'SELECT * FROM admissions WHERE id = $1',
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    const deleted = check.rows[0];

    await pool.query('DELETE FROM admissions WHERE id = $1', [id]);

    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message,
    });
  }
});



module.exports = router;