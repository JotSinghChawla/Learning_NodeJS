const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Dishes Database static');
}) 

.post( (req,res) => {
    res.end('Will Post your request in dishes: '+ req.body.name + ' => ' +  req.body.description );
})

.put( (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})

.delete( (req,res) => {
    res.end('Deleting all the Dishes!!!');
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



dishRouter.route('/:dishId')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Dishes Database static with Specific Dish: ' + req.params.dishId);
}) 

.post( (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId );
})

.put( (req,res) => {
    res.write('Updating the dish: ' + req.params.dishId );
    res.end('\nWill UPDATE your single dish request in dishes: '+ req.body.name + ' => ' +  req.body.description );
})

.delete( (req,res) => {
    res.end('Deleting the Single Dish! with id = ' + req.params.dishId );
}); 


module.exports = dishRouter;