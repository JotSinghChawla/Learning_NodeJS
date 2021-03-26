const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get( (req,res,next) => {
    Leaders.find({})
        .then( (leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Types','application/json');
            res.json(leader);
        })
        .catch( (err) => next(err) );
}) 

.post( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Leaders.create( req.body )
        .then( (leader) => {
            console.log('Leader Created: ',leader);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(leader);
        })
        .catch( err => next(err) );
})

.put( authenticate.verifyUser,  (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /leaders');
})

.delete( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Leaders.deleteMany({})
        .then( (response) => {
            console.log('All Leaders Deleted: \n',response);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(response);
        })
        .catch( err => next(err) );
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



leaderRouter.route('/:leaderId')

.get( (req,res,next) => {
    Leaders.findById( req.params.leaderId ) 
        .then( leader => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(leader);
        })
        .catch( err => next(err) );
}) 

.post( authenticate.verifyUser,  (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /leaders/' + req.params.leaderId );
})

.put( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    res.write('Updating the leader: ' + req.params.leaderId );
    Leaders.findByIdAndUpdate( req.params.leaderId, {
        $set: req.body
    }, {
        new: true,                            //  So that it returns the Updated dish as a JSON string in the reply
        useFindAndModify: false               // Because findByIdAndUpdate is deprecated
    })
        .then( leader => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(leader);
        })
        .catch( err => next(err) );
})

.delete( authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) => {
    Leaders.findByIdAndRemove( req.params.leaderId )
        .then( leader => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(leader);
        })
        .catch( err => next(err) );
}); 


module.exports = leaderRouter;