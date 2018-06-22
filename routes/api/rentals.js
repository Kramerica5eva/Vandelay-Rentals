const router = require('express').Router();
const rentalsController = require('../../controllers/rentalsController');

// Matches with '/api/rentals'
router.route('/')
  .get(rentalsController.findAll)
  .post(isLoggedIn, rentalsController.create);
  // post route here would only be available to admin

router
  .route('/:category')
  .get(rentalsController.findByCategory);

router
  .route('/:category/:id')
  .get(rentalsController.findById)
  .put(rentalsController.update)
  .delete(isLoggedIn, rentalsController.remove);
  // delete route here would only be available to admin

//  This 'get' route will need a findAll ('find') query that finds items that don't have any of the chosen days in the reservations field.
router
  .route('/date/:from/:to')
  // .get(rentalsController.findbyDates)
  .put(rentalsController.update);

router
  .route('/remove/:from/:to')
  .put(rentalsController.update);

  function isLoggedIn(req, res, next) {
    console.log('Ain\'t that some shit!');
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }

module.exports = router;
