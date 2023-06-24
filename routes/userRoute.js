const express = require("express")
const router = express.Router()
const usercontroller = require("../controllers/userController")
const authmiddleware = require("../middlewares/authMiddlewares")


router.post("/register",usercontroller.userRegister)
router.post("/login",usercontroller.userLogin)
router.post("/get-user-info-by-id",authmiddleware,usercontroller.getUserById)
router.post("/service",usercontroller.carService)



module.exports = router