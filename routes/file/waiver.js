const router = require('express').Router();
const waiverController = require('../../controllers/waiverController');

// Matches with '/api/sales'
router.route('/')
  .get(waiverController.findAll);

  // Matches with '/api/sales/:category'
  router
    .route('/:category')
    .get(waiverController.findByCategory);

// Matches with '/api/sales/:category/:id'
router
  .route('/:category/:id')
  .get(waiverController.findById);

module.exports = router;
