const router = require('express').Router();
const userRoutes = require('./user');

// Book routes
router.use('/', userRoutes);

module.exports = router;