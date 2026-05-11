// src/routes/about-nith/index.js
const express = require('express');
const router = express.Router();
const aboutNithController = require('../../controllers/aboutNithController');

// GET /v1/about-nith - Get ALL about-nith data
router.get('/', aboutNithController.getAllAboutNith);

// GET /v1/about-nith/:id - Get SINGLE about-nith by ID
router.get('/:id', aboutNithController.getAboutNithById);

// POST /v1/about-nith - Create new about-nith data
router.post('/', aboutNithController.createAboutNith);

// PUT /v1/about-nith/:id - Update about-nith by ID
router.put('/:id', aboutNithController.updateAboutNith);

// DELETE /v1/about-nith/:id - Delete about-nith by ID
router.delete('/:id', aboutNithController.deleteAboutNith);

module.exports = router;
