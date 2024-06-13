const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

let filmSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Actors: [String],
    createdAt: { type: Date, default: Date.now },
    Comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }]
    ,Rates:[{
        rate:Number,
        postedBy:{type:ObjectId,ref:"User"}
    }]
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Film'}]
});
  

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};


userSchema.methods.validatePassword = function(password) { // An example of an instance method - DON'T use arrow functions in such!
    return bcrypt.compareSync(password, this.Password);
};



let Film = mongoose.model('Film', filmSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Film;
module.exports.User = User;