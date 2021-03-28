var mongoose = require('mongoose');
// const { use } = require('../routes');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    // username: {                              // Will added by the Passport-Local-Mongoose 
    //     type: String,
    //     required: true,
    //     unique: true    
    // },
    // password: {
    //     type: String,
    //     required: true 
    // },
    firstname: {
        type: String, 
        default: ''
    },
    lastname: {
        type: String, 
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
