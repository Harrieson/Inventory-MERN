const express = require("express")
const router = express.Router()
const { registerUser } = require("../controllers/useController")

// const registerUser = () => {}
router.post("/register", registerUser)

module.exports = router