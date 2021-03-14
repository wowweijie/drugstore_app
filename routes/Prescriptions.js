const express = require('express')
const prescriptions = express.Router();
const db = require('../database/db');

prescriptions.get("/", (req, res) => {
    var ref = db.ref('prescription');
    var userId = req.query.uid
    ref.once("value", function (snapshot) {
        var prescriptionsDB = snapshot.val();
        var prescriptionsArray = [];
        for (var i in prescriptionsDB) {
            if ((prescriptionsDB[i].user == (userId))) {
                prescriptionsArray.push(prescriptionsDB[i]);
            }
        }
        res.json(prescriptionsArray.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        }));
    })
})

prescriptions.post('/', (req, res) => {
    console.log('creating new prescription...');
    var ref = db.ref('prescription/' + req.query.id);
    let prescriptionData = req.body
    console.log(prescriptionData);
    ref.transaction((currentData) => {
        if (currentData === null) {
            return prescriptionData;
        } else {
            console.log('Prescription ID already exists.');
            return; // Abort the transaction.
        }
    }, (error, committed, snapshot) => {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('Aborted the transaction (because prescription already exists).');
        } else {
            console.log('Prescription added!');
        }
        console.log("Prescription's data: ", snapshot.val());
    }).then(result => {
        res.json({ status: 200, message: 'Prescription saved', data: result.id })
    }).catch(err => {
        res.json({ status: 500, message: 'Prescription not saved' })
    });
});

module.exports = prescriptions;