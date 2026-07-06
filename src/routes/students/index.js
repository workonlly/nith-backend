const express = require('express');
const router = express.Router();
const studentsController = require('../../controllers/studentsController');

router.get('/', studentsController.getStudentPage);
router.post('/', studentsController.updateStudentPage);
router.put('/', studentsController.updateStudentPage);

module.exports = router;
