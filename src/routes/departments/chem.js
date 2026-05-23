// src/routes/departments/chem.js
const express = require('express');
const router = express.Router();
const chemController = require('../../controllers/chemController');

router.get('/', chemController.getCHEMDepartmentInfo);
router.post('/', chemController.createCHEMDepartmentInfo);
router.put('/', chemController.updateCHEMDepartmentInfo);
router.delete('/', chemController.deleteCHEMDepartmentInfo);
router.put('/language-toggle', chemController.toggleCHEMLanguage);

router.get('/programmes', chemController.getCHEMProgrammes);
router.get('/programmes/:id', chemController.getCHEMProgrammeById);
router.post('/programmes', chemController.createCHEMProgramme);
router.put('/programmes/:id', chemController.updateCHEMProgramme);
router.delete('/programmes/:id', chemController.deleteCHEMProgramme);

router.get('/mission-vision', chemController.getCHEMMissionVision);
router.post('/mission-vision', chemController.createCHEMMissionVision);
router.put('/mission-vision', chemController.updateCHEMMissionVision);
router.delete('/mission-vision', chemController.deleteCHEMMissionVision);

router.get('/research-areas', chemController.getCHEMResearchAreas);
router.get('/research-areas/:id', chemController.getCHEMResearchAreaById);
router.post('/research-areas', chemController.createCHEMResearchArea);
router.put('/research-areas/:id', chemController.updateCHEMResearchArea);
router.delete('/research-areas/:id', chemController.deleteCHEMResearchArea);

router.get('/publications', chemController.getCHEMPublications);
router.get('/publications/:id', chemController.getCHEMPublicationById);
router.post('/publications', chemController.createCHEMPublication);
router.put('/publications/:id', chemController.updateCHEMPublication);
router.delete('/publications/:id', chemController.deleteCHEMPublication);

router.get('/faculty', chemController.getCHEMFaculty);
router.get('/faculty/:id', chemController.getCHEMFacultyMemberById);
router.post('/faculty', chemController.createCHEMFacultyMember);
router.put('/faculty/:id', chemController.updateCHEMFacultyMember);
router.delete('/faculty/:id', chemController.deleteCHEMFacultyMember);

router.get('/labs', chemController.getCHEMLabs);
router.get('/labs/:id', chemController.getCHEMLabById);
router.post('/labs', chemController.createCHEMLab);
router.put('/labs/:id', chemController.updateCHEMLab);
router.delete('/labs/:id', chemController.deleteCHEMLab);

router.get('/contact', chemController.getCHEMContact);
router.post('/contact', chemController.createCHEMContact);
router.put('/contact', chemController.updateCHEMContact);
router.delete('/contact', chemController.deleteCHEMContact);

router.get('/media', chemController.getCHEMMedia);
router.get('/media/:id', chemController.getCHEMMediaById);
router.post('/media', chemController.uploadCHEMMedia);
router.put('/media/:id', chemController.updateCHEMMedia);
router.delete('/media/:id', chemController.deleteCHEMMedia);

module.exports = router;
