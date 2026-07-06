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

//Homepage routes
router.use('/homepage/gallery', require('../../homepage/gallery'));

// Faculty routes
router.use('/faculty', require('../faculty'));

// Students routes
router.use('/students', require('../students'));
router.use('/homepage', require('../../homepage/hero'));
router.use('/homepage', require('../../homepage/about'));
router.use('/homepage', require('../../homepage/event'));
router.use('/homepage', require('../../homepage/academics'));
router.use('/homepage', require('../../homepage/news'));
router.use('/homepage', require('../../homepage/admission'));
router.use('/homepage', require('../../homepage/placements'));
router.use('/homepage', require('../../homepage/achievements'));
router.use('/homepage', require('../../homepage/director'));
router.use('/homepage', require('../../homepage/gallery'));

module.exports = router;