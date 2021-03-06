const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer( (req,res) => {
    console.log( 'Request for ' + req.url + ' by method ' + req.method );

    if( req.method == 'GET') {
        var fileUrl;
        if( req.url == '/') fileUrl = '/index.html'
        else fileUrl = req.url;

        var filePath = path.resolve('./public'+fileUrl);
        const fileExt = path.extname(filePath);
        if( fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if( !exists ) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Error 404: ' + fileUrl + ' at ' + filePath + ' File not Found');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            })

        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Error 404: ' + fileUrl + ' at ' + filePath + ' File is not an HTML File');
            return;
        }
    }
    else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error 404: ' + req.method + ' is not supported');
        return;
    }
})

server.listen(port, hostname, () => {
    console.log(`Serving is running at $http://${hostname}:${port}`);
})