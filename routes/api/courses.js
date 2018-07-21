const router = require('express').Router();
const passport = require('../../passport');
const coursesController = require('../../controllers/coursesController');

// Matches with '/api/courses'
router.route('/')
  .get(coursesController.findAll);

// Matches with '/api/courses/:id'
router
  .route('/:id')
  .get(coursesController.findById)
  .post(isLoggedIn, coursesController.reserveCourse)
  .put(isLoggedIn, coursesController.checkSpace);

router
  .route('/remove/:id')
  .put(isLoggedIn, coursesController.removeCourseRegistration);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;