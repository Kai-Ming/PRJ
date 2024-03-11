const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const roles = require("../roles");

// @desc    Register new user
// @route   POST /api/user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, thirdParty } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userExists = await User.findOne({ email });

    // Handle already existing user

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            thirdParty: thirdParty
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            thirdParty: user.thirdParty,
            token: generateToken(user.id),
        });
    } catch (error) {
        //Catch validation error if form data is invalid
        res.status(400);
        throw error;
    }
});

// @desc    Log in existing user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                })
                .status(200);
            return;
        }
    }

    res.status(401);
    throw new Error("Invalid credentials");
});

// @desc    Edit user data
// @route   PATCH /api/user/
// @access  Private
const editUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const currentUser = await User.findOne({ _id: req.user.id });

    let salt;
    let hashedPassword = currentUser.password;

    if (password) {
        salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { name: name, password: hashedPassword }
    );

    res.status(200).json({
        _id: user._id,
        name: user.name
    });
});

// @desc    Get existing user data
// @route   GET /api/user/profile
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(
        req.user.id
    );

    res.status(200).json({
        id: _id,
        name,
        email
    });
});

const createSubUser = asyncHandler()

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_VALID_FOR,
    });
};

const changeUserRole = asyncHandler(async (req, res) => {
    const { roles, thirdPartyId } = req.body;
    if (!roles) {
        res.status(400);
        throw new Error("Please enter role");
    }
    if (!roles[roles]) {
        res.status(400);
        throw new Error("Invalid role");
    }
    try {
        if (req.user.type != 'third') {
            const thirdParty = await User.findById(thirdPartyId);
            if (thirdParty) {
                thirdParty.roles = roles;
                await thirdParty.save();
                res.json({
                    _id: thirdParty.id,
                    name: thirdParty.name,
                    email: thirdParty.email,
                    roles: thirdParty.roles,
                });
            } else {
                res.status(404);
                throw new Error("Third party not found");
            }
        }
        else {
            res.status(403);
            throw new Error("Unauthorized to change role");
        }
    } catch (error) {
        res.status(400);
        throw error;
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUser,
    editUser,
    changeUserRole,
};