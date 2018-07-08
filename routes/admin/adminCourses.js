const router = require('express').Router();
const passport = require('../../passport');
const adminCoursesController = require('../../controllers/adminCoursesController');

// Matches with '/admin/courses'
router.route('/')
  .get(isAdmin, adminCoursesController.findAll)
  .post(isAdmin, adminCoursesController.create);

// Matches with '/admin/courses/:id'
router
  .route('/:id')
  // .get(isAdmin, adminCoursesController.findById)
  .put(isAdmin, adminCoursesController.update)
  .delete(isAdmin, adminCoursesController.remove);
  
// Matches with '/admin/courses/registrations/:id'
router
.route('/registrations/:id')
.put(isAdmin, adminCoursesController.updateRegistration);
  
  function isAdmin(req, res, next) {
    if (req.user.admin)
      return next();
    res.json({ isAuthenticated: false });
  }

module.exports = router;
