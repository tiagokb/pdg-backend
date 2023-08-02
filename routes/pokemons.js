const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');
const auth = require('../middlewares/auth');

router.use(auth.verifyToken);

router.post('/addOrRemove', pokemonController.addOrRemove);
router.get('/listFavorites', pokemonController.listFavorites);
router.get('/listCaptured', pokemonController.listCaptured);

module.exports = router;
