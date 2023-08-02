const express = require('express');
const router = express.Router();

router.use(express.json());

// Import individuals route files

const authRoutes = require('./auth');
const pokemonsRoutes = require('./pokemons');
const appearingPoolRoutes = require('./appearingPool');
const messagingRoutes = require('./messaging');

// Mount the individual routers
router.use('/auth', authRoutes);
router.use('/pokemon', pokemonsRoutes);
router.use('/pool', appearingPoolRoutes);
router.use('/test', messagingRoutes);

module.exports = router;