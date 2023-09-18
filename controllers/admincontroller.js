const adminEmail = process.env.adminEmail
const adminPassword = process.env.adminPassword
const mechRegistration = require("../models/mechanicregmodel")
const Service = require("../models/servicesmodel")
const MechanicService = require("../models/mechanicmodel")
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const adminLogin = async(req,res)=>{

    const adminData = req.body
    try {
        const email = req.body.email
        const password = req.body.password
        if(email === adminEmail && password === adminPassword){
            const token = jwt.sign({ id:1 }, process.env.JWT_SECRET, {
                expiresIn: "1hr",
              });
            res
            .status(200)
            .send({message:"admin logged in", success:true,data:token,adminData})
        }else{
            res
            .status(200)
            .send({message:"Wrong credentials", success:false})
        }
    } catch (error) {
        res
        .status(500)
        .send({message:"something went wrong"})
    }
   
}

const mechanicRegistration = async(req,res)=>{
    try {
        const registration = await mechRegistration.findOne({email:req.body.email})
    if(registration){
        res    
        .status(200)
        .send({message:"mechanic exists",success:false})
    }else{
        const password = req.body.password
        const securepassword = await bcrypt.hash(password,10)
        const mechanic = new mechRegistration({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address,
            password:securepassword 
        })
        mechanic.save()
        res
        .status(200)
        .send({message:"mechanic Registered",success:true})
    }
    } catch (error) {
        res
        .status(200) 
        .send({message:"something went wrong"}) 
    }
}

const displayMechanic = async(req,res)=>{
    const mechDetails = await mechRegistration.find()
    res
    .status(200)
    .send({message:"got",data:mechDetails})
}

const mechanicEdit = async(req,res)=>{
    try {
        const id = req.body._id
        const editMechanic = await mechRegistration.findByIdAndUpdate(id,{
            $set:{
                name:req.body.name,
                address:req.body.address,
                phone:req.body.phone
            }
        },{new:true})
        res
        .status(200)
        .send({message:"successfully edited",success:true})
        await editMechanic.save()
    } catch (error) {
        res
        .status(200) 
        .send({message:"something went wrong"}) 
    }
 
}

const mechanicBlock = async(req,res)=>{
    const data = req.body
   
    const id = data[0]._id
    try {
        const block = await mechRegistration.findByIdAndUpdate(id,{access : false},{new:true})
        block.save()
            res 
            .status(200)
            .send({message:"Mechanic Blocked",success:true})
    } catch (error) {
        res 
        .status(400)
        .send({message:"something went wrong"})
    }
    
}

const userList = async(req,res)=>{
    try {
        const userlist = await User.find()
        res 
        .status(200)
        .send({message:"ok",data:userlist})
    } catch (error) {
        res
        .status(200) 
        .send({message:"something went wrong"}) 
    }
   
}

const userBlock = async(req,res)=>{
    try {
        const body = req.body
    const id = body[0]._id
    
    const userblock = await User.findByIdAndUpdate(id,
        {access:false}
        ,{new:true})
        if(userblock){
            res
            .status(200)
            .send({message:"User Blocked",success:true})
        }else{
            res 
            .status(200)
            .send({message:"Blocking failure",success:false})
        }
    } catch (error) {
        
       res
       .status(200) 
       .send({message:"something went wrong"}) 
    }
    
}

const serviceTable = async(req,res)=>{
    try {
        
        const service = await Service.find().populate("user")
        res 
        .status(200)    
        .send({data:service})
    } catch (error) {
        res 
        .status(500)    
        .send({message:"Something went wrong"})
    }
   
}

const updateStatusofservice = async(req,res)=>{
    try {
    const id = req.params.id

    const serviceUpdate = await Service.findByIdAndUpdate(id,{
        $set:{
            status:req.body.status
        }
    })
    res
    .status(200)
    .send({data:serviceUpdate.status})
    
    } catch (error) {
        
    }
    
} 

const mechanicService = async(req,res)=>{
    try {
        const services = await MechanicService.find().populate("user").populate("Mechanic_issued")
    res
    .status(200)
    .send({data:services})
    } catch (error) {
        res
        .status(500)    
        .send({message:"Something went wrong"})
    }
}

const mechAssign = async(req,res)=>{
    try {

    const userId = req.params.id

    const assign = await MechanicService.findByIdAndUpdate({_id:userId},{
        $set:{
            Mechanic_issued : req.body.status
        }
    })
    res 
    .status(200)
    .send({message:"Assigned", data:assign})
    // const pushMech = await mechRegistration.findByIdAndUpdate({_id})
    } catch (error) {
       
        res
        .status(500)    
        .send({message:"something went wrong"})
    }
}

const getDone = async(req,res)=>{
    try {
        const userId = req.params.id
       
        const status = req.body.status
        
        const done = await MechanicService.findByIdAndUpdate({_id:userId},{
            $set:{
                status:status
            }
        })
        res
        .status(200)
        .send({message:"Update successful",
            data:done})
    } catch (error) {
        res
        .status(500)    
        .send({message:"something went wrong"})
    }
   
}

const userunBlock = async(req,res)=>{
    const id = req.params.id
    
    const body = req.body
    
    const unblock = await User.findByIdAndUpdate({_id:id},
        {access:true},
        {new:true}
    )
    if(unblock){
        res
        .status(200)    
        .send({message:"unblocked"})
    }
}

const adminusercount = async(req,res)=>{
    try {
        const usercount = await User.count([
            {$group:
                {
                   _id : "$_id"
                }
            }
        ])
        res 
        .status(200)    
        .send({message:"",data:usercount})
    } catch (error) {
        res
        .status(500)
        .send({message:"something went wrong"})
    }
   
}

const adminservicecount = async(req,res)=>{
    try {
        const serviceCount = await Service.countDocuments(
        {
                "service" : "carservice"
        }
    )
        const washCount = await Service.countDocuments(
        {
                "service" : "carwash"
        }
    )
    res 
    .status(200)    
    .send({data:serviceCount,data1:washCount})
    } catch (error) {
    res
    .status(200)    
    .send({message:"Something went wrong"})
    }
}

const mechanicCount = async(req,res)=>{
    const count = await mechRegistration.count([
    {$group:
            {
            _id:"$_id"
            }
    }
    ])
    res 
    .status(200)
    .send({data:count})
}

const mechanicWorksCount = async(req,res)=>{
    const count = await MechanicService.count([
        {$group:{
            _id:"_id"
        }}
    ])
    res
    .status(200)
    .send({data:count})
} 

const totalRevenue = async(req,res)=>{
    console.log("hi")
    const count = await Service.aggregate([{
        $group:

        {
           _id:null, total:{$sum:"$totalamount"}
        }
    }])
    const serviceRevenue = count[0].total

    const count2 = await MechanicService.aggregate([{
        $group:{
            _id:null,total:{
                $sum:"$amount"
            }
        }
    }])
    const mechanicRevenue = count2[0].total  
    const total = serviceRevenue+mechanicRevenue
    res 
    .status(200)
    .send({data:total})
}


module.exports =  {
    adminLogin,
    mechanicRegistration,
    displayMechanic,
    mechanicEdit,
    mechanicBlock,
    userList,
    userBlock,
    serviceTable ,
    updateStatusofservice ,
    mechanicService,
    mechAssign,
    getDone,
    userunBlock,
    adminusercount,
    adminservicecount,
    mechanicCount,
    mechanicWorksCount,
    totalRevenue
}
