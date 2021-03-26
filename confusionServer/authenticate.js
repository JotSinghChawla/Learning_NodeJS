                // We are using this file to store the authentication strategies used with PassportJS

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use( new LocalStrategy( User.authenticate() ) );         // Here this is going to be a Node module    
                // Here .authenticate() is a part of passport-local-mongoose, which will do the Authentication which is part of the Mongoose plugin 
                // If we are not using Mongoose plugin we have to write our own Authentication function

passport.serializeUser( User.serializeUser() );                         // - ? maybe in order to use session in our app.
passport.deserializeUser( User.deserializeUser() );                     // - ?

exports.getToken = function(user) {                         // Will create a new Token
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });                       // valid for 3600sec or 1 hour
}

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();      // Helps to include Token in every client request
options.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use( new JwtStrategy( options, (jwt_payload, done) => {
                                                        console.log('JWT_Payload: ', jwt_payload);
                                                        User.findOne({ _id: jwt_payload._id }, (err, user) => {
                                                            if (err) 
                                                                return done(err, false);
                                                            else if (user)
                                                                return done(null, user);
                                                            else
                                                                return done(null, false);
                                                        });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});        // Session is false because we won't be using it
                                                                        // Can be called anytime to verify Users

exports.verifyAdmin = ( req,res, next ) => {                        // You have to write res too even if you arn't using it 
    if ( req.user.admin )                                           // in order to work with next. Try remove res And it will show error
        return next();
    else {
        var err = new Error('You are not a Admin, You can not perform this Action!');
        err.status = 403;
        return next(err);
    }
};


// exports.verifyOrdinaryUser = function (req, res, next) {

//     var token = req.body.token;

//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 next();
//             }
//         });
//     } else {

//         var err = new Error('Seems that there is not a valid token! ' + token);
//         err.status = 403;
//         return next(err);
//     }
// };


                                                                