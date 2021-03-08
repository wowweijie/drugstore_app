const express = require('express')
const diagnoses = express.Router();
const db = require('../database/db');

diagnoses.get("/", (req,res) => {
  var ref = db.ref('diagnosis');
  var userId = req.query.uid
  ref.once("value", function(snapshot){
    var diagnosesDB = snapshot.val();
    var diagnosesArray = [];
    for (var i in diagnosesDB){
        if ((diagnosesDB[i].user==(userId))){
          diagnosesArray.push(diagnosesDB[i]);
        }
    }
    res.json(diagnosesArray); 
})
})

diagnoses.post('/', (req,res) => {
    console.log('creating new diagnosis...');
    var ref = db.ref('diagnosis/'+req.query.id);
    let diagnosisData = req.body
    console.log(diagnosisData);
    ref.transaction((currentData) => {
        if (currentData === null) {
          return diagnosisData;
        } else {
          console.log('Diagnosis ID already exists.');
          return; // Abort the transaction.
        }
      }, (error, committed, snapshot) => {
        if (error) {
          console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
          console.log('Aborted the transaction (because diagnosis already exists).');
        } else {
          console.log('Diagnosis  added!');
        }
        console.log("Diagnosis's data: ", snapshot.val());
      }).then(result => {
        res.json({status: 200, message: 'Diagnosis saved', data : result.id})
      }).catch(err => {
        res.json({status: 500, message: 'Diagnosis not saved'})
    });
});

diagnoses.put('/', (req, res) => {
  let diagnosisToUpdate = db.ref('diagnosis/'+req.query.id);
  diagnosisToUpdate.once("value", function(snapshot){
    newData = snapshot.val();
    diagnosisToUpdate.update(req.body);
  })
  res.status(200).json(req.body);
})

module.exports = diagnoses;