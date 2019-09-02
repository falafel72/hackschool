const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const qs = require('qs');
const config = require('./config.json');

// url routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// MongoDB database
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/memedb";
const options = {
  useNewUrlParser: true
}

let database;
let memedb;

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
app.post('/upload', upload);
app.get('/getmemes', getMemes);
app.post('/likememe', likeMeme);
app.get('/test',test);

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
  const params = req.body;
  const apiData = {
    template_id: params.template_id,
    username: config.username,
    password: config.password,
    boxes: params.memeTexts.map((text) => {
      return { "text": text };
    })
  };

  const url = 'https://api.imgflip.com/caption_image';

  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(apiData)
  })
    .then((response) => {
      if (response.data.success){
        const fields = populateMemeFields(response.data.data.url, params.topText, params.bottomText, params.user);
        sendToDatabase(fields);
        res.status(200).send({
          success: true,
          url: response.data.data.url
        });
      } else{
        console.log("Unsuccessful call to the imgflip API");
        console.log(response.data.error_message);
        res.status(404).send({
          success: false,
          error_message: response.data.error_message
        });
      }
    })
    .catch( (err) => { throw err; } );

}

// getMemes router which sends the meme data to the front-end
function getMemes(req, res){
  let query = {};
  memedb.find(query).toArray(function(err, result){
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
}

// likememe router which updates the amount of likes a meme has
function likeMeme(req, res){
  const params = req.body;
  const likeIncrement = (params.isBolded ? -1 : 1);

  const response = {
    isBolded: !params.isBolded,
    likes: (params.likes + likeIncrement)
  };

  // increments like count of the actual meme object
  const query = {"_id": new mongo.ObjectID("" + params.id + "") };
  memedb.updateOne( query, { $set: { likes: response.likes, isBolded: response.isBolded } });

  res.send(response);
}

// helper function created to create a meme object in the database with its fields
function sendToDatabase(fields){
  memedb.insertOne(fields, function(err, res){
    if (err) throw err;
  });
}

// helper function to create & populate the JSON that will be sent to the database
function populateMemeFields(photoURL, topText, bottomText, user){
  let memeObj = {
    photoURL: photoURL,
    topText: topText,
    bottomText: bottomText,
    user: user,
    likes: 0,
    isBolded: false
  };

  // increments id so each meme has a unique I
  return memeObj;
}

module.exports = app;
