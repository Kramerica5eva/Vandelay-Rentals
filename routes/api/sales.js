const router = require('express').Router();
const salesController = require('../../controllers/salesController');

// Matches with '/api/sales'
router.route('/')
  .get(salesController.findAll)
  .post(isLoggedIn, salesController.create);

// Matches with '/api/sales/:id'
router
  .route('/:id')
  .get(salesController.findById)
  .put(isLoggedIn, salesController.update)
  .delete(isLoggedIn, salesController.remove);

function isLoggedIn(req, res, next) {
  console.log('Ain\'t that some shit!');
  if (req.isAuthenticated())
    return next();
  res.redirect('/cgi');
}

module.exports = router;
