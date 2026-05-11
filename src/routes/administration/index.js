const express = require('express');
const router = express.Router();
const accountsRoutes = require('./accounts');

// Optional: middleware specific to this router
// const auth = require('../middleware/auth');
// router.use(auth);

// Accounts Management Routes
router.use('/accounts', accountsRoutes);

// GET /api/v1/administration
router.get('/', (req, res) => {
  res.json({
    message: 'Administration module - includes accounts management',
    endpoints: {
      'accounts': '/accounts/*'
    }
  });
});

// GET /api/v1/xyz/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    message: `Details of item ${id}`,
    data: { id }
  });
});

// POST /api/v1/xyz
router.post('/', (req, res) => {
  const body = req.body;
  res.status(201).json({
    message: 'Item created',
    data: body
  });
});

// PUT /api/v1/xyz/:id
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  res.json({
    message: `Item ${id} updated`,
    data: body
  });
});

// DELETE /api/v1/xyz/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    message: `Item ${id} deleted`
  });
});

module.exports = router;
