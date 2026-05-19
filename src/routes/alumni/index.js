const express = require('express');
const router = express.Router();

// Import all flat routing files to mount them cleanly under the /v1/alumni path
const alumniActivities = require('../alumniActivities');
const alumniMou = require('../alumniMou');
const alumniFunctionaries = require('../alumniFunctionaries');
const alumniAssist = require('../alumniAssist');
const alumniDistinguished = require('../alumniDistinguished');
const alumniRegistration = require('../alumniRegistration');
const alumniEndowment = require('../alumniEndowment');
const alumniAwards = require('../alumniAwards');
const alumniAnnualMeet = require('../alumniAnnualMeet');

// Mount them on their respective sub-paths
router.use('/activities', alumniActivities);
router.use('/mou', alumniMou);
router.use('/functionaries', alumniFunctionaries);
router.use('/assist', alumniAssist);
router.use('/distinguished', alumniDistinguished);
router.use('/registration', alumniRegistration);
router.use('/endowment', alumniEndowment);
router.use('/awards', alumniAwards);
router.use('/annual-meet', alumniAnnualMeet);

module.exports = router;
