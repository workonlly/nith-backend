const express = require('express');
const router = express.Router();
const mscController = require('../../controllers/mscController');

router.get('/', mscController.getDepartmentInfo);
router.post('/', mscController.createDepartmentInfo);
router.put('/', mscController.updateDepartmentInfo);
router.delete('/', mscController.deleteDepartmentInfo);
router.put('/language-toggle', mscController.toggleLanguage);

router.get('/programmes', mscController.getProgrammes);
router.get('/programmes/:id', mscController.getProgrammeById);
router.post('/programmes', mscController.createProgramme);
router.put('/programmes/:id', mscController.updateProgramme);
router.delete('/programmes/:id', mscController.deleteProgramme);

router.get('/faculty', mscController.getFaculty);
router.get('/faculty/:id', mscController.getFacultyMemberById);
router.post('/faculty', mscController.createFacultyMember);
router.put('/faculty/:id', mscController.updateFacultyMember);
router.delete('/faculty/:id', mscController.deleteFacultyMember);

router.get('/labs', mscController.getLabs);
router.get('/labs/:id', mscController.getLabById);
router.post('/labs', mscController.createLab);
router.put('/labs/:id', mscController.updateLab);
router.delete('/labs/:id', mscController.deleteLab);

router.get('/publications', mscController.getPublications);
router.get('/publications/:id', mscController.getPublicationById);
router.post('/publications', mscController.createPublication);
router.put('/publications/:id', mscController.updatePublication);
router.delete('/publications/:id', mscController.deletePublication);

router.get('/contact', mscController.getContact);
router.post('/contact', mscController.createContact);
router.put('/contact', mscController.updateContact);
router.delete('/contact', mscController.deleteContact);

router.get('/media', mscController.getMedia);
router.get('/media/:id', mscController.getMediaById);
router.post('/media', mscController.createMedia);
router.put('/media/:id', mscController.updateMedia);
router.delete('/media/:id', mscController.deleteMedia);

module.exports = router;
