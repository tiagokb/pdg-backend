const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const auth = require('../middlewares/auth');

router.use(auth.verifyToken);

router.get('/sendTestMessage', messagingController.sendTestMessage);

module.exports = router;