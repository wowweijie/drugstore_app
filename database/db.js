var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://drugstoreio-default-rtdb.firebaseio.com/'
  });

// Import Admin SDK
var admin = require("firebase-admin");

// Get Firebase Realtime Database reference
var db = admin.database();

module.exports = db;
