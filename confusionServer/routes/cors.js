const express = require('express');
const cors = require('cors');

const app = express();

const whitelist = ['http://localhost:3000','http://localhost:3001', 'https://localhost:3443','https://jotsinghchawla.github.io' ,'http://Jot-Singh-Laptop:3000'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if( whitelist.indexOf( req.header('Origin')) !== -1 ) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback( null, corsOptions );
};

exports.cors = cors();                  // It will reply with Origin: *     ( accepting all cross-origin request )
exports.corsWithOptions = cors( corsOptionsDelegate );