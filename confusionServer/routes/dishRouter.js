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
    // res.write('Updating the dish: ' + req.params.dishId );
    // Here res.write() can't be used - ?
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


                                                //   HANDLING COMMENTS ROUTES

dishRouter.route('/:dishId/comments')

.get( (req,res) => {
    Dishes.findById( req.params.dishId )
        .then( (dish) => {
            if( dish!=null ) {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish.comments);   
            }
            else {
                err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                err.statusCode = 404;
                return next(err);         // If we don't specify next() then it will be handled by express.    See app.js:47
            }

        }, (err) => next(err))                              // Only need to implement one
        .catch( (err) => next(err));                        // Only need to implement one
}) 

.post( (req,res) => {
    Dishes.findById( req.params.dishId )
        .then( (dish) => {
            if( dish!=null ) {
                dish.comments.push( req.body );
                dish.save()
                    .then( (dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(dish.comments);  
                    }, (err) => next(err));
            }
            else {
                err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                err.statusCode = 404;
                return next(err);         // If we don't specify next() then it will be handled by express.    See app.js:47
            }
        }, (err) => next(err))
        .catch( (err) => next(err));  
})

.put( (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete( (req,res) => {
    Dishes.findById( req.params.dishId )
        .then( (dish) => {
            if( dish!=null ) {
                for( let i = (dish.comments.length-1); i>=0 ; i--) {        // deleteMany can be only used on object JSON document
                    dish.comments.id(dish.comments[i]._id).remove();        // Becausse comments were saved in Arrays 
                }                                       // Here remove is working but delete or deleteMany is not  
                dish.save()
                    .then( (response) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(response);
                    }, (err) => next(err))
                    .catch( (err) => next(err)); 
            }
            else {
                err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch( (err) => next(err));  
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above




module.exports = dishRouter;