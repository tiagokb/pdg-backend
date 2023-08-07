require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const firebase = require('./config/firebaseInitialization');

// configure routes
app.use(routes);

//init firebase
firebase.init();

module.exports = app;