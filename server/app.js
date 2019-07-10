const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// url routes 
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const uploadRouter = require('./routes/upload');

// MongoDB database
const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/memedb";
const options = {
  useNewUrlParser: true 
}

let database;
let memedb; 
let id = 0;

// express setup
const app = express();

/** Initially creates the MongoDB database **/
mongoClient.connect(url, options, function(err, db) {
    if (err) throw err;
    console.log("Database has been created!");

    let dbo = db.db("memedb");
    dbo.createCollection("memes", function(err, res){
        if (err) throw err;
        console.log("Meme Collection created!");
    });
    database = dbo;
    memedb = database.collection("memes");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/test', usersRouter);
app.post('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// upload router to send an entry to the database
function upload(req, res){
  memeId = "meme_"+ id;
  let params = req.body;
  let fields = populateMemeFields(params.photoURL, params.topText, params.bottomText, params.user);
  sendToDatabase(memeId, fields);
  res.redirect('/');
}

// helper function created to create a meme object in the database with its fields 
function sendToDatabase(memeId, fields){
  memedb.insertOne(fields, function(err, res){
    if (err) throw err; 
    console.log("Uploaded fields for " + memeId);
  });
}

// helper function to create & populate the JSON that will be sent to the database
function populateMemeFields(photoURL, topText, bottomText, user){
  let memeObj = {
    id: id,
    photoURL: photoURL,
    topText: topText,
    bottomText: bottomText,
    user: user,
    likes: 0
  }

  // increments id so each meme has a unique ID
  id++;
  return memeObj;
}

module.exports = app;
