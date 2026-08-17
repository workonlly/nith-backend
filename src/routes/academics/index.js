const express = require('express');
const router = express.Router();
const academicsController = require('../../controllers/academicsController');
const db = require('../../db/db');

// Overview
router.get('/overview', academicsController.getAcademics);
router.post('/overview', academicsController.updateAcademics);
router.put('/overview', academicsController.updateAcademics);
router.put('/overview/:id', academicsController.updateAcademics);

// Tables (Functionaries)
router.get('/tables', academicsController.getAllAcademicTables);
router.post('/tables', academicsController.createAcademicTableEntry);
router.put('/tables/:id', academicsController.updateAcademicTableEntry);
router.delete('/tables/:id', academicsController.deleteAcademicTableEntry);

// Links (Notice Board, Calendars, etc)
router.get('/links', academicsController.getAllAcademicLinks);
router.post('/links', academicsController.createAcademicLink);
router.delete('/links/:id', academicsController.deleteAcademicLink);

// Notices
router.get('/notices', academicsController.getAllAcademicNotices);
router.post('/notices', academicsController.createAcademicNotice);
router.put('/notices/:id', academicsController.updateAcademicNotice);
router.delete('/notices/:id', academicsController.deleteAcademicNotice);

// Calendars
router.get('/calendars', academicsController.getAllAcademicCalendars);
router.post('/calendars', academicsController.createAcademicCalendar);
router.put('/calendars/:id', academicsController.updateAcademicCalendar);
router.delete('/calendars/:id', academicsController.deleteAcademicCalendar);

router.get('/activities', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM academics_activites ORDER BY id ASC');
		res.json({ success: true, data: { activities: result.rows } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.post('/activities', async (req, res) => {
	try {
		const { title_en, title_hn, description_en, description_hn } = req.body;
		const result = await db.query(
			'INSERT INTO academics_activites (title_en, title_hn, description_en, description_hn) VALUES ($1, $2, $3, $4) RETURNING *',
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
			'UPDATE academics_activites SET title_en = $1, title_hn = $2, description_en = $3, description_hn = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
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
		const result = await db.query('DELETE FROM academics_activites WHERE id = $1 RETURNING *', [id]);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.get('/functionaries', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM academics_fucntionaries ORDER BY title_en ASC, id ASC');
		res.json({ success: true, data: { functionaries: result.rows } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.post('/functionaries', async (req, res) => {
	try {
		const { title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id } = req.body;
		const result = await db.query(
			'INSERT INTO academics_fucntionaries (title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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
			'UPDATE academics_fucntionaries SET title_en = $1, title_hn = $2, name_en = $3, name_hn = $4, responsibility_en = $5, phone = $6, email = $7, faculty_id = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
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
		const result = await db.query('DELETE FROM academics_fucntionaries WHERE id = $1 RETURNING *', [id]);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
