const express = require('express');
const router = express.Router();

router.use(express.json());

// Import individuals route files

const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const appearingPoolRoutes = require('./appearingPool');

// Mount the individual routers
router.use('/auth', authRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/pool', appearingPoolRoutes);

module.exports = router;