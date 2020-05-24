const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

app.post('/create', (req, res) => {
  const nick = req.body.nick.toString().toLowerCase();
  const nickname = req.body.nick;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const position = req.body.position;
  
  if(password != passwordConfirm){
    return res.status(201).json({message: 'Passwords do not match.'});
  }
  
  db.doc(`/users/${nick}`).get()
  .then((doc) => {
    if(!doc.exists){
      db.collection('users').doc(nick).set({nick, nickname , password, position});
      return res.status(200).json({message: 'User successfully entered.'});
    }else{
      return res.status(202).json({message: 'Nickname already used.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

app.post('/login', (req, res) => {
  const nick = req.body.nick.toString().toLowerCase();
  const password = req.body.password;
  
  db.doc(`/users/${nick}`).get()
  .then((doc) => {
    if(doc.exists){
      if(password == doc.data().password){
        return res.status(200).json({message: 'Login', nickname: doc.data().nickname, position: doc.data().position});
      }
      return res.status(203).json({message: 'Wrong password, try again.'});
    }else{
      return res.status(203).json({message: 'User entered does not exist, try again.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

app.get('/get', (req, res) => {
  db.collection('users').get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data().nick);
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});
module.exports = app;