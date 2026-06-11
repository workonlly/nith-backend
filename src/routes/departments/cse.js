// src/routes/departments/cse.js
// CSE department router - full CRUD per instruction.txt

const express = require('express');
const router = express.Router();
const cseController = require('../../controllers/cseController');

// ──────────────────────────────────────────
// CSE MAIN PAGE
// ──────────────────────────────────────────

router.get('/', cseController.getCSEDepartmentInfo);
router.post('/', cseController.createCSEDepartmentInfo);
router.put('/', cseController.updateCSEDepartmentInfo);
router.delete('/', cseController.deleteCSEDepartmentInfo);
router.put('/language-toggle', cseController.toggleCSELanguage);

// ──────────────────────────────────────────
// CSE PROGRAMMES
// ──────────────────────────────────────────

router.get('/programmes', cseController.getCSEProgrammes);
router.get('/programmes/:id', cseController.getCSEProgrammeById);
router.post('/programmes', cseController.createCSEProgramme);
router.put('/programmes/:id', cseController.updateCSEProgramme);
router.delete('/programmes/:id', cseController.deleteCSEProgramme);

// ──────────────────────────────────────────
// CSE MISSION & VISION
// ──────────────────────────────────────────

router.get('/mission-vision', cseController.getCSEMissionVision);
router.post('/mission-vision', cseController.createCSEMissionVision);
router.put('/mission-vision', cseController.updateCSEMissionVision);
router.delete('/mission-vision', cseController.deleteCSEMissionVision);

// ──────────────────────────────────────────
// CSE RESEARCH AREAS
// ──────────────────────────────────────────

router.get('/research-areas', cseController.getCSEResearchAreas);
router.get('/research-areas/:id', cseController.getCSEResearchAreaById);
router.post('/research-areas', cseController.createCSEResearchArea);
router.put('/research-areas/:id', cseController.updateCSEResearchArea);
router.delete('/research-areas/:id', cseController.deleteCSEResearchArea);

// ──────────────────────────────────────────
// CSE PUBLICATIONS
// ──────────────────────────────────────────

router.get('/publications', cseController.getCSEPublications);
router.get('/publications/:id', cseController.getCSEPublicationById);
router.post('/publications', cseController.createCSEPublication);
router.put('/publications/:id', cseController.updateCSEPublication);
router.delete('/publications/:id', cseController.deleteCSEPublication);

// ──────────────────────────────────────────
// CSE FACULTY
// ──────────────────────────────────────────

router.get('/faculty', cseController.getCSEFaculty);
router.get('/faculty/:id', cseController.getCSEFacultyMemberById);
router.post('/faculty', cseController.createCSEFacultyMember);
router.put('/faculty/:id', cseController.updateCSEFacultyMember);
router.delete('/faculty/:id', cseController.deleteCSEFacultyMember);

// ──────────────────────────────────────────
// CSE LABS
// ──────────────────────────────────────────

router.get('/labs', cseController.getCSELabs);
router.get('/labs/:id', cseController.getCSELabById);
router.post('/labs', cseController.createCSELab);
router.put('/labs/:id', cseController.updateCSELab);
router.delete('/labs/:id', cseController.deleteCSELab);

// ──────────────────────────────────────────
// CSE CONTACT
// ──────────────────────────────────────────

router.get('/contact', cseController.getCSEContact);
router.post('/contact', cseController.createCSEContact);
router.put('/contact', cseController.updateCSEContact);
router.delete('/contact', cseController.deleteCSEContact);

// ──────────────────────────────────────────
// CSE MEDIA
// ──────────────────────────────────────────

router.get('/media', cseController.getCSEMedia);
router.get('/media/:id', cseController.getCSEMediaById);
router.post('/media', cseController.uploadCSEMedia);
router.put('/media/:id', cseController.updateCSEMedia);
router.delete('/media/:id', cseController.deleteCSEMedia);

module.exports = router;
