const db = require('../db/db');

// ===================== STUDENTS PAGES CRUD =====================
exports.getStudentPage = async (req, res) => {
  try {
    const { page_name } = req.query;
    let query = 'SELECT * FROM students';
    let params = [];
    if (page_name) {
      query += ' WHERE page_name = $1';
      params.push(page_name);
    }
    query += ' ORDER BY id';
    const result = await db.query(query, params);
    
    if (page_name) {
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudentPage = async (req, res) => {
  try {
    const { page_name, title_en, title_hi, description_en, description_hi, hero_image, content } = req.body;
    
    if (!page_name) {
      return res.status(400).json({ success: false, message: 'page_name is required' });
    }

    // Upsert logic
    const checkResult = await db.query('SELECT id FROM students WHERE page_name = $1', [page_name]);
    let result;
    if (checkResult.rows.length > 0) {
      result = await db.query(
        'UPDATE students SET title_en = $2, title_hi = $3, description_en = $4, description_hi = $5, hero_image = $6, content = $7 WHERE page_name = $1 RETURNING *',
        [page_name, title_en || '', title_hi || '', description_en || '', description_hi || '', hero_image || '', JSON.stringify(content || {})]
      );
    } else {
      result = await db.query(
        'INSERT INTO students (page_name, title_en, title_hi, description_en, description_hi, hero_image, content) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [page_name, title_en || '', title_hi || '', description_en || '', description_hi || '', hero_image || '', JSON.stringify(content || {})]
      );
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
