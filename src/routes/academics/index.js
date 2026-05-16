const express = require('express');
const router = express.Router();
const academicsController = require('../../controllers/academicsController');

// Overview
router.get('/overview', academicsController.getAcademics);
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

module.exports = router;
