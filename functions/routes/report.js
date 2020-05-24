const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

app.post('/create', (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  const message = req.body.message;
  
  db.doc(`/report/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      let chapters = {};
      chapters[number] = [message];
      db.collection('report').doc(id).set({chapters});
      return res.status(200).json({message: 'Report successfully entered.'});
    }else{
      let chapters = doc.data().chapters;
      if(chapters[number]){
        if(!(chapters[number]).includes(message)){
          chapters[number].push(message);
        }
      }else{
        chapters[number] = [message];
      }
      db.collection('report').doc(id).update({chapters});
      return res.status(200).json({message: 'Report successfully entered.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

app.get('/get', (req, res) => {
  db.collection('report').get()
    .then(snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        var auxData = doc.data();
        auxData.serieId = doc.id;
        data.push({data: auxData});
      })
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

app.delete('/delete', (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  db.collection('report').get()
    .then(snapshot => {
      let exist = true;
      snapshot.forEach(doc => {
        if(doc.data().id === id  && doc.data().chapter === number){
          db.collection('report').doc(doc.id).delete();
          res.status(200).json({mensaje: 'Successfully deleted report.'});
          exist = false;
        }
      })
      if(exist){
        res.status(400).json({message: 'This report does not exist.'});
      }
    })
    .catch((err) => {
      res.status(500).json({mensaje: err});
    });
});

app.delete('/deleteById', (req, res) => {
  const id = req.body.id;
  db.collection('report').doc(id).get()
    .then(doc => {
      if(doc.exists){
        db.collection('report').doc(id).delete();
        res.status(200).json({mensaje: 'Successfully deleted report.'});
      }else{
        res.status(400).json({message: 'This report does not exist.'});
      }
    })
    .catch((err) => {
      res.status(500).json({mensaje: err});
    });
});


module.exports = app;