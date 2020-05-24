const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const fileUpload = require('express-fileupload');


const app = express();

//Cloud Functions
const {functions, db, admin} = require('./utils/init');
//-------------------------

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/image', require('./routes/image'));
app.use('/serie', require('./routes/serie'));
app.use('/chapter', require('./routes/chapter'));
app.use('/last', require('./routes/last'));
app.use('/report', require('./routes/report'));

app.use('/getApi', require('./routes/getApi'));
app.use('/auth', require('./routes/auth'));

// // Middleware para Vue.js router modo history
// const history = require('connect-history-api-fallback');
// app.use(history());
// app.use(express.static(path.join(__dirname, 'public')));

// app.set('puerto', process.env.PORT || 3000);
// app.listen(app.get('puerto'), () => {
//   console.log('Example app listening on port '+ app.get('puerto'));
// });

exports.api = functions.https.onRequest(app);