const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}


//Register User

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    //Validate the given params
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all the required fields")
    }
    if (password.length < 10) {
        res.status(400)
        throw new Error("Password must be 10 or more characters")
    }
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("This email is already in use")
    }

    // Password Encryption

    const user = await User.create({
        name,
        email,
        password
    })


    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//Login a user


const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
        //Validate request
    if (!email || !password) {
        res.status(400)
        throw new Error("Invalid User data")
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User not found")
    }

    //user now exists, check password

    const correctPassword = await bcrypt.compare(password, user.password)
    const token = generateToken(user._id)

    //Send HTTP-only cookie


    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    if (user && correctPassword) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or Password. ")
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    })
    return res.status(200).json({ message: "Successfully Logged out" })
})

const getUser = asyncHandler(async(req, res) => {
    res.send("Here you're Sucker!!")
})


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}