const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/dishes', (req,res,next) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type','text/plain');
    next();
});

app.get('/dishes', (req,res) => {
    res.end('THis is a Dishes Database static');
}); 
app.post('/dishes', (req,res) => {
    res.end('Will Post your request in dishes: '+ req.body.name + ' => ' +  req.body.description );
}); 
app.put('/dishes', (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
}); 
app.delete('/dishes', (req,res) => {
    res.end('Deleting all the Dishes!!!');
}); 

app.get('/dishes/:dishId', (req,res) => {
    res.end('THis is a Dishes Database static with Specifix Dish: ' + req.params.dishId);
}); 
app.post('/dishes/:dishId', (req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId );
}); 
app.put('/dishes/:dishId', (req,res) => {
    res.write('Updating the dish: ' + req.params.dishId );
    res.end('Will UPDATE your single dish request in dishes: '+ req.body.name + ' => ' +  req.body.description );
}); 
app.delete('/dishes/:dishId', (req,res) => {
    res.end('Deleting the Single Dish! with id = ' + req.params.dishId );
}); 

app.use(express.static(__dirname+'/public'));

app.use( (req,res,next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>')
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});