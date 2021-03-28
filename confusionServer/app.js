var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var Filestore = require('session-file-store')(session);                 // (session)   ???
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');                          // IDK why it is used

// const Dishes = require('./models/dishes');

// const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const connect = mongoose.connect(url);
// mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });    // IDK why it can be used

connect.then( (db) => {
  console.log('Connect correctly to the Server');
}, (err) => console.log(err) );

var app = express();

app.all('*', (req, res, next) => {                    // This is used to Redirect all request to Secure Server
  if( req.secure ) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);   // secPort is register in www.js in /bin folder 
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-01234-54321'));               // Random Signed Cookie

// app.use(session({                            // As we are using JWT instead
//   name: 'session-id',
//   secret: '12345-67890-01234-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new Filestore()
// }));

app.use(passport.initialize());
// app.use(passport.session());                  // As we are using JWT instead

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

// The User Verification is done in very Route JS file  using the method .verifyUser() from ./authenticate.js 

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorite', favoriteRouter);

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

module.exports = app;
