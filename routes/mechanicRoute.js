const express = require("express")
const router = express.Router()
const authMiddlewares = require("../middlewares/authMechanicMiddleware")
const mechaniccontroller = require("../controllers/mechanicontroller")


router.post("/mechaniclogin",mechaniccontroller.mechanicLogin)
router.get("/getmechworks/:id",authMiddlewares,mechaniccontroller.getWorks)
router.post("/changestatus/:id",authMiddlewares,mechaniccontroller.changeStatus)
router.post("/amount/:id",mechaniccontroller.amount)

module.exports = router