const express = require('express');
const router = express.Router();

// About NITH routes
router.use('/about-nith', require('../about-nith'));

// Academics routes
router.use('/academics', require('../academics'));

// Administration routes
router.use('/administration', require('../administration'));

// Alumni routes
router.use('/alumni', require('../alumni'));

// Authorities routes
router.use('/authorities', require('../authorities'));

// Department routes
router.use('/departments', require('../departments'));

// Downloads routes
router.use('/downloads', require('../downloads'));

// Faculty routes
router.use('/faculty', require('../faculty'));

// Students routes
router.use('/students', require('../students'));

module.exports = router;