const router = require('express').Router();
const salesController = require('../../controllers/salesController');

// Matches with '/api/sales'
router.route('/')
  .get(salesController.findAll);

// Matches with '/api/sales/:category'
//  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
// router
//   .route('/:category')
//   .get(salesController.findByCategory);

// Matches with '/api/sales/:category/:id'
//  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
// router
//   .route('/:category/:id')
//   .get(salesController.findById);

module.exports = router;
