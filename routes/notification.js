const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.use(auth.verifyToken);

router.post('/registerToken', messagingController.registerToken);

module.exports = router;