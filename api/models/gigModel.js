const mongoose = require('mongoose');


const gigSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'Gig must belong to a user']
    },
    title : {
        type : String,
        required : [true, ' Every Gig must have a title'],
        trim : true
    },
    category : {
        type : String,
        required : [true, 'Gig must belong to a category']
    },
    subcategory : {
        type : String,
        required : [true, 'Gig must belong to a subcategory']
    },
    description : {
        type : String,
        required : [true, 'Please provide a gig description']
    },
    gallery : {
        type : [Object],
        // required : [true, 'Gig must belong to a subcategory']
    },
    packages : {
        type : Array,
        required : [true, 'Gig must have packages']
    },
    faqs : {
        type : Array,
    },
    tags : {
        type : Array,
    },
    rating : {
        type : Number,
        default : 0
    },
    avgRating : {
        type : Number,
        default : 4.0
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    }
});


const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig