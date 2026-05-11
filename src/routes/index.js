const express = require('express');
const router = express.Router();

// V1 API routes
router.use('/', require('./v1'));

module.exports = router;