const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

module.exports = {admin, db, functions};