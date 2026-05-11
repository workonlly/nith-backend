const db = require('../db/db');

// ===================== CATEGORY CRUD =====================

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM category ORDER BY id');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// GET category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'SELECT * FROM category WHERE id = $1',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Category not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// CREATE category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const result = await db.query(
      'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'UPDATE category SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name || null, description || null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Category not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'DELETE FROM category WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Category not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// ===================== ROLE POSITION CRUD =====================

// GET all role positions
exports.getAllRolePositions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM role_position ORDER BY priority_number');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching role positions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role positions',
      error: error.message
    });
  }
};

// GET role position by ID
exports.getRolePositionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'SELECT * FROM role_position WHERE id = $1',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Role position not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching role position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role position',
      error: error.message
    });
  }
};

// CREATE role position
exports.createRolePosition = async (req, res) => {
  try {
    const { title, priority_number } = req.body;
    
    if (!title || priority_number === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title and priority_number are required'
      });
    }

    const result = await db.query(
      'INSERT INTO role_position (title, priority_number) VALUES ($1, $2) RETURNING *',
      [title, priority_number]
    );

    res.status(201).json({
      success: true,
      message: 'Role position created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating role position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role position',
      error: error.message
    });
  }
};

// UPDATE role position
exports.updateRolePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, priority_number } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'UPDATE role_position SET title = COALESCE($1, title), priority_number = COALESCE($2, priority_number) WHERE id = $3 RETURNING *',
      [title || null, priority_number || null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Role position not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Role position updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating role position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role position',
      error: error.message
    });
  }
};

// DELETE role position
exports.deleteRolePosition = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'DELETE FROM role_position WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Role position not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Role position deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting role position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role position',
      error: error.message
    });
  }
};

// ===================== FACULTY CRUD =====================

// GET all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faculty ORDER BY id');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty',
      error: error.message
    });
  }
};

// GET faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'SELECT * FROM faculty WHERE id = $1',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty',
      error: error.message
    });
  }
};

// CREATE faculty
exports.createFaculty = async (req, res) => {
  try {
    const { faculty_id, name, email, department } = req.body;
    
    if (!faculty_id || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID, name, and email are required'
      });
    }

    const result = await db.query(
      'INSERT INTO faculty (faculty_id, name, email, department) VALUES ($1, $2, $3, $4) RETURNING *',
      [faculty_id, name, email, department || null]
    );

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Faculty ID or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty',
      error: error.message
    });
  }
};

// UPDATE faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty_id, name, email, department } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'UPDATE faculty SET faculty_id = COALESCE($1, faculty_id), name = COALESCE($2, name), email = COALESCE($3, email), department = COALESCE($4, department) WHERE id = $5 RETURNING *',
      [faculty_id || null, name || null, email || null, department || null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Faculty updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Faculty ID or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty',
      error: error.message
    });
  }
};

// DELETE faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'DELETE FROM faculty WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Faculty deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty',
      error: error.message
    });
  }
};

// ===================== FACULTY ROLE ASSIGNMENT CRUD =====================

// GET all faculty role assignments
exports.getAllFacultyRoles = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        fra.id, fra.faculty_id, fra.position_id, fra.category_id,
        fra.start_date, fra.end_date, fra.role_email, fra.role_phone, fra.is_active,
        f.name as faculty_name, rp.title as position_title, c.name as category_name
      FROM faculty_role_assignment fra
      LEFT JOIN faculty f ON fra.faculty_id = f.id
      LEFT JOIN role_position rp ON fra.position_id = rp.id
      LEFT JOIN category c ON fra.category_id = c.id
      ORDER BY fra.id
    `);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching faculty roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty roles',
      error: error.message
    });
  }
};

// GET faculty role assignment by ID
exports.getFacultyRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      `SELECT 
        fra.id, fra.faculty_id, fra.position_id, fra.category_id,
        fra.start_date, fra.end_date, fra.role_email, fra.role_phone, fra.is_active,
        f.name as faculty_name, rp.title as position_title, c.name as category_name
      FROM faculty_role_assignment fra
      LEFT JOIN faculty f ON fra.faculty_id = f.id
      LEFT JOIN role_position rp ON fra.position_id = rp.id
      LEFT JOIN category c ON fra.category_id = c.id
      WHERE fra.id = $1`,
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty role assignment not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching faculty role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty role',
      error: error.message
    });
  }
};

// CREATE faculty role assignment
exports.createFacultyRole = async (req, res) => {
  try {
    const { faculty_id, position_id, category_id, start_date, end_date, role_email, role_phone, is_active } = req.body;
    
    if (!faculty_id || !position_id || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID, position ID, and category ID are required'
      });
    }

    const result = await db.query(
      `INSERT INTO faculty_role_assignment (faculty_id, position_id, category_id, start_date, end_date, role_email, role_phone, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [faculty_id, position_id, category_id, start_date || null, end_date || null, role_email || null, role_phone || null, is_active !== false]
    );

    res.status(201).json({
      success: true,
      message: 'Faculty role assignment created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating faculty role:', error);
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Invalid faculty ID, position ID, or category ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty role assignment',
      error: error.message
    });
  }
};

// UPDATE faculty role assignment
exports.updateFacultyRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty_id, position_id, category_id, start_date, end_date, role_email, role_phone, is_active } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      `UPDATE faculty_role_assignment 
       SET faculty_id = COALESCE($1, faculty_id), 
           position_id = COALESCE($2, position_id),
           category_id = COALESCE($3, category_id),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           role_email = COALESCE($6, role_email),
           role_phone = COALESCE($7, role_phone),
           is_active = COALESCE($8, is_active)
       WHERE id = $9 RETURNING *`,
      [faculty_id || null, position_id || null, category_id || null, start_date || null, end_date || null, role_email || null, role_phone || null, is_active !== undefined ? is_active : null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty role assignment not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Faculty role assignment updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating faculty role:', error);
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Invalid faculty ID, position ID, or category ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty role assignment',
      error: error.message
    });
  }
};

// DELETE faculty role assignment
exports.deleteFacultyRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid ID is required'
      });
    }

    const result = await db.query(
      'DELETE FROM faculty_role_assignment WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Faculty role assignment not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Faculty role assignment deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting faculty role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty role assignment',
      error: error.message
    });
  }
};
