
var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');

var router = express.Router();

router.use( bodyParser.json() );

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username:  req.body.username })
    .then( (user) => {
      if( user!=null ) {
        var err = new Error('User ' + req.body.username + ' already exists !!!');
        err.status = 403;
        next(err);
      }
      else {
        return User.create({ 
          username: req.body.username,
          password: req.body.password
        });
      }
    })
    .then( user => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Successful!', user: user });
    }, err => next(err) )
    .catch( err => next(err) );
});

router.post('/login', (req, res, next) => {
  if( !req.session.user) {
    var authHeader = req.headers.authorization;
    if( !authHeader ) {
      var err = new Error('You are not Authenticated!');
      res.setHeader('WWWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username: username})
      .then( user => {
        if( username === null ) {
          var err = new Error('User: ' + username + ' does not exists!');
          err.status = 403;
          return next(err);
        }
        else if( user.password !== password ) {
          var err = new Error('Password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if( user.username === username && user.password === password) {
          req.session.user = 'user_authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are Authenticated!');
        }
      })
      .catch( err => next(err) );  
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already Authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if( req.session ) {
    req.session.destroy();                              // Shutdown current session
    res.clearCookie('session-id');                      // Clear cookies
    res.redirect('/');                                  // Redirect the User
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);  
  }
});

module.exports = router;
