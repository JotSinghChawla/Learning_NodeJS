const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')

.get( (req,res,next) => {
    Promotions.find({})
        .then( (promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Types','application/json');
            res.json(promotion);
        })
        .catch( (err) => next(err) );
}) 

.post( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Promotions.create( req.body )
        .then( (promotion) => {
            console.log('Promotion Created: ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(promotion);
        })
        .catch( err => next(err) );
})


.put( authenticate.verifyUser,  (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /promotions');
})

.delete( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Promotions.deleteMany({})
        .then( (response) => {
            console.log('All Promotions Deleted: \n',response);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(response);
        })
        .catch( err => next(err) );
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



promotionRouter.route('/:promoId')

.get( (req,res,next) => {
    Promotions.findById( req.params.promoId ) 
        .then( promotion => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(promotion);
        })
        .catch( err => next(err) );
}) 

.post( authenticate.verifyUser,  (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /Promotions/' + req.params.promoId );
})

.put( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    res.write('Updating the promotion: ' + req.params.promoId );
    Promotions.findByIdAndUpdate( req.params.promoId, {
        $set: req.body
    }, {
        new: true,                            //  So that it returns the Updated dish as a JSON string in the reply
        useFindAndModify: false               // Because findByIdAndUpdate is deprecated
    })
        .then( promotion => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(promotion);
        })
        .catch( err => next(err) );
})

.delete( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Promotions.findByIdAndRemove( req.params.promoId )
        .then( promotion => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(promotion);
        })
        .catch( err => next(err) );
}); 


module.exports = promotionRouter;