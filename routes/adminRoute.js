const express = require("express")
const router = express.Router()
const admincontroller = require("../controllers/adminController")
// const authMiddlewares = require("../middlewares/authMiddlewares")


router.post("/adminlogin",admincontroller.adminLogin)

module.exports = router