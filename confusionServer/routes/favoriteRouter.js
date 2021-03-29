const express = require('express');
// const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(express.json());

favoriteRouter.route('/')

.get( cors.cors, authenticate.verifyUser, ( req, res, next ) => {
    Favorite.find({ user: req.user._id })
    .populate( 'user dishes' )                  // populate both user and dishes path
        .then( (fav) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(fav);
        }, (err) => next(err))
        .catch( (err) => next(err));  
})

.post( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
// Here new: true is a OPTION which helps to return New Updated Data & upsert: true helps to make a new document if nothing founded. 
// So that we don't have to use Create method. We also used $push OPTION to push the given field 
// I have changed $push to $addToSet as it checks if unique value is added or not
    Favorite.findOneAndUpdate( { user: req.user._id }, { $addToSet: { dishes: req.body } }, { new: true, upsert: true } )
        .then( (fav) => {
            Favorite.findById( fav._id )
            .populate('user dishes')
                .then( fav => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(fav);
                })
                .catch( (err) => next(err));
        }, (err) => next(err))
        .catch( (err) => next(err));
})

.put( cors.corsWithOptions, authenticate.verifyUser, ( req, res ) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorite');
})

.delete( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
    Favorite.findOneAndDelete({ user: req.user._id })
        .then( (fav) => {
            Favorite.findById( fav._id )
            .populate('user dishes')
                .then( fav => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(fav);
                })
                .catch( (err) => next(err));
        }, (err) => next(err))
        .catch( (err) => next(err));  
});

favoriteRouter.route('/:dishId')
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get( cors.cors, authenticate.verifyUser, ( req, res, next ) => {
    Favorite.findOne({ user: req.user._id })
        .then( favorite => {
            if( !favorite ) {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                return res.json({ "exists": false, "favorites": favorite });
            }
            else {
                if( favorite.dishes.indexOf( req.params.dishId ) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    return res.json({ "exists": false, "favorites": favorite });
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    return res.json({ "exists": true, "favorites": favorite });
                }
            }
        }, err => next(err) )
        .catch( err => next(err) );
})

.post( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
// Here new: true is a OPTION which helps to return New Updated Data & upsert: true helps to make a new document if nothing founded. 
// So that we don't have to use Create method. We also used $push OPTION to push the given field 
// I have changed $push to $addToSet as it checks if unique value is added or not
    Favorite.findOneAndUpdate( { user: req.user._id }, { $addToSet: { dishes: req.params.dishId } }, { new: true, upsert: true } )
        .then( (fav) => {
            Favorite.findById( fav._id )
            .populate('user dishes')
                .then( fav => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(fav);
                })
                .catch( (err) => next(err));
        }, (err) => next(err))
        .catch( (err) => next(err));
})

.put( cors.corsWithOptions, authenticate.verifyUser, ( req, res ) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorite/:dishId');
})

.delete( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
    // Here $pull helps us to find & remove the give field
    Favorite.findOneAndUpdate({ user: req.user._id }, { $pull: { dishes: req.params.dishId }}, {new: true})
        .then( fav => {
            Favorite.findById( fav._id )
            .populate('user dishes')
                .then( fav => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(fav);
                })
                .catch( (err) => next(err));  
        }, (err) => next(err))
        .catch( (err) => next(err));  
                                        // This is a long method to remove the favorite Dish
        // index = favorite.dishes.indexOf(req.params.dishId);
        //     if (index > -1) {
        //         favorite.dishes.splice(index, 1);
        //         favorite.save()                          // .save() helps us to save changes in current Mongoose field
        //             .then((favorite) => {
        //                 console.log('User _id: ' + req.user._id + ' favorite removed ', favorite);
        //                 res.statusCode = 200;
        //                 res.setHeader('Content-Type', 'application/json');
        //                 res.json(favorite);
        //             }, (err) => next(err));
})

module.exports = favoriteRouter;