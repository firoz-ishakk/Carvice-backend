const express = require("express")
const router = express.Router()
const mechaniccontroller = require("../controllers/mechanicController")


router.post("/mechaniclogin",mechaniccontroller.mechanicLogin)

module.exports = router