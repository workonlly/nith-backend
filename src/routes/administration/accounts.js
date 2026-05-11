const express = require('express');
const router = express.Router();
const accountsController = require('../../controllers/accountsController');

// ===================== CATEGORY ROUTES =====================
router.get('/category', accountsController.getAllCategories);
router.get('/category/:id', accountsController.getCategoryById);
router.post('/category', accountsController.createCategory);
router.put('/category/:id', accountsController.updateCategory);
router.delete('/category/:id', accountsController.deleteCategory);

// ===================== ROLE POSITION ROUTES =====================
router.get('/role-position', accountsController.getAllRolePositions);
router.get('/role-position/:id', accountsController.getRolePositionById);
router.post('/role-position', accountsController.createRolePosition);
router.put('/role-position/:id', accountsController.updateRolePosition);
router.delete('/role-position/:id', accountsController.deleteRolePosition);

// ===================== FACULTY ROUTES =====================
router.get('/faculty', accountsController.getAllFaculty);
router.get('/faculty/:id', accountsController.getFacultyById);
router.post('/faculty', accountsController.createFaculty);
router.put('/faculty/:id', accountsController.updateFaculty);
router.delete('/faculty/:id', accountsController.deleteFaculty);

// ===================== FACULTY ROLE ASSIGNMENT ROUTES =====================
router.get('/faculty-role', accountsController.getAllFacultyRoles);
router.get('/faculty-role/:id', accountsController.getFacultyRoleById);
router.post('/faculty-role', accountsController.createFacultyRole);
router.put('/faculty-role/:id', accountsController.updateFacultyRole);
router.delete('/faculty-role/:id', accountsController.deleteFacultyRole);

module.exports = router;
