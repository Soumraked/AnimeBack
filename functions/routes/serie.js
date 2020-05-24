const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

const isEmpty = (string) => {
  if(string.trim() === '') return true;
  else return false;
}

// Method in charge of registering a new series.
app.post('/create', (req, res) => {
  const newSerie = {
    name: req.body.name,
    language: req.body.language,
    subtitles: req.body.subtitles,
    dateOrigin: req.body.dateOrigin,
    description: req.body.description,
    finished: req.body.finished,
    coverImage: req.body.coverImage,
    thumbnailImage: req.body.thumbnailImage,
    chapterImage: req.body.chapterImage,
    id: (req.body.name.toString().toLowerCase()).replace(/\s+/g, ''),
    dateUpload: new Date(Date.now()),
    chapter: {},
    genres: req.body.genres,
    type: req.body.type   
  };

  if(newSerie.finished === "true") newSerie.finished = true;
  else if(newSerie.finished === "false") newSerie.finished = false;
  else newSerie.finished = "Undefined";
  
  let errors = {};
  if(isEmpty(newSerie.name)) errors.name = 'Must no be empty';
  if(isEmpty(newSerie.language)) errors.language = 'Must no be empty';
  if(isEmpty(newSerie.subtitles)) errors.subtitles = 'Must no be empty';
  if(isEmpty(newSerie.dateOrigin)) errors.dateOrigin = 'Must no be empty';
    else newSerie.dateOrigin = new Date(newSerie.dateOrigin);
  if(isEmpty(newSerie.description)) errors.description = 'Must no be empty';
  if(newSerie.finished === "Undefined") errors.finished = 'Must be true or false';
  if(isEmpty(newSerie.coverImage)) errors.coverImage = 'Must no be empty';
  if(isEmpty(newSerie.thumbnailImage)) errors.thumbnailImage = 'Must no be empty';
  if(isEmpty(newSerie.chapterImage)) errors.chapterImage = 'Must no be empty';
  if(isEmpty(newSerie.type)) errors.type = 'Must no be empty';

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/series/${newSerie.id}`).get()
    .then((doc) => {
      if(doc.exists){
        res.status(400).json({message: 'This series is already created'});
      }else{
        db.collection('series').doc(newSerie.id).set(newSerie);
        return res.status(200).json({message: 'Successfully created series'});
      }
    })
    .catch(err => {
      return res.status(500).json({error: err.code});
    })
});

// Method in charge of obtaining a series through its identifier.
app.get('/get/:id', (req, res) => {
    db.collection('series').doc(req.params.id).get()
    .then(doc => {
      if(doc.exists){
        res.status(200).json({data: doc.data()});   
      }
      res.status(400).json({mensaje: 'This serie is not created.'});
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
  
});

// Method in charge of obtaining a series through its identifier.
app.get('/exist/:id', (req, res) => {
  db.collection('series').doc(req.params.id).get()
  .then(doc => {
    if(doc.exists){
      res.status(200).json({data: true});   
    }
    res.status(200).json({data: false});
  })
  .catch(err => {
    res.status(500).json({error: err});
  })

});

// Method in charge of obtaining all the series.
app.get('/get', (req, res) => {
  db.collection('series').get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        var dataAux = doc.data()
        dataAux.id = doc.id;
        data.push({data: dataAux});
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

// Method in charge of updating a series.
app.put('/update', (req, res) => {
  let user = {};

  if(req.body.name) user.name = req.body.name;
  if(req.body.language) user.language = req.body.language;
  if(req.body.subtitles) user.subtitles = req.body.subtitles;
  if(req.body.dateOrigin) user.dateOrigin = new Date(req.body.dateOrigin);
  if(req.body.description) user.description = req.body.description;
  if(req.body.finished){
    if(req.body.finished === "true") user.finished = true;
    else if(req.body.finished === "false") user.finished = false;
  }
  if(req.body.coverImage) user.coverImage = req.body.coverImage;
  if(req.body.thumbnailImage) user.thumbnailImage = req.body.thumbnailImage;
  if(req.body.chapterImage) user.chapterImage = req.body.chapterImage;
  if(req.body.dateUpload) user.dateUpload = new Date(Date.now());
  if(req.body.genres) user.genres = req.body.genres;
  if(req.body.type) user.type = req.body.type;
  const id = req.body.id;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series is not exist'});
    }else{
      db.collection('series').doc(id).update(user);
      return res.status(200).json({message: 'Successfully updated series'});
      //return res.status(200).json({day: user.dateOrigin.getDate(), Month: user.dateOrigin.getMonth()+1, Year: user.dateOrigin.getFullYear()});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of deleting a series.
app.delete('/delete', (req, res) => {
  const id = req.body.id;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      db.collection('series').doc(id).delete();
      return res.status(200).json({message: 'Successfully deleted series.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

app.post('/report', (req, res) => {

});

module.exports = app;