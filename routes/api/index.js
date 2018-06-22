const router = require('express').Router();
const courseRoutes = require('./courses');
const rentalRoutes = require('./rentals');
const saleRoutes = require('./sales');

// Book routes
router.use('/courses', courseRoutes);
router.use('/rentals', rentalRoutes);
router.use('/sales', saleRoutes);

module.exports = router;