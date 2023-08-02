const express = require('express');
const router = express.Router();
const poolController = require('../controllers/appearingPoolController');
const auth = require('../middlewares/auth');

router.use(auth.verifyToken);

router.get('/check', poolController.checkPool);
router.get('/executeAction', poolController.executeAction);

module.exports = router;
