const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: String,
        required: [true, "This field is Required"]
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        match: [/^\d{10}$/, 'Please add a valid mobile number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
    },
    point: {
        type: String,
        default: "2dsphere"
    },
    latitude: {
        type: Number,
        default: "",
    },
    longitude: {
        type: Number,
        default: ""
    },
}, {
    timestamps: true,
});


//Sign JWT and return 
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Match user entered password to hasheed password in database(will return T or F)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    console.log("Entered Password : ", enteredPassword);
    console.log(this.password);
    return await bcrypt.compare(enteredPassword, this.password);
}

//Match user entered otp to hashed otp inside the database(will return T or F)
UserSchema.methods.matchOtp = async function (enteredOtp, user) {
    console.log("Enter Otp:", enteredOtp);
    return await bcrypt.compare(enteredOtp, this.otpCode);
}


module.exports = mongoose.model('User', UserSchema);