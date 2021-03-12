const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Promos Database static');
}) 

.post( (req,res) => {
    res.end('Will Post your request in Promotions: '+ req.body.name + ' => ' +  req.body.description );
})

.put( (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /promotions');
})

.delete( (req,res) => {
    res.end('Deleting all the Promotions!!!');
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



promoRouter.route('/:promoId')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Promotions Database static with Specific Promo: ' + req.params.promoId);
}) 

.post( (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /promotions/' + req.params.promoId );
})

.put( (req,res) => {
    res.write('Updating the promo: ' + req.params.promoId );
    res.end('\nWill UPDATE your single promo request in promotions: '+ req.body.name + ' => ' +  req.body.description );
})

.delete( (req,res) => {
    res.end('Deleting the Single Promo! with id = ' + req.params.promoId );
}); 


module.exports = promoRouter;