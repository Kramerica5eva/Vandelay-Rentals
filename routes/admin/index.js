const router = require('express').Router();
const adminUserRoutes = require('./adminUser');
const adminCoursesRoutes = require('./adminCourses');
const adminRentalsRoutes = require('./adminRentals');
const adminSalesRoutes = require('./adminSales');

// admin routes
router.use('/users', adminUserRoutes);
router.use('/courses', adminCoursesRoutes);
router.use('/rentals', adminRentalsRoutes);
router.use('/sales', adminSalesRoutes);

module.exports = router;