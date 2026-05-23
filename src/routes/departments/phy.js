const express = require('express');
const router = express.Router();
const phyController = require('../../controllers/phyController');

router.get('/', phyController.getDepartmentInfo);
router.post('/', phyController.createDepartmentInfo);
router.put('/', phyController.updateDepartmentInfo);
router.delete('/', phyController.deleteDepartmentInfo);
router.put('/language-toggle', phyController.toggleLanguage);

router.get('/programmes', phyController.getProgrammes);
router.get('/programmes/:id', phyController.getProgrammeById);
router.post('/programmes', phyController.createProgramme);
router.put('/programmes/:id', phyController.updateProgramme);
router.delete('/programmes/:id', phyController.deleteProgramme);

router.get('/faculty', phyController.getFaculty);
router.get('/faculty/:id', phyController.getFacultyMemberById);
router.post('/faculty', phyController.createFacultyMember);
router.put('/faculty/:id', phyController.updateFacultyMember);
router.delete('/faculty/:id', phyController.deleteFacultyMember);

router.get('/labs', phyController.getLabs);
router.get('/labs/:id', phyController.getLabById);
router.post('/labs', phyController.createLab);
router.put('/labs/:id', phyController.updateLab);
router.delete('/labs/:id', phyController.deleteLab);

router.get('/publications', phyController.getPublications);
router.get('/publications/:id', phyController.getPublicationById);
router.post('/publications', phyController.createPublication);
router.put('/publications/:id', phyController.updatePublication);
router.delete('/publications/:id', phyController.deletePublication);

router.get('/contact', phyController.getContact);
router.post('/contact', phyController.createContact);
router.put('/contact', phyController.updateContact);
router.delete('/contact', phyController.deleteContact);

router.get('/media', phyController.getMedia);
router.get('/media/:id', phyController.getMediaById);
router.post('/media', phyController.createMedia);
router.put('/media/:id', phyController.updateMedia);
router.delete('/media/:id', phyController.deleteMedia);

module.exports = router;
