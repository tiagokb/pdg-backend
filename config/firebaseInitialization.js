//initialize firebase-admin
var admin = require("firebase-admin");
var serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

exports.init = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}