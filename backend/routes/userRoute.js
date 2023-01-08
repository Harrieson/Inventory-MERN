const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logoutUser, getUser } = require("../controllers/useController")

// const registerUser = () => {}
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/getuser", getUser)

module.exports = router