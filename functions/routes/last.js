const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

app.get('/get', (req, res) => {
  db.collection('last').get()
    .then(snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({data: doc.data()});
      })
      res.status(200).json(data.reverse());
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

app.get('/get/:number', (req, res) => {
  db.collection('last').get()
    .then(snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({data: doc.data()});
      })
      res.status(200).json((data.reverse()).slice(0,req.params.number));
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

module.exports = app;