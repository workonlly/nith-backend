// src/routes/departments/index.js
// Master departments router - department_master CRUD + department-specific sub-routes

const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/departmentController');

// Department-specific routers (mount before /:deptCode to avoid route conflicts)
const cseRouter = require('./cse');
router.use('/cse', cseRouter);
const mncRouter = require('./mnc');
router.use('/mnc', mncRouter);
const phyRouter = require('./phy');
router.use('/phy', phyRouter);
const mscRouter = require('./msc');
router.use('/msc', mscRouter);
const chemRouter = require('./chem');
router.use('/chem', chemRouter);

// Department master CRUD (/v1/departments)
router.get('/', departmentController.getAllDepartments);
router.get('/:deptCode', departmentController.getDepartmentByCode);
router.post('/', departmentController.createDepartment);
router.put('/:deptCode', departmentController.updateDepartment);
router.delete('/:deptCode', departmentController.deleteDepartment);

module.exports = router;
