const router = require('express').Router();
const passport = require('../../passport');
const adminUsersController = require('../../controllers/adminUsersController');

// Matches with '/admin/users'
router.route('/')
  .get(isAdmin, adminUsersController.findAll);

// Matches with '/admin/users/:id'
router
  .route('/:id')
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // .get(isAdmin, adminUsersController.findById)
  .put(isAdmin, adminUsersController.update)
  .delete(isAdmin, adminUsersController.remove);

function isAdmin(req, res, next) {
  if (req.user.admin)
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;