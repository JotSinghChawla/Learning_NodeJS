const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storageFunction = multer.diskStorage({
    destination: ( req, file, callback ) => {
        callback(null, 'public/images');                    // null (first parameter) tells us if there is any Error        
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);                                    // null (first parameter) tells us if there is any Error
    }
});

const imageFileFilter = (req, file, cb) => {
    if( !file.originalname.match(/\.(jpg|jpeg|png|gif|svg|PNG|JPG|JPEG|SVG|GIF)$/) ) {           // Regular expression
        return cb(new Error('You can upload only Image files!'), false);
    }
    else {
        cb(null, true);
    }
};

const upload = multer({ storage: storageFunction, fileFilter: imageFileFilter });           // configuring multer here

const uploadRouter = express.Router();
uploadRouter.use(express.json());

uploadRouter.route('/')
.options( cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
})

.get( cors.cors, (req,res) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on /imageUpload');
})

.post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res) => {
    
// app.post('/uploadmultiple', upload.array('imageFiles', 12), (req, res, next) => {       // TO upload Multiple files
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);         // It also contain the path of the file which can be used by Client

})

.put( cors.corsWithOptions, (req,res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /imageUpload');
})

.delete( cors.corsWithOptions, (req,res) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported on /imageUpload');
});

module.exports = uploadRouter;