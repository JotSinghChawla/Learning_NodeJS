                // We are using this file to store the authentication strategies used with PassportJS

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

exports.local = passport.use( new LocalStrategy( User.authenticate() ) );         // Here this is going to be a Node module    
                // Here .authenticate() is a part of passport-local-mongoose, which will do the Authentication which is part of the Mongoose plugin 
                // If we are not using Mongoose plugin we have to write our own Authentication function

passport.serializeUser( User.serializeUser() );                         // - ? maybe in order to use session in our app.
passport.deserializeUser( User.deserializeUser() );                     // - ?




