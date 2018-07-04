const router = require('express').Router();
const adminUserRoutes = require('./adminUser');
const adminCoursesRoutes = require('./adminCourses');
const adminRentalsRoutes = require('./adminRentals');
const adminSalesRoutes = require('./adminSales');
const adminCategoryRoutes = require('./adminCategory');

// admin routes
router.use('/users', adminUserRoutes);
router.use('/courses', adminCoursesRoutes);
router.use('/rentals', adminRentalsRoutes);
router.use('/sales', adminSalesRoutes);
router.use('/category', adminCategoryRoutes);

module.exports = router;