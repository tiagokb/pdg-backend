const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//user region
router.post('/user', express.json(), userController.create);
router.get('/user', express.json(), userController.get);
//end user region

module.exports = router;
