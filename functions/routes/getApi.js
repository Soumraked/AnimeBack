const express = require('express');
const app = express.Router();

const {db} = require('../utils/init');

const getDate = (dateInput, option) => {
  let date = new Date(dateInput._seconds*1000);
  if(option === 1){ //Only year
    return date.getFullYear().toString();
  }else if(option === 2){ //Complete date
    let dateString = '';
    let day = date.getDate().toString();
    let month = (date.getMonth()+1).toString();
    let year = date.getFullYear().toString();

    if(day.length === 1){
      dateString += '0'+day;
    }else{
      dateString += day;
    }
    if(month.length === 1){
      dateString += '-0'+month+'-';
    }else{
      dateString += '-'+month+'-';
    }
    dateString += year;
    return dateString;
  }
};

const inEmition = (option) =>{
  if(option){
    return 'Finalizado.';
  }else if(!option){
    return 'En emisión.';
  }
};

// Method in charge of obtaining all the series.
// Return id, thumbnail, name, type and date origin of the series in alphabetical order.
app.get('/getSerie', (req, res) => {
  db.collection('series').get()
    .then((snapshot) => {
      let data = [];
      let dataAux = {};
      let date;
      snapshot.forEach((doc) => {
        dataAux = {};
        dataAux.id = doc.id;
        dataAux.image = doc.data().thumbnailImage;
        dataAux.name = doc.data().name;
        dataAux.type = doc.data().type;
        dataAux.year = getDate(doc.data().dateOrigin, 1);
        data.push(dataAux);
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

// Method in charge of obtaining a series through its identifier.
app.get('/getSerie/:id', (req, res) => {
  db.collection('series').doc(req.params.id).get()
  .then(doc => {
    if(doc.exists){
      let data = {};
      data.cover = doc.data().coverImage;
      data.thumbnail = doc.data().thumbnailImage;
      data.name = doc.data().name;
      data.description = doc.data().description;
      data.date = getDate(doc.data().dateOrigin, 2);
      data.status = inEmition(doc.data().finished);
      data.subtitles = doc.data().subtitles;
      data.genres = doc.data().genres;

      let chapter = doc.data().chapter;
      var keys = Object.keys(chapter);
      if(keys.length > 0){
        let dataChapter = [];
        let keysSort = keys.sort();
        for(let i in keysSort){
          dataChapter.push({number: keysSort[i]});
        }
        data.chapter = dataChapter;
      }else{
        data.chapter = [];
      }

      return res.status(200).json(data);   
    }else{
      return res.status(400).json({mensaje: 'This serie is not created.'});
    }
  })
  .catch(err => {
    res.status(500).json({error: err});
  })

});


app.get('/getGenres', (req, res) => {
  db.collection('series').get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        for(let i in doc.data().genres){
          if(!data.includes(doc.data().genres[i])){
            data.push(doc.data().genres[i]);
          }
        }
      });
      res.status(200).json(data.sort());
    })
    .catch((err) => {
      res.status(502).json({mensaje: err});
    });
});

module.exports = app;