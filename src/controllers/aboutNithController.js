const db = require('../db/db');

// ===================== ABOUT NITH CRUD =====================

// GET all about-nith data
exports.getAllAboutNith = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM aboutnith ORDER BY id');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching about-nith data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about-nith data',
      error: error.message
    });
  }
};

// GET about-nith by ID
exports.getAboutNithById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'SELECT * FROM aboutnith WHERE id = $1', 
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No about-nith data found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching about-nith by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about-nith data',
      error: error.message
    });
  }
};

// CREATE about-nith
exports.createAboutNith = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const result = await db.query(
      'INSERT INTO aboutnith (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );

    res.status(201).json({
      success: true,
      message: 'About-nith data created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating about-nith:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create about-nith data',
      error: error.message
    });
  }
};

// UPDATE about-nith by ID
exports.updateAboutNith = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    // Check if record exists
    const checkResult = await db.query('SELECT * FROM aboutnith WHERE id = $1', [parseInt(id)]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No about-nith data found with ID: ${id}`
      });
    }

    const result = await db.query(
      'UPDATE aboutnith SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [title || null, description || null, parseInt(id)]
    );

    res.json({
      success: true,
      message: 'About-nith data updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating about-nith:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about-nith data',
      error: error.message
    });
  }
};

// DELETE about-nith by ID
exports.deleteAboutNith = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'DELETE FROM aboutnith WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No about-nith data found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'About-nith data deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting about-nith:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete about-nith data',
      error: error.message
    });
  }
};
