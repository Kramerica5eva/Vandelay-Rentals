const router = require('express').Router();
const salesController = require('../../controllers/salesController');

// Matches with '/api/sales'
router.route('/')
  .get(salesController.findAll);

  // Matches with '/api/sales/:category'
  router
    .route('/:category')
    .get(salesController.findByCategory);

// Matches with '/api/sales/:category/:id'
router
  .route('/:category/:id')
  .get(salesController.findById);

module.exports = router;
