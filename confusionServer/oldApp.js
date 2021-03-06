var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var Filestore = require('session-file-store')(session);                 // (session)   ???
var passport = require('passport');
var authenticate = require('./authenticate');
// var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');                          // IDK why it is used

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
// const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then( (db) => {
  console.log('Connect correctly to the Server');
}, (err) => console.log(err) );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-01234-54321'));               // Random Signed Cookie

app.use(session({                            // As we are using JWT instead
  name: 'session-id',
  secret: '12345-67890-01234-54321',
  saveUninitialized: false,
  resave: false,
  store: new Filestore()
}));

app.use(passport.initialize());
app.use(passport.session());                  // As we are using JWT instead

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth( req, res, next ) {
  console.log(req.headers , "  \nCookies: " , req.signedCookies, "  \nSession: " , req.session, );

  // if (!req.signedCookies.user) {
  // if ( !req.session.user) {
    if ( !req.user ) {                               // After implementing Passport-local 
    // var authHeader = req.headers.authorization; 
    // if (!authHeader) {
      var err = new Error('You are not Authenticated!');
      // res.setHeader('WWW-Authenticate', 'Basic'); 
      err.status = 403;
      return next(err);
       
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  //   var username = auth[0];
  //   var password = auth[1];

  //   if (username === 'admin' && password === 'password') {
  //     // res.cookie('user', 'superuser', { signed: true });
  //     req.session.user = 'superuser';
  //     next();                                                       // Will Pass the request to Next Middleware
  //   }
  //   else {
  //     var err = new Error('Invalid Username/Password');

  //     res.setHeader('WWW-Authenticate', 'Basic');
  //     err.status = 401;
  //     return next(err);
  //   }
  }
  else {
    // if (req.signedCookies.user == 'superuser') {
    next();
    // if (req.session.user === 'user_authenticated') {               // After Passport-local
    //   next();
    // }
    // else {
    //   var err = new Error('You are not authenticated:  Invalid Cookie');
    //   // res.setHeader('WWW-Authenticate', 'Basic');
    //   err.status = 403;
    //   return next(err);
    // }                                                              // After Passport-local
  }

}

app.use(auth);      // Function

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
