require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');

// configure routes
app.use(routes);

//initialize firebase-admin
var admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = app;