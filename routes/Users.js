const express = require('express')
const users = express.Router();
const db = require('../database/db');

users.get("/", (req,res) => {
  var targetUser = db.ref('user_info/' + req.query.uid);
  targetUser.once("value", function(snapshot){
    res.end(JSON.stringify(snapshot.val()));
  })
})

users.post('/', (req,res) => {
    console.log('creating new user...');
    var ref = db.ref('user_info/'+req.query.uid);
    let userData = req.body
    console.log(userData);
    ref.transaction((currentData) => {
        if (currentData === null) {
          return userData;
        } else {
          console.log('User ID already exists.');
          return; // Abort the transaction.
        }
      }, (error, committed, snapshot) => {
        if (error) {
          console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
          console.log('Aborted the transaction (because user already exists).');
        } else {
          console.log('User  added!');
        }
        console.log("User's data: ", snapshot.val());
      }).then(result => {
        res.json({status: 200, message: 'User saved', data : result.id})
      }).catch(err => {
        res.json({status: 500, message: 'User not saved'})
    });
});

users.put('/', (req, res) => {
  let userToUpdate = db.ref('user_info/'+req.query.uid);
  userToUpdate.once("value", function(snapshot){
    newData = snapshot.val();
    userToUpdate.update(req.body);
  })
  res.status(200).json(req.body);
})

module.exports = users;