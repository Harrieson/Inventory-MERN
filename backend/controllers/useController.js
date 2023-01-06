const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")



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
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})


module.exports = {
    registerUser,
}