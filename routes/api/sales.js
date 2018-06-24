const router = require('express').Router();
const salesController = require('../../controllers/salesController');

// Matches with '/api/sales'
router.route('/')
  .get(salesController.findAll);

// Matches with '/api/sales/:id'
router
  .route('/:id')
  .get(salesController.findById);

module.exports = router;
