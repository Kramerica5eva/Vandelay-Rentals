const router = require('express').Router();
const rentalsController = require('../../controllers/rentalsController');

// Matches with '/api/rentals'
router.route('/')
  .get(rentalsController.findAll);

// Matches with '/api/rentals/:category'
router
  .route('/:category')
  .get(rentalsController.findByCategory);

// Matches with '/api/rentals/:category/:id'
// gets info on a single item
// There is no reservation route based only on item - because (duh) you need dates to make a reservation
router
  .route('/:category/:id')
  .get(rentalsController.findById);

  // Matches with '/api/rentals/date/:from/:to/:id'
  // put makes a reservation
  router
    .route('/date/:from/:to/:id/:name')
    .post(isLoggedIn, rentalsController.makeReservation);

// Matches with '/api/rentals/remove/:from/:to'
// removes a reservation
router
  .route('/remove/:from/:to/:id')
  .put(isLoggedIn, rentalsController.breakReservation);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
