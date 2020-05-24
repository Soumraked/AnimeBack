const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

// Method in charge of creating the series chapter.
app.post('/create', (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  const link = req.body.link;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(!keys.includes(number)){
        chapter[number] = link;
        db.collection('series').doc(id).update({chapter: chapter});
        db.collection('series').doc(id).get()
          .then(data => {
            db.collection('last').doc(((new Date()).getTime()).toString()).set({serie: id, chapter: number, thumbnail: data.data().thumbnailImage});
          })
          .catch(err => {
            console.log(err);
          })
        
        return res.status(200).json({message: 'Chapter successfully entered.'});
      }
      return res.status(400).json({message: 'This chapter already exist.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of creating the series chapter.
app.post('/create2', (req, res) => {
  const id = req.body.id;
  const chapters = req.body.chapters;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      var isUpdate = false;
      var lastUpdate = [];
      for(let i in chapters){
        if(!keys.includes(chapters[i][0])){
          isUpdate = true;
          lastUpdate.push(chapters[i][0]);
          chapter[chapters[i][0]] = chapters[i][1];
        }
      }
      if(isUpdate){
        db.collection('series').doc(id).update({chapter: chapter});
        db.collection('series').doc(id).get()
        .then(data => {
          db.collection('last').doc(((new Date()).getTime()).toString()).set({serie: id, name: data.data().name, number: lastUpdate[lastUpdate.length-1], image: data.data().chapterImage});
        })
        .catch(err => {
          console.log(err);
        });
        return res.status(200).json({message: 'Chapter successfully entered.'});
      }else{
        return res.status(400).json({message: 'This chapter already exist.'});
      }
      
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of updating a chapter.
app.put('/update', (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  const link = req.body.link;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(keys.includes(number)){
        chapter[number] = link;
        db.collection('series').doc(id).update({chapter: chapter});
        return res.status(200).json({message: 'Chapter successfully updated.'});
      }
      return res.status(400).json({message: 'This chapter does not exist.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of deleting a chapter.
app.delete('/delete', (req, res) => {
  const id = req.body.id;
  const number = req.body.number;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(keys.includes(number)){
        delete chapter[number];
        db.collection('series').doc(id).update({chapter: chapter});
        return res.status(200).json({message: 'Chapter successfully deleted.'});
      }
      return res.status(400).json({message: 'This chapter does not exist.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of obtaining all chapters.
app.get('/get/:id', (req, res) => {
  const id = req.params.id;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(keys.length > 0){
        let data = [];
        let keysSort = keys.sort();
        for(let i in keysSort){
          //data.push({number: keysSort[i], url: chapter[keysSort[i]]});
          data.push(keysSort[i]);
        }
        return res.status(200).json({data: data, name: doc.data().name});
      }
      return res.status(400).json({message: 'This series has no episodes.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

// Method in charge of obtaining a chapter.
app.get('/get/:id/:number', (req, res) => {
  const id = req.params.id;
  const number = req.params.number;

  db.doc(`/series/${id}`).get()
  .then((doc) => {
    if(!doc.exists){
      res.status(400).json({message: 'This series does not exist.'});
    }else{
      var chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(keys.length > 0){
        if(keys.includes(number)){
          return res.status(200).json({ link: chapter[number], name: doc.data().name});
        }else{
          return res.status(400).json({message: 'This chapter does not exist.'});
        }
      }
      return res.status(400).json({message: 'This series has no episodes.'});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err.code});
  })
});

module.exports = app;