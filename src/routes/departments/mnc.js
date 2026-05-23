// src/routes/departments/mnc.js
const express = require('express');
const router = express.Router();
const mncController = require('../../controllers/mncController');

router.get('/', mncController.getMNCDepartmentInfo);
router.post('/', mncController.createMNCDepartmentInfo);
router.put('/', mncController.updateMNCDepartmentInfo);
router.delete('/', mncController.deleteMNCDepartmentInfo);
router.put('/language-toggle', mncController.toggleMNCLanguage);

router.get('/programmes', mncController.getMNCProgrammes);
router.get('/programmes/:id', mncController.getMNCProgrammeById);
router.post('/programmes', mncController.createMNCProgramme);
router.put('/programmes/:id', mncController.updateMNCProgramme);
router.delete('/programmes/:id', mncController.deleteMNCProgramme);

router.get('/mission-vision', mncController.getMNCMissionVision);
router.post('/mission-vision', mncController.createMNCMissionVision);
router.put('/mission-vision', mncController.updateMNCMissionVision);
router.delete('/mission-vision', mncController.deleteMNCMissionVision);

router.get('/research-areas', mncController.getMNCResearchAreas);
router.get('/research-areas/:id', mncController.getMNCResearchAreaById);
router.post('/research-areas', mncController.createMNCResearchArea);
router.put('/research-areas/:id', mncController.updateMNCResearchArea);
router.delete('/research-areas/:id', mncController.deleteMNCResearchArea);

router.get('/publications', mncController.getMNCPublications);
router.get('/publications/:id', mncController.getMNCPublicationById);
router.post('/publications', mncController.createMNCPublication);
router.put('/publications/:id', mncController.updateMNCPublication);
router.delete('/publications/:id', mncController.deleteMNCPublication);

router.get('/faculty', mncController.getMNCFaculty);
router.get('/faculty/:id', mncController.getMNCFacultyMemberById);
router.post('/faculty', mncController.createMNCFacultyMember);
router.put('/faculty/:id', mncController.updateMNCFacultyMember);
router.delete('/faculty/:id', mncController.deleteMNCFacultyMember);

router.get('/labs', mncController.getMNCLabs);
router.get('/labs/:id', mncController.getMNCLabById);
router.post('/labs', mncController.createMNCLab);
router.put('/labs/:id', mncController.updateMNCLab);
router.delete('/labs/:id', mncController.deleteMNCLab);

router.get('/contact', mncController.getMNCContact);
router.post('/contact', mncController.createMNCContact);
router.put('/contact', mncController.updateMNCContact);
router.delete('/contact', mncController.deleteMNCContact);

router.get('/media', mncController.getMNCMedia);
router.get('/media/:id', mncController.getMNCMediaById);
router.post('/media', mncController.uploadMNCMedia);
router.put('/media/:id', mncController.updateMNCMedia);
router.delete('/media/:id', mncController.deleteMNCMedia);

module.exports = router;
