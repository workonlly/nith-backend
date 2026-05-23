const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // PostgreSQL connection pool

// Helper function to reset sequence
const resetSequence = async () => {
  try {
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM events';
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const resetQuery = `SELECT setval('events_id_seq', $1, true)`;
    await pool.query(resetQuery, [maxId]);
  } catch (error) {
    console.error('Error resetting sequence:', error);
  }
};

// GET all events
router.get('/event', async (req, res) => {
  try {
    const query = 'SELECT * FROM events ORDER BY id ASC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: {
        events: result.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// GET single event by ID
router.get('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
});

// CREATE new event
router.post('/event', async (req, res) => {
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
      'INSERT INTO events (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
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
      message: 'Event created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
});

// UPDATE event
router.put('/event/:id', async (req, res) => {
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
        message: 'Invalid event ID',
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

    // Check if event exists
    const checkQuery = 'SELECT id FROM events WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const query =
      'UPDATE events SET title_en = $1, title_hi = $2, date = $3, description_en = $4, description_hi = $5, category_en = $6, category_hi = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
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
      message: 'Event updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
});

// DELETE event
router.delete('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    // Check if event exists
    const checkQuery = 'SELECT * FROM events WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const deletedEvent = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM events WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Reset the sequence after deletion to maintain consecutive IDs
    await resetSequence();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

// SAVE ALL events (bulk update) - Prevents ID duplication
router.post('/event/bulk/save', async (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Events must be an array',
      });
    }

    if (events.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Events array cannot be empty',
      });
    }

    // Validation for each event
    for (let event of events) {
      if (
        !event.title_en ||
        !event.title_hi ||
        !event.date ||
        !event.description_en ||
        !event.description_hi ||
        !event.category_en ||
        !event.category_hi
      ) {
        return res.status(400).json({
          success: false,
          message:
            'All event fields are required (title_en, title_hi, date, description_en, description_hi, category_en, category_hi)',
        });
      }

      // Trim and validate
      const trimmedTitleEn = String(event.title_en).trim();
      const trimmedTitleHi = String(event.title_hi).trim();
      const trimmedDescriptionEn = String(event.description_en).trim();
      const trimmedDescriptionHi = String(event.description_hi).trim();
      const trimmedCategoryEn = String(event.category_en).trim();
      const trimmedCategoryHi = String(event.category_hi).trim();

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

      if (isNaN(Date.parse(event.date))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format',
        });
      }
    }

    // Delete all existing events
    await pool.query('DELETE FROM events');

    // Reset sequence to 0 before inserting new events
    await pool.query(`SELECT setval('events_id_seq', 1, false)`);

    // Insert new events - IDs will be auto-assigned starting from 1
    const insertQuery =
      'INSERT INTO events (title_en, title_hi, date, description_en, description_hi, category_en, category_hi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    const insertedEvents = [];
    for (let event of events) {
      const trimmedTitleEn = String(event.title_en).trim();
      const trimmedTitleHi = String(event.title_hi).trim();
      const trimmedDescriptionEn = String(event.description_en).trim();
      const trimmedDescriptionHi = String(event.description_hi).trim();
      const trimmedCategoryEn = String(event.category_en).trim();
      const trimmedCategoryHi = String(event.category_hi).trim();

      const result = await pool.query(insertQuery, [
        trimmedTitleEn,
        trimmedTitleHi,
        event.date,
        trimmedDescriptionEn,
        trimmedDescriptionHi,
        trimmedCategoryEn,
        trimmedCategoryHi,
      ]);
      insertedEvents.push(result.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: 'All events saved successfully',
      data: {
        events: insertedEvents,
      },
    });
  } catch (error) {
    console.error('Error saving events:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving events',
      error: error.message,
    });
  }
});

module.exports = router;