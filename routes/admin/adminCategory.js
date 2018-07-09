const router = require('express').Router();
const adminCategoryController = require('../../controllers/adminCategoryController');

// Matches with '/admin/category'
router.route('/')
  .get(adminCategoryController.findAll)
  .post(isAdmin, adminCategoryController.create);

// Matches with '/admin/category/:id'
router
  .route('/:id')
  .delete(isAdmin, adminCategoryController.remove);

function isAdmin(req, res, next) {
  if (req.user.admin)
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
