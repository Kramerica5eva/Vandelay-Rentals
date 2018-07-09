const router = require('express').Router();
const passport = require('../../passport');
const cartController = require('../../controllers/cartController');

// Matches with '/api/cart'
//  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
// router.route('/')
//   .get(cartController.findAll);

// Matches with '/api/cart/:id'
// the id is the user's id - this gets a user's cart
router
  .route('/:id')
  .get(isLoggedIn, cartController.findUserCart);

router
  .route('/courses/:id')
  .post(isLoggedIn, cartController.addRegistrationToCart)
  .delete(isLoggedIn, cartController.removeRegistrationFromCart);

router
  .route('/rentals/date/:from/:to')
  .post(isLoggedIn, cartController.addReservationToCart);

router
  .route('/rentals/:id')
  .delete(isLoggedIn, cartController.removeReservationFromCart);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
