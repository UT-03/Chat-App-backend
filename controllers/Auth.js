const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const HttpError = require("../utils/HttpError");

const signup = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        // If inputs are invalid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Invalid inputs passed, please check your data.', 406);
        }

        // Extracting data from req body
        const { name, email, password } = req.body;

        // Searching any existing user with same email
        const existingUser = await User.findOne({ email: email });

        // If user already exists
        if (existingUser) {
            throw new HttpError('User already exists, Please login instead', 406);
            // return next(new HttpError('User exists already, please login instead.', 406));
        }

        // Else => Hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Creating new User
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Saving new user in DB
        await newUser.save();

        // Generating token
        const token = jwt.sign(
            { userId: newUser._id },
            `${process.env.SECRET_TOKEN}`
        );

        // sending new user creation status response
        res
            .status(201)
            .json({
                token: token,
                userId: newUser.id
            })

    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
};

const login = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        // Extracting user data from req body
        const { email, password } = req.body;

        // Searching if a user with this email exists or not
        const existingUser = await User.findOne({ email: email });

        // If user does not exist
        if (!existingUser) {
            throw new HttpError('User does not exist, please try Sign-up instead.', 404);
        }

        // Else => checking password is correct
        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        // If password is incorrect
        if (!isValidPassword) {
            throw new HttpError('Invalid credentials, could not log you in.', 406);
        }

        // Else => Generating token
        const token = jwt.sign(
            { userId: existingUser._id },
            `${process.env.SECRET_TOKEN}`
        );

        // Sending success response
        res
            .status(200)
            .json({
                token: token,
                userId: existingUser._id
            })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
};

module.exports = {
    signup,
    login
}