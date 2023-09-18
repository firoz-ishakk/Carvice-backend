const express = require("express")
const router = express.Router()
const usercontroller = require("../controllers/userccontroller")
const authmiddleware = require("../middlewares/authMiddlewares")


//api for user
router.post("/register",usercontroller.userRegister)
router.post("/login",usercontroller.userLogin)
router.post("/get-user-info-by-id",authmiddleware,usercontroller.getUserById)
router.post("/service",authmiddleware,usercontroller.carService)
router.post("/mechanic",authmiddleware,usercontroller.mechanicService)
router.post("/edituser",authmiddleware,usercontroller.editUser)
router.get("/mechanichistory",authmiddleware,usercontroller.mechHistory)
router.get("/servicehistory",authmiddleware,usercontroller.serviceHistory)
router.get("/sendotp/:otp",usercontroller.otp)
router.post("/cancellation/:id",authmiddleware,usercontroller.cancellation)
router.post('/payment/:id',usercontroller.payment)
router.post('/paymentofservice/:id',usercontroller.paymentofservice)

module.exports = router