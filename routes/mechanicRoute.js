const express = require("express")
const router = express.Router()
const authMiddlewares = require("../middlewares/authMechanicMiddleware")
const mechaniccontroller = require("../controllers/mechanicController")


router.post("/mechaniclogin",mechaniccontroller.mechanicLogin)
router.get("/getmechworks/:id",authMiddlewares,mechaniccontroller.getWorks)
router.post("/changestatus/:id",authMiddlewares,mechaniccontroller.changeStatus)

module.exports = router