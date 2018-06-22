const router = require('express').Router();
const passport = require('../../passport');
const coursesController = require('../../controllers/coursesController');

// Matches with '/api/courses'
router.route('/')
  .get(coursesController.findAll)
  .post(isLoggedIn, coursesController.create);
// post route here is an admin route

// Matches with '/api/courses/:id'
router
  .route('/:id')
  .get(coursesController.findById)
  .put(coursesController.update)
  .delete(isLoggedIn, coursesController.remove);
// delete route here is an admin route

router
  .route('/pay/:id')
  .put(coursesController.update);

router
  .route('/remove/:id')
  .put(coursesController.update);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send({ redirect: true });
}

module.exports = router;
