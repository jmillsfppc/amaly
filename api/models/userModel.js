const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [true, 'A username is required'],
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : [true, 'Please provide email'],
        unique : true,
        lowercase :  true,
        trim : true
    },
    firstname : {
        type : String,
        trim : true
    },
    lastname : {
        type : String,
        trim : true
    },
    phone : {
        type : String
    },
    password : {
        type : String,
        select : false
    },
    confirmPassword : {
        type : String
    },
    photo:{
        type : String
    },
    about : {
        type : String
    },
    city : {
        type : String
    },
    country : {
        type : String
    },
    language : {
        type : Array
    },
    links : {
        type : {String}
    },
    status : {
        type : String,
        default : 'pending'
    },
    seller : {
        type : Boolean,
        default : false,
    },
    lastUpdate : {
        type : Date,
    },
    activationCode : {
        type : String,
        select: false
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }

},
{
    toJSON : { virtuals: true},   // this tells Mongoose to output the virtuals as part of data sent on GET method
    toObject : { virtuals: true}  // this tells Mongoose to output the virtuals as part of data sent on GET method
}
);


userSchema.pre('save', function(next){
    this.username = this.username[0].toUpperCase() + this.username.substring(1).toLowerCase();
    if(this.firstname){
        this.firstname = this.firstname[0].toUpperCase() + this.firstname.substring(1).toLowerCase();
    }
    if(this.lastname){
        this.lastname = this.lastname[0].toUpperCase() + this.lastname.substring(1).toLowerCase();
    }

    next();
    
})



const User = mongoose.model('User', userSchema);
module.exports = User