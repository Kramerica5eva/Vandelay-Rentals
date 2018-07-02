const router = require('express').Router();
const waiverController = require('../../controllers/waiverController');

// Matches with '/file/sales'
router.route('/')
  .get(waiverController.findAll);

  // Matches with '/file/sales/:category'
  router
    .route('/:category')
    .get(waiverController.findByCategory);

// Matches with '/file/sales/:category/:id'
router
  .route('/:category/:id')
  .get(waiverController.findById);

// ==============Start Nick's Code===============
// ==============End Nick's Code===============


// Matches with '/file/wavier/create-signature-request'
router
  .route('/create-signature-request')
  .post(waiverController.createSignatureRequest);


  // ==============End Nick's Code===============

module.exports = router;
