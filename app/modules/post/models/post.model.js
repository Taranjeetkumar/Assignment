const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: String,
        required: [true, "This field is Required"]
    },
    userId: {
        type: String,
       ref:'User'
    },
   
}, {
    timestamps: true,
});


module.exports = mongoose.model('Post', PostSchema);