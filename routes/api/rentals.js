const router = require('express').Router();
const rentalsController = require('../../controllers/rentalsController');

// Matches with '/api/rentals'
router.route('/')
  .get(rentalsController.findAll)
  .post(isLoggedIn, rentalsController.reserveRental);

// Matches with '/api/rentals/:category'
router
  .route('/:category')
  .get(rentalsController.findByCategory);

// Matches with '/api/rentals/remove/:from/:to'
// removes a reservation
router
  .route('/remove/:id')
  .put(isLoggedIn, rentalsController.breakReservation);

// Matches with '/api/rentals/:category/:id'
// gets info on a single item
// There is no reservation route based only on item - because (duh) you need dates to make a reservation
//  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
// router
//   .route('/:category/:id')
//   .get(rentalsController.findById);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
