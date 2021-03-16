const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

.get( (req,res) => {
    Dishes.find({})
        .then( (dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dishes);   

        }, (err) => next(err))                              // Only need to implement one
        .catch( (err) => next(err));                        // Only need to implement one
}) 

.post( (req,res) => {
    Dishes.create( req.body )
        .then( (dish) => {
            console.log('Dish Created: ',dish);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
})

.put( (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})

.delete( (req,res) => {
    Dishes.deleteMany({})
        .then( (response) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(response);

        }, (err) => next(err))
        .catch( (err) => next(err));  
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



dishRouter.route('/:dishId')

.get( (req,res) => {
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
}) 

.post( (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId );
})

.put( (req,res) => {
    res.write('Updating the dish: ' + req.params.dishId );
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true,                            //  So that it returns the Updated dish as a JSON string in the reply
        useFindAndModify: false               // Because findByIdAndUpdate is deprecated
    })
        .then( (dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
})

.delete( (req,res) => {
    Dishes.findByIdAndRemove(req.params.dishId)
        .then( (dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
        
}); 


module.exports = dishRouter;