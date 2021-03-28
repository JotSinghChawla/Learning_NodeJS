const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(express.json());

dishRouter.route('/')
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get( cors.cors, (req,res,next) => {
    Dishes.find({})
    .populate( 'comments.author' )
        .then( (dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dishes);   

        }, (err) => next(err))                              // Only need to implement one
        .catch( (err) => next(err));                        // Only need to implement one
}) 

.post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    Dishes.create( req.body )
        .then( (dish) => {
            console.log('Dish Created: ',dish);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
})

.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})

.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {             // Here .verifyUser() act as a middleware for POST operation
    Dishes.deleteMany({})
        .then( (response) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(response);

        }, (err) => next(err))
        .catch( (err) => next(err));  
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



dishRouter.route('/:dishId')
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get( cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate( 'comments.author' )
        .then( (dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
        .catch( (err) => next(err));  
}) 

.post( cors.corsWithOptions, authenticate.verifyUser, (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId );
})

.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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

.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get( cors.cors, (req,res,next) => {
    Dishes.findById( req.params.dishId )
    .populate( 'comments.author' )
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

.post( cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {            // When we verify user here, The Passport-JWT would have loaded 
                                                         // user info. into the req.body.user 
    Dishes.findById( req.params.dishId )
        .then( (dish) => {
            if( dish!=null ) {
                req.body.author = req.user._id;                 // So here we can add reference of the ObjectId of user 
                dish.comments.push( req.body );
                dish.save()
                    .then( (dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')                    // We need to populate the response dish again 
                            .then( dish => {
                                res.statusCode = 200;
                                res.setHeader('Content-type', 'application/json');
                                res.json(dish.comments);
                            }, (err) => next(err));
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

.put( cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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


dishRouter.route('/:dishId/comments/:commentId')
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get( cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate( 'comments.author' )
        .then( (dish) => {
            if( dish!=null && dish.comments.id( req.params.commentId )!=null ) {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish.comments.id( req.params.commentId));   
            }
            else if( dish == null ) {
                err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                err.statusCode = 404;
                return next(err);         // If we don't specify next() then it will be handled by express.    See app.js:47
            }
            else {
                err = new Error( 'Comment ' + req.params.commentId + ' not found !!');
                err.statusCode = 404;
                return next(err);   
            }
        }, (err) => next(err))                              // Only need to implement one
        .catch( (err) => next(err));                        // Only need to implement one
}) 

.post( cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId );
})

.put( cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    // res.write('Updating the dish:' + req.params.dishId + ' with Comment: ' + req.params.commentId );
    // Here res.write() can't be used - ?
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            const id1 = req.user._id;                           // Checking if the current User is same as the Comment author
            const id2 = dish.comments.id( req.params.commentId ).author;                // Here author contains ObjectID      
            if( id1.equals(id2) ) {
                if( dish!=null && dish.comments.id( req.params.commentId )!=null ) {
                    if( req.body.rating ) {
                        dish.comments.id( req.params.commentId ).rating = req.body.rating;
                    }

                    if( req.body.comment ) {
                        dish.comments.id( req.params.commentId ).comment = req.body.comment;             
                    }

                    dish.save()
                        .then( (dish) => {
                            Dishes.findById( dish._id)
                            .populate('comments.author')                     // We need to populate the response dish again
                                .then( dish => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(dish.comments.id( req.params.commentId ));
                                }, (err) => next(err)); 
                        }, (err) => next(err))     
                        .catch( (err) => next(err));
                }
                else if( dish == null ) {
                    err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                    err.statusCode = 404;
                    return next(err);         // If we don't specify next() then it will be handled by express.    See app.js:47
                }
                else {
                    err = new Error( 'Comment ' + req.params.commentId + ' not found !!');
                    err.statusCode = 404;
                    return next(err);   
                }
            }
            else {
                err = new Error( 'You are not allowed to Edit this comment!!' );
                    err.statusCode = 403;
                    return next(err);  
            }
        }, (err) => next(err))     
        .catch( (err) => next(err));  
})

.delete( cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            const id1 = req.user._id;                           // Checking if the current User is same as the Comment author
            const id2 = dish.comments.id( req.params.commentId ).author;            // Here author contains ObjectID
            if( id1.equals(id2) ) {
                if( dish!=null && dish.comments.id( req.params.commentId )!=null ) {
                    dish.comments.id(req.params.commentId).remove();      
                    dish.save()
                        .then( (response) => {
                            Dishes.findById( response._id)          // Doesn't that comment get removed - ??  how is it still finding the comment here - ??
                            .populate('comments.author')                    // We need to populate the response dish again
                                .then( dish => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(dish);
                                }, (err) => next(err)); 
                        }, (err) => next(err))
                        .catch( (err) => next(err)); 
                }
                else if( dish == null ) {
                    err = new Error( 'Dish ' + req.params.dishId + ' not found !!');
                    err.statusCode = 404;
                    return next(err);         // If we don't specify next() then it will be handled by express.    See app.js:47
                }
                else {
                    err = new Error( 'Comment ' + req.params.commentId + ' not found !!');
                    err.statusCode = 404;
                    return next(err);   
                }
            }
            else {
                err = new Error( 'You are not allowed to Delete this comment!!' );
                    err.statusCode = 403;
                    return next(err);  
            }
        }, (err) => next(err))     
        .catch( (err) => next(err));  
}); 



module.exports = dishRouter;