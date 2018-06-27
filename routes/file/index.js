const router = require('express').Router();
const imageRoutes = require('./image');
const waiverRoutes = require('./waiver');

// file routes
router.use('/image', imageRoutes);
router.use('/waiver', waiverRoutes);

module.exports = router;