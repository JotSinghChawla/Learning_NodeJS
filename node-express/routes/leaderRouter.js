const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Leaders Database static');
}) 

.post( (req,res) => {
    res.end('Will Post your request in Leaders: '+ req.body.name + ' => ' +  req.body.description );
})

.put( (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /leaders');
})

.delete( (req,res) => {
    res.end('Deleting all the Leaders!!!');
});             // Semicolon here is necessary & We have done the chaining of REST verbs up above



leaderRouter.route('/:leaderId')

.all( (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get( (req,res) => {
    res.end('THis is a Leaders Database static with Specific leader: ' + req.params.leaderId);
}) 

.post( (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /leaders/' + req.params.leaderId );
})

.put( (req,res) => {
    res.write('Updating the leader: ' + req.params.leaderId );
    res.end('\nWill UPDATE your single leader request in leaders: '+ req.body.name + ' => ' +  req.body.description );
})

.delete( (req,res) => {
    res.end('Deleting the Single Leader! with id = ' + req.params.leaderId );
}); 


module.exports = leaderRouter;