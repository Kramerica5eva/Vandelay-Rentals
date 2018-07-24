const router = require('express').Router();
const courseRoutes = require('./courses');
const rentalRoutes = require('./rentals');
const saleRoutes = require('./sales');
const cartRoutes = require('./cart');
const chargeRoutes = require('./charge');

// api routes
router.use('/courses', courseRoutes);
router.use('/rentals', rentalRoutes);
router.use('/sales', saleRoutes);
router.use('/cart', cartRoutes);
router.use('/charge', chargeRoutes);

module.exports = router;