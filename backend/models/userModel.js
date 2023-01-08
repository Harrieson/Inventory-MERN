const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a username"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        mmatch: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter a password to login"],
        minLength: [10, "Password must be more than 10 characters"]
    },
    photo: {
        type: String,
        // required: [true, "Please select an image to upload"],
        default: ""
    },
    phone: {
        type: String,
        default: "254"
    },
    bio: {
        type: String,
        minLength: [180, "Please write more elaborate bio info"],
        maxLength: [300]
    }
}, {
    timestamps: true
})
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next()
    }
    //Hash the password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})
const User = mongoose.model('user', userSchema)
module.exports = User