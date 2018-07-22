const router = require('express').Router();
const waiverController = require('../../controllers/waiverController');

// ==============Start Nick's Code===============

// Matches with '/file/waiver/create-signature-request'
router
  .route('/create-signature-request')
  .post(waiverController.createSignatureRequest);

// ==============End Nick's Code===============

module.exports = router;
