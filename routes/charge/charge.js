const router = require('express').Router();
const chargeController = require('../../controllers/chargeController');

// Matches with '/charge'
router
  .route('/')
  .post(chargeController.charge);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;