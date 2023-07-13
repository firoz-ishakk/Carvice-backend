const express = require("express")
const router = express.Router()
const authMiddlewares = require("../middlewares/authMiddlewares")
const mechaniccontroller = require("../controllers/mechanicController")


router.post("/mechaniclogin",mechaniccontroller.mechanicLogin)
router.get("/getmechworks/:id",authMiddlewares,mechaniccontroller.getWorks)

module.exports = router