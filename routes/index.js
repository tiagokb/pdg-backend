const express = require('express');
const router = express.Router();

router.use(express.json());

// Import individuals route files

const authRoutes = require('./auth');
const pokemonRoutes = require('./pokemon');
const appearingPoolRoutes = require('./appearingPool');
const messagingRoutes = require('./notification');

// Mount the individual routers
router.use('/auth', authRoutes);
router.use('/pokemon', pokemonRoutes);
router.use('/pool', appearingPoolRoutes);
router.use('/notification', messagingRoutes);

module.exports = router;