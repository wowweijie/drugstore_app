const express = require('express')
const notifs = express.Router();
const db = require('../database/db');

var admin = require("firebase-admin");

// This registration token comes from the client FCM SDKs.
var registrationToken = 'c_ns0oGfRq2-ubveOHs0_I:APA91bGCdOwDI3xQ30A8KfREOYQYSXqwgy2lE5ajbGEZR37xoOgmuXm-coUPMZb6q44mBQuVYDHHxYl8Gi_cCs1QZQ0VAxT9x_RkhYbCs4vixgw7zl4973WO7PB-08m4bAdcnMCl-jIK';

var message = {
    token: registrationToken,
    notification: {
        title: "Reminder",
        body: "Take insulin injection after meal"
    },
    android: {
        notification: {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        }
    },
}

notifs.post('/', (req, res) => {

    console.log('creating new notif...');
    var ref = db.ref('notification/' + req.query.id);
    let data = req.body
    console.log(data);
    ref.transaction((currentData) => {
        if (currentData === null) {
            return data;
        } else {
            console.log('Notif ID already exists.');
            return; // Abort the transaction.
        }
    }, (error, committed, snapshot) => {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('Aborted the transaction (because notif already exists).');
        } else {
            console.log('Notif added!');
        }
        console.log("Notif's data: ", snapshot.val());
    }).then(result => {
        // Send a message to the device corresponding to the provided registration token.
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                res.json({ status: 200, message: response })
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                res.status(400).json(error);
            });
    }).catch(err => {
        res.json({ status: 500, message: 'User not saved', data: err })
    });


});

notifs.get("/", (req, res) => {
    var ref = db.ref('notification');
    var userId = req.query.uid
    ref.once("value", function (snapshot) {
        var notifDB = snapshot.val();
        var notifArray = [];
        for (var i in notifDB) {
            if ((notifDB[i].user == (userId))) {
                notifArray.push(notifDB[i]);
            }
        }
        res.json(notifArray);
    })
})


module.exports = notifs;