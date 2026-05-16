const express = require('express');
const router = express.Router();
const administrationController = require('../../controllers/administrationController');
const accountsRoutes = require('./accounts');

// Accounts Management Routes
router.use('/accounts', accountsRoutes);

// Chairperson
router.get('/chairperson', administrationController.getChairperson);
router.put('/chairperson/:id', administrationController.updateChairperson);

// Deans
router.get('/deans', administrationController.getAllDeans);
router.post('/deans', administrationController.createDean);
router.put('/deans/:id', administrationController.updateDean);
router.delete('/deans/:id', administrationController.deleteDean);

// Vigilance
router.get('/vigilance', administrationController.getAllVigilanceMembers);
router.post('/vigilance', administrationController.createVigilanceMember);
router.put('/vigilance/:id', administrationController.updateVigilanceMember);
router.delete('/vigilance/:id', administrationController.deleteVigilanceMember);
router.get('/vigilance-downloads', administrationController.getAllVigilanceDownloads);
router.post('/vigilance-downloads', administrationController.createVigilanceDownload);
router.delete('/vigilance-downloads/:id', administrationController.deleteVigilanceDownload);

// Director Info
router.get('/director', administrationController.getDirectorInfo);
router.post('/director', administrationController.updateDirectorInfo); // Using POST for Upsert

// Former Directors
router.get('/former-directors', administrationController.getAllFormerDirectors);
router.post('/former-directors', administrationController.createFormerDirector);
router.delete('/former-directors/:id', administrationController.deleteFormerDirector);

// Office Staff
router.get('/office-staff', administrationController.getOfficeStaff);
router.post('/office-staff', administrationController.createOfficeStaff);
router.put('/office-staff/:id', administrationController.updateOfficeStaff);
router.delete('/office-staff/:id', administrationController.deleteOfficeStaff);

// Faculty Incharges
router.get('/faculty-incharges', administrationController.getAllFacultyIncharges);
router.post('/faculty-incharges', administrationController.createFacultyIncharge);
router.put('/faculty-incharges/:id', administrationController.updateFacultyIncharge);
router.delete('/faculty-incharges/:id', administrationController.deleteFacultyIncharge);

// HOD
router.get('/hod', administrationController.getAllHODs);
router.post('/hod', administrationController.createHOD);
router.put('/hod/:id', administrationController.updateHOD);
router.delete('/hod/:id', administrationController.deleteHOD);

// Institute Coordinators
router.get('/institute-coordinators-info', administrationController.getInstituteCoordinatorsInfo);
router.post('/institute-coordinators-info', administrationController.updateInstituteCoordinatorsInfo);
router.get('/institute-coordinators', administrationController.getAllInstituteCoordinators);
router.post('/institute-coordinators', administrationController.createInstituteCoordinator);
router.put('/institute-coordinators/:id', administrationController.updateInstituteCoordinator);
router.delete('/institute-coordinators/:id', administrationController.deleteInstituteCoordinator);

// Nodal Officers
router.get('/nodal-officers', administrationController.getAllNodalOfficers);
router.post('/nodal-officers', administrationController.createNodalOfficer);
router.put('/nodal-officers/:id', administrationController.updateNodalOfficer);
router.delete('/nodal-officers/:id', administrationController.deleteNodalOfficer);

// Registrar
router.get('/registrar', administrationController.getRegistrar);
router.post('/registrar', administrationController.upsertRegistrar);
router.get('/registrar-office', administrationController.getRegistrarOfficeStaff);
router.post('/registrar-office', administrationController.createRegistrarOfficeStaff);
router.put('/registrar-office/:id', administrationController.updateRegistrarOfficeStaff);
router.delete('/registrar-office/:id', administrationController.deleteRegistrarOfficeStaff);


// Visitors
router.get('/visitors-info', administrationController.getVisitorsInfo);
router.post('/visitors-info', administrationController.updateVisitorsInfo);
router.get('/visitors', administrationController.getAllVisitors);
router.post('/visitors', administrationController.createVisitor);
router.put('/visitors/:id', administrationController.updateVisitor);
router.delete('/visitors/:id', administrationController.deleteVisitor);

// Former Chairpersons
router.get('/former-chairpersons', administrationController.getAllFormerChairpersons);
router.post('/former-chairpersons', administrationController.createFormerChairperson);
router.put('/former-chairpersons/:id', administrationController.updateFormerChairperson);
router.delete('/former-chairpersons/:id', administrationController.deleteFormerChairperson);

module.exports = router;
