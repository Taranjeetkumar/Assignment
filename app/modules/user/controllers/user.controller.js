const { msg } = require('../../../../config/message');
const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const fs = require("fs");

generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

module.exports.test = function (req, res) {
    res.status(200).json({
        success: true,
        data: "Welcome to Assignment"
    })
}

// @desc    Register User
// @route   POST/api/v1/user/register
// access    Public
exports.postregister = asyncHandler(async (req, res, next) => {
    let { name, phone, email, password, latitude, longitude } = req.body;

    if (!/^[A-Za-z]+/.test(name)) throw { type: "name", error: "invalid name" };
    if (!password) throw { type: "password", error: "password cannot be empty" };

    const salt = await bcrypt.genSalt(10);
    let pass = password.toString();
    const hashedPassord = await bcrypt.hash(pass, salt);

    if (!phone && !email) {
        return next(new ErrorResponse(msg.emailOrPhoneRequired, 409));
    }

    let userExist = await User.findOne({ $or: [{ email: email }, { phone: phone }] });

    if (userExist) {
        return next(new ErrorResponse(msg.duplicatePhoneOrEmail, 409));
    }
    let response = await User.create({
        name: name,
        phone: phone,
        email: email,
        password: hashedPassord,
        latitude: latitude,
        longitude: longitude,
    });
    const token = response.getSignedJwtToken();//create token
    response = JSON.stringify(response);
    response = JSON.parse(response);

    delete response['password'];

    res.status(200).json({
        success: true,
        data: response,
        token
    });
});

// @desc    Login User
// @route   POST/api/v1/user/login
//access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { emailPhone, password } = req.body;
    let pass = password;
    if (!emailPhone || !password) {
        //validate phone and password
        return next(new ErrorResponse(msg.noPhoneOrPassword, 400));
    }
    let user = await User.findOne({ $or: [{ email: emailPhone }, { phone: emailPhone }], }).select("+password"); //check for user
    if (!user) {
        return next(new ErrorResponse(msg.unauthorizedLogin, 401));
    }
    const isMatch = await user.matchPassword(pass); //model method to match the hashed password with the password user has provided
    if (!isMatch) {
        return next(new ErrorResponse(msg.unauthorizedLogin, 401));
    }

    const token = user.getSignedJwtToken();
    user = JSON.stringify(user);
    user = JSON.parse(user);

    delete user["password"];

    res.status(200).json({
        success: true,
        data: user,
        token,
    });
});

// @desc    Get current logged in user
// @route   GET/api/v1/user/me
//access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user._id);

    user = JSON.stringify(user);
    user = JSON.parse(user);

    delete user["password"];


    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Find user near 10 km
// @route   GET/api/v1/user/find
//access    Private
exports.findUsersByFilter = asyncHandler(async (req, res, next) => {
    let page = parseInt(req.query.page) >= 1 ? parseInt(req.query.page) : 1,
        limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

    let user = await User.findById(req.user._id);
    console.log(user)

    let users = await User.find({
        point: {
            $near:
            {
                $geometry: {
                    type: "Point",
                    coordinates: [Number(user.longitude), Number(user.latitude)]
                },
                $maxDistance: 10000
            }
        }
    }).skip(limit * page - limit)
    .limit(limit);

res.status(200).json({
    success: true,
    data: users
});
});
