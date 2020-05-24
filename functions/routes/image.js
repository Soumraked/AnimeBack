const express = require('express');
const app = express.Router();

const firebase = require('firebase');
var config = {
  apiKey: "AIzaSyDNEbX8fm2dt3hK9wjIOrjJYzPLH28suz0",
  authDomain: "monosotakos.firebaseapp.com",
  databaseURL: "https://monosotakos.firebaseio.com",
  projectId: "monosotakos",
  storageBucket: "monosotakos.appspot.com",
  messagingSenderId: "667258395120",
  appId: "1:667258395120:web:5c444c5b3297bbae32a535",
  measurementId: "G-6L5X0ETW8V"
};
firebase.initializeApp(config);

const {admin, db} = require('../utils/init');

app.post('/upload/:folder/:name', (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers});

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.params.name}.${imageExtension}`;;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      destination: `${req.params.folder}/${imageFileName}`,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${req.params.folder}%2F${imageFileName}?alt=media`;
      return res.status(200).json({ url: imageUrl});
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err.code});
    })
  });
  busboy.end(req.rawBody);
});


module.exports = app;