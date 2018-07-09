const router = require('express').Router();
const passport = require('../../passport');
const adminSalesController = require('../../controllers/adminSalesController');

// Matches with '/admin/sales'
router.route('/')
  .get(isAdmin, adminSalesController.findAll)
  .post(isAdmin, adminSalesController.create);

// Matches with '/admin/sales/:id'
router
  .route('/:id')
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // .get(isAdmin, adminSalesController.findById)
  .put(isAdmin, adminSalesController.update)
  .delete(isAdmin, adminSalesController.remove);
  
  function isAdmin(req, res, next) {
    if (req.user.admin)
      return next();
    res.json({ isAuthenticated: false });
  }

module.exports = router;
