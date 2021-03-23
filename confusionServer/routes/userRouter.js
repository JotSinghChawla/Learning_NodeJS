
var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use( bodyParser.json() );

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register( new User({ username: req.body.username}), req.body.password, (err, user) => {
    if( err ) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'Registration Successful!'});
      });
    }
  });
});

  // User.findOne({ username:  req.body.username })              // After implementing Passport-local
  //   .then( (user) => {
  //     if( user!=null ) {
  //       var err = new Error('User ' + req.body.username + ' already exists !!!');
  //       err.status = 403;
  //       next(err);
  //     }
  //     else {
  //       return User.create({ 
  //         username: req.body.username,
  //         password: req.body.password
  //       });
  //     }
  //   })
  //   .then( user => {
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type', 'application/json');
  //     res.json({ status: 'Registration Successful!', user: user });
  //   }, err => next(err) )
  //   .catch( err => next(err) );
// });

router.post('/login', passport.authenticate('local'), (req, res, next) => {   // Rrror handling will ne done by .authenticate() 
                                                                              // method as it acts as middleware here
 
  var token = authenticate.getToken({ _id: req.user._id });           // Created a Jwt Token & This token strategy can also 
                                                                      // be used with third party authentication like Oauth

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  // res.json({ success: true, status: 'You are Successfully logged in!'});
  res.json({ success: true, token: token, status: 'You are Successfully logged in!'});
});
  
  // if( !req.session.user) {                                           // After implementing Passport-local
  //   var authHeader = req.headers.authorization;
  //   if( !authHeader ) {
  //     var err = new Error('You are not Authenticated!');
  //     res.setHeader('WWWW-Authenticate', 'Basic');
  //     err.status = 401;
  //     return next(err);
  //   }
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  //   var username = auth[0];
  //   var password = auth[1];
  //   User.findOne({username: username})
  //     .then( user => {
  //       if( username === null ) {
  //         var err = new Error('User: ' + username + ' does not exists!');
  //         err.status = 403;
  //         return next(err);
  //       }
  //       else if( user.password !== password ) {
  //         var err = new Error('Password is incorrect!');
  //         err.status = 403;
  //         return next(err);
  //       }
  //       else if( user.username === username && user.password === password) {
  //         req.session.user = 'user_authenticated';
  //         res.statusCode = 200;
  //         res.setHeader('Content-Type', 'text/plain');
  //         res.end('You are Authenticated!');
  //       }
  //     })
  //     .catch( err => next(err) );  
  // }
  // else {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('You are already Authenticated!');
  // }
// });

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
