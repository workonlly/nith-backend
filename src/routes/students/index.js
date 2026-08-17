const express = require('express');
const router = express.Router();
const studentsController = require('../../controllers/studentsController');
const db = require('../../db/db');

router.get('/', studentsController.getStudentPage);
router.post('/', studentsController.updateStudentPage);
router.put('/', studentsController.updateStudentPage);

router.get('/activities', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM students_activites ORDER BY id ASC');
		res.json({ success: true, data: { activities: result.rows } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.post('/activities', async (req, res) => {
	try {
		const { title_en, title_hn, description_en, description_hn } = req.body;
		const result = await db.query(
			'INSERT INTO students_activites (title_en, title_hn, description_en, description_hn) VALUES ($1, $2, $3, $4) RETURNING *',
			[title_en || '', title_hn || '', description_en || '', description_hn || '']
		);
		res.status(201).json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.put('/activities/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { title_en, title_hn, description_en, description_hn } = req.body;
		const result = await db.query(
			'UPDATE students_activites SET title_en = $1, title_hn = $2, description_en = $3, description_hn = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
			[title_en || '', title_hn || '', description_en || '', description_hn || '', id]
		);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.delete('/activities/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.query('DELETE FROM students_activites WHERE id = $1 RETURNING *', [id]);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.get('/functionaries', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM students_fucntionaries ORDER BY title_en ASC, id ASC');
		res.json({ success: true, data: { functionaries: result.rows } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.post('/functionaries', async (req, res) => {
	try {
		const { title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id } = req.body;
		const result = await db.query(
			'INSERT INTO students_fucntionaries (title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[title_en || '', title_hn || '', name_en || '', name_hn || '', responsibility_en || '', phone || '', email || '', faculty_id || null]
		);
		res.status(201).json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.put('/functionaries/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id } = req.body;
		const result = await db.query(
			'UPDATE students_fucntionaries SET title_en = $1, title_hn = $2, name_en = $3, name_hn = $4, responsibility_en = $5, phone = $6, email = $7, faculty_id = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
			[title_en || '', title_hn || '', name_en || '', name_hn || '', responsibility_en || '', phone || '', email || '', faculty_id || null, id]
		);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.delete('/functionaries/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.query('DELETE FROM students_fucntionaries WHERE id = $1 RETURNING *', [id]);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
