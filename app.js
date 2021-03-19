'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

// Initialize routes
var Users = require('./routes/Users');
var Diagnoses = require('./routes/Diagnoses');
var Prescriptions = require('./routes/Prescriptions');
var Notifications = require('./routes/Notifications');
app.use('/users', Users);
app.use('/diagnoses', Diagnoses);
app.use('/prescriptions', Prescriptions);
app.use('/notifs', Notifications);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(process.versions)
  console.log(__dirname);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
