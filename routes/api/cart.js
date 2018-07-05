const router = require('express').Router();
const passport = require('../../passport');
const cartController = require('../../controllers/cartController');

// Matches with '/api/cart'
router.route('/')
  .get(cartController.findAll);

// Matches with '/api/cart/:id'
// the id is the user's id - this gets a user's cart
router
  .route('/:id')
  .get(isLoggedIn, cartController.findUserCart);

router
  .route('/courses/:id')
  .post(isLoggedIn, cartController.addRegistrationToCart);

router
  .route('/rentals/date/:from/:to/:id/:name')
  .post(isLoggedIn, cartController.addReservationToCart);

router
  .route('/remove/:id')
  .put(isLoggedIn, cartController.update);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
