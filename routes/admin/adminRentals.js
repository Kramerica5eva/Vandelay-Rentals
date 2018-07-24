const router = require('express').Router();
const passport = require('../../passport');
const adminRentalsController = require('../../controllers/adminRentalsController');

// Matches with '/admin/rentals'
router.route('/')
  .get(isAdmin, adminRentalsController.findAll)
  .post(isAdmin, adminRentalsController.create);

// Matches with '/admin/rentals/:id'
router
  .route('/:id')
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT - 'GET'
  // .get(isAdmin, adminRentalsController.findById)
  .put(isAdmin, adminRentalsController.updateRental)
  .delete(isAdmin, adminRentalsController.remove);

// Matches with '/admin/rentals/reservations/:id'
router
  .route('/reservations/:id')
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT - 'GET'
  // .get(isAdmin, adminRentalsController.getReservations)
  .put(isAdmin, adminRentalsController.updateReservation)
  .post(isAdmin, adminRentalsController.finishReservation);

router
  .route('/past/:id')
  .put(isAdmin, adminRentalsController.updatePastRental);

function isAdmin(req, res, next) {
  if (req.user.admin)
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
