var express = require('express');
// const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
const users = require('../models/users');
const cors = require('./cors');

var router = express.Router();
router.use( express.json() );

router.options( '*', cors.corsWithOptions, (req, res) => {
   res.sendStatus(200);
});

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
    .then( users => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    })
    .catch( err => next(err) );
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register( new User({ username: req.body.username}), req.body.password, (err, user) => {
    if( err ) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    }
    else {
      if( req.body.firstname )
        user.firstname = req.body.firstname;
      if( req.body.lastname )
        user.lastname = req.body.lastname;
      user.save( (err, user) => {
        if( err ) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!'});
        });
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

router.post('/login', cors.corsWithOptions, (req, res, next) => {   
      // Error handling will be done by .authenticate() method as it acts as middleware here
  passport.authenticate('local', ( err, user, info ) => {     // Here if user doesn't exists it will not count as error
    if( err )
      return next(err);

    if( !user ) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ success: false, status: 'Invalid Username/ Password!', err: info });
    }

    else {
      req.logIn( user, err => {

        if( err ) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in User !' });    
        }

        var token = authenticate.getToken({ _id: req.user._id });       // Created a Jwt Token & This token strategy can also 
                                                  // be used with third party authentication like Oauth to save Access Token
      
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are Successfully Logged in!'});
      });
    }
  }) (req, res, next);                  // This is necessary IDK why?
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

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if( req.user ) {
    var token = authenticate.getToken({ _id: req.user.id });    // After this, we don't need Access Token, we can use JWT token
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.json({ success: true, token: token, status: 'You are Successfully Logged in!'});
    
  }
});

router.get('/checkjwttoken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if( err ) 
      return next(err);

    if( !user ) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ success: false, status: 'JWT token invalid!', err: info });
    }

    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ success: true, status: 'JWT token valid!', user: user });
    }
  }) (req, res, next);                  // This is necessary IDK why?
});

module.exports = router;
