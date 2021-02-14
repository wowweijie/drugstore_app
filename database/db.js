var admin = require('firebase-admin');

var serviceAccount = require("../credential/drugstore_firebase_secret.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://drugstoreio-default-rtdb.firebaseio.com/'
  });

// Import Admin SDK
var admin = require("firebase-admin");

// Get Firebase Realtime Database reference
var db = admin.database();

module.exports = db;
