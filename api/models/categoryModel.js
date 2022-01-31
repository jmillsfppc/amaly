const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    category : {
        type: String,
        unique: true,
        required : [true, 'Category must have a name']
    },
    subcategories : {
        type : Object,
        required : [true, 'Please provide subcategories']
    },
    tags : {
        type: Array
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
});


categorySchema.pre('save', function(next){
    // capitalize each word of this.name
    const words = this.category.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    this.category = words.join(" ");

    next();

})

const Category = mongoose.model("Category", categorySchema);
module.exports = Category