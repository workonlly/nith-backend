const db = require('../db/db');

// ===================== CHAIRPERSON CRUD =====================
exports.getChairperson = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM chairperson ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateChairperson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, description, dates, image } = req.body;
    
    // Use UPSERT for singleton-like page
    const result = await db.query(`
      INSERT INTO chairperson (id, title, name, description, dates, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        dates = EXCLUDED.dates,
        image = EXCLUDED.image
      RETURNING *
    `, [id || 1, title, name, description, dates, image]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DEANS CRUD =====================
exports.getAllDeans = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_dean ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDean = async (req, res) => {
  try {
    const { title, name, responsibility, email, phone, category } = req.body;
    const result = await db.query(
      'INSERT INTO administration_dean (title, name, responsibility, email, phone, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, name, responsibility, email, phone, category || 'Dean']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDean = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, responsibility, email, phone, category } = req.body;
    const result = await db.query(
      'UPDATE administration_dean SET title = $1, name = $2, responsibility = $3, email = $4, phone = $5, category = $6 WHERE id = $7 RETURNING *',
      [title, name, responsibility, email, phone, category, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDean = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_dean WHERE id = $1', [id]);
    res.json({ success: true, message: 'Dean deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== VIGILANCE OFFICER CRUD =====================
exports.getVigilanceOfficers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_vigilance ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVigilanceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, responsibility, email, phone } = req.body;
    const result = await db.query(
      'UPDATE administration_vigilance SET name = $1, responsibility = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *',
      [name, responsibility, email, phone, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVigilanceOfficer = async (req, res) => {
  try {
    const { name, responsibility, email, phone } = req.body;
    const result = await db.query(
      'INSERT INTO administration_vigilance (name, responsibility, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, responsibility, email, phone]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVigilanceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_vigilance WHERE id = $1', [id]);
    res.json({ success: true, message: 'Officer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DIRECTOR CRUD =====================
exports.getDirectorInfo = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_director LIMIT 1');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDirectorInfo = async (req, res) => {
  try {
    const { hero_heading, hero_subheading, current_name, current_designation, message_heading, message_paragraphs, message_closing, message_signature_title, message_signature_org, message_signature_location } = req.body;
    
    // UPSERT pattern
    const result = await db.query(`
      INSERT INTO administration_director (id, hero_heading, hero_subheading, current_name, current_designation, message_heading, message_paragraphs, message_closing, message_signature_title, message_signature_org, message_signature_location)
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        hero_heading = EXCLUDED.hero_heading,
        hero_subheading = EXCLUDED.hero_subheading,
        current_name = EXCLUDED.current_name,
        current_designation = EXCLUDED.current_designation,
        message_heading = EXCLUDED.message_heading,
        message_paragraphs = EXCLUDED.message_paragraphs,
        message_closing = EXCLUDED.message_closing,
        message_signature_title = EXCLUDED.message_signature_title,
        message_signature_org = EXCLUDED.message_signature_org,
        message_signature_location = EXCLUDED.message_signature_location
      RETURNING *
    `, [hero_heading, hero_subheading, current_name, current_designation, message_heading, message_paragraphs, message_closing, message_signature_title, message_signature_org, message_signature_location]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== FORMER DIRECTORS CRUD =====================
exports.getAllFormerDirectors = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_former_directors ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFormerDirector = async (req, res) => {
  try {
    const { name, tenure, type } = req.body;
    const result = await db.query(
      'INSERT INTO administration_former_directors (name, tenure, type) VALUES ($1, $2, $3) RETURNING *',
      [name, tenure, type]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFormerDirector = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_former_directors WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DIRECTOR OFFICE STAFF CRUD =====================
exports.getOfficeStaff = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_director_office ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOfficeStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, phone, email, is_director } = req.body;
    const result = await db.query(
      'UPDATE administration_director_office SET name = $1, designation = $2, phone = $3, email = $4, is_director = $5 WHERE id = $6 RETURNING *',
      [name, designation, phone, email, is_director, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOfficeStaff = async (req, res) => {
  try {
    const { name, designation, phone, email, is_director } = req.body;
    const result = await db.query(
      'INSERT INTO administration_director_office (name, designation, phone, email, is_director) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, designation, phone, email, is_director]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOfficeStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_director_office WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== FACULTY INCHARGES CRUD =====================
exports.getAllFacultyIncharges = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_faculty_incharges ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFacultyIncharge = async (req, res) => {
  try {
    const { name, department, responsibility, email } = req.body;
    const result = await db.query(
      'INSERT INTO administration_faculty_incharges (name, department, responsibility, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, department, responsibility, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFacultyIncharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, responsibility, email } = req.body;
    const result = await db.query(
      'UPDATE administration_faculty_incharges SET name = $1, department = $2, responsibility = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, department, responsibility, email, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFacultyIncharge = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_faculty_incharges WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== HOD CRUD =====================
exports.getAllHODs = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_hod ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHOD = async (req, res) => {
  try {
    const { name, designation, department, phone, email } = req.body;
    const result = await db.query(
      'INSERT INTO administration_hod (name, designation, department, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, designation, department, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHOD = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, phone, email } = req.body;
    const result = await db.query(
      'UPDATE administration_hod SET name = $1, designation = $2, department = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *',
      [name, designation, department, phone, email, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHOD = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_hod WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== INSTITUTE COORDINATORS CRUD =====================
exports.getInstituteCoordinatorsInfo = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_institute_coordinators_info LIMIT 1');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInstituteCoordinatorsInfo = async (req, res) => {
  try {
    const { hero_heading, hero_subheading } = req.body;
    const result = await db.query(`
      INSERT INTO administration_institute_coordinators_info (id, hero_heading, hero_subheading)
      VALUES (1, $1, $2)
      ON CONFLICT (id) DO UPDATE SET
        hero_heading = EXCLUDED.hero_heading,
        hero_subheading = EXCLUDED.hero_subheading
      RETURNING *
    `, [hero_heading, hero_subheading]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllInstituteCoordinators = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_institute_coordinators ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInstituteCoordinator = async (req, res) => {
  try {
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'INSERT INTO administration_institute_coordinators (name, responsibility, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, responsibility, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInstituteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'UPDATE administration_institute_coordinators SET name = $1, responsibility = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, responsibility, phone, email, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInstituteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_institute_coordinators WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== NODAL OFFICERS CRUD =====================
exports.getAllNodalOfficers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_nodal_officers ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNodalOfficer = async (req, res) => {
  try {
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'INSERT INTO administration_nodal_officers (name, responsibility, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, responsibility, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNodalOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'UPDATE administration_nodal_officers SET name = $1, responsibility = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, responsibility, phone, email, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNodalOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_nodal_officers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== REGISTRAR CRUD =====================
exports.getRegistrar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_registrar LIMIT 1');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.upsertRegistrar = async (req, res) => {
  try {
    const { name, image, email, phone, profile_summary_en, profile_summary_hi } = req.body;
    const result = await db.query(`
      INSERT INTO administration_registrar (id, name, image, email, phone, profile_summary_en, profile_summary_hi)
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        profile_summary_en = EXCLUDED.profile_summary_en,
        profile_summary_hi = EXCLUDED.profile_summary_hi
      RETURNING *
    `, [name, image, email, phone, profile_summary_en, profile_summary_hi]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRegistrarOfficeStaff = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_registrar_office ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRegistrarOfficeStaff = async (req, res) => {
  try {
    const { name, designation, phone, email, is_registrar } = req.body;
    const result = await db.query(
      'INSERT INTO administration_registrar_office (name, designation, phone, email, is_registrar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, designation, phone, email, is_registrar]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRegistrarOfficeStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, phone, email, is_registrar } = req.body;
    const result = await db.query(
      'UPDATE administration_registrar_office SET name = $1, designation = $2, phone = $3, email = $4, is_registrar = $5 WHERE id = $6 RETURNING *',
      [name, designation, phone, email, is_registrar, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRegistrarOfficeStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_registrar_office WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== VIGILANCE CRUD =====================
exports.getAllVigilanceMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_vigilance ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVigilanceMember = async (req, res) => {
  try {
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'INSERT INTO administration_vigilance (name, responsibility, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, responsibility, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVigilanceMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, responsibility, phone, email } = req.body;
    const result = await db.query(
      'UPDATE administration_vigilance SET name = $1, responsibility = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, responsibility, phone, email, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVigilanceMember = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_vigilance WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllVigilanceDownloads = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_vigilance_downloads ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVigilanceDownload = async (req, res) => {
  try {
    const { title, file_path } = req.body;
    const result = await db.query(
      'INSERT INTO administration_vigilance_downloads (title, file_path) VALUES ($1, $2) RETURNING *',
      [title, file_path]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVigilanceDownload = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_vigilance_downloads WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== VISITORS CRUD =====================
exports.getVisitorsInfo = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_visitors_info LIMIT 1');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVisitorsInfo = async (req, res) => {
  try {
    const { hero_heading, hero_subheading } = req.body;
    const result = await db.query(`
      INSERT INTO administration_visitors_info (id, hero_heading, hero_subheading)
      VALUES (1, $1, $2)
      ON CONFLICT (id) DO UPDATE SET
        hero_heading = EXCLUDED.hero_heading,
        hero_subheading = EXCLUDED.hero_subheading
      RETURNING *
    `, [hero_heading, hero_subheading]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllVisitors = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_visitors ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const { name, title, description, website_label, website_url } = req.body;
    const result = await db.query(
      'INSERT INTO administration_visitors (name, title, description, website_label, website_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, title, description, website_label, website_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, website_label, website_url } = req.body;
    const result = await db.query(
      'UPDATE administration_visitors SET name = $1, title = $2, description = $3, website_label = $4, website_url = $5 WHERE id = $6 RETURNING *',
      [name, title, description, website_label, website_url, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_visitors WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== FORMER CHAIRPERSONS CRUD =====================
exports.getAllFormerChairpersons = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM administration_chairperson_former ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFormerChairperson = async (req, res) => {
  try {
    const { name, years, image, category, note } = req.body;
    const result = await db.query(
      'INSERT INTO administration_chairperson_former (name, years, image, category, note) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, years, image, category, note]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFormerChairperson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, years, image, category, note } = req.body;
    const result = await db.query(
      'UPDATE administration_chairperson_former SET name = $1, years = $2, image = $3, category = $4, note = $5 WHERE id = $6 RETURNING *',
      [name, years, image, category, note, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFormerChairperson = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM administration_chairperson_former WHERE id = $1', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
