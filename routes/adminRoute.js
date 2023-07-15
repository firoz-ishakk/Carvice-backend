const express = require("express")
const router = express.Router()
const admincontroller = require("../controllers/adminController")
const authMiddlewares = require("../middlewares/authAdminMiddleware")


router.post("/adminlogin",admincontroller.adminLogin)
router.post("/mechanicregistration",admincontroller.mechanicRegistration)
router.get("/mechaniclist",authMiddlewares,admincontroller.displayMechanic)
router.post("/mechanicedit",authMiddlewares,admincontroller.mechanicEdit)
router.post("/mechanicblock",authMiddlewares,admincontroller.mechanicBlock)
router.get("/userdetails",authMiddlewares,admincontroller.userList)
router.post("/block",authMiddlewares,admincontroller.userBlock)
router.get("/servicetable",authMiddlewares,admincontroller.serviceTable)
router.get("/getmechanic",authMiddlewares,admincontroller.mechanicService)
router.post("/updateservicetable/:id",authMiddlewares,admincontroller.updateStatusofservice)    
router.post("/assignmechanic/:id",authMiddlewares,admincontroller.mechAssign)    
// router.post("/cancellation/:id",authMiddlewares,admincontroller...)    
router.post("/getdone/:id",authMiddlewares,admincontroller.getDone)    

module.exports = router