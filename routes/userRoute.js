const express = require("express")
const router = express.Router()
const usercontroller = require("../controllers/userController")
const authmiddleware = require("../middlewares/authMiddlewares")

//api for user
router.post("/register",usercontroller.userRegister)
router.post("/login",usercontroller.userLogin)
router.post("/get-user-info-by-id",authmiddleware,usercontroller.getUserById)
router.post("/service",authmiddleware,usercontroller.carService)
router.post("/mechanic",authmiddleware,usercontroller.mechanicService)
router.post("/edituser",authmiddleware,usercontroller.editUser)
router.get("/servicehistory",authmiddleware,usercontroller.serviceHistory)
router.get("/sendotp/:otp",usercontroller.otp)
router.post("/cancellation/:id",usercontroller.cancellation)



module.exports = router