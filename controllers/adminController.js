const adminEmail = process.env.adminEmail
const adminPassword = process.env.adminPassword
const mechRegistration = require("../models/mechanicRegModel")
const Service = require("../models/servicesModel")
const MechanicService = require("../models/mechanicModel")
const User = require("../models/userModel");
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
        console.log(error)
        res
        .status(400)
        .send({message:"something went wrong"})
    }
   
}

const mechanicRegistration = async(req,res)=>{
    console.log(req.body)
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
            phone:req.body.password,
            address:req.body.address,
            password:securepassword 
        })
        mechanic.save()
        res
        .status(200)
        .send({message:"mechanic Registered",success:true})
    }
    } catch (error) {
        console.log(error)
        console.log("something went wrong")
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
        console.log(req.body,"SsSsada")
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
        console.log(error,"error")
    }
 
}

const mechanicBlock = async(req,res)=>{
    const data = req.body
    console.log(data,"andi putt")
    const id = data[0]._id
    console.log(id,"wyat")
    try {
        const block = await mechRegistration.findByIdAndUpdate(id,{access : false},{new:true})
        block.save()
            res 
            .status(200)
            .send({message:"Mechanic Blocked",success:true})
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
   
}

const userBlock = async(req,res)=>{
    try {
        const body = req.body
    const id = body[0]._id
    console.log(id)
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
        console.log(error)
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
        console.log(error)
    }
   
}

const updateStatusofservice = async(req,res)=>{
    try {
        console.log(req.params,'yandi')
    const id = req.params.id
    console.log(req.body,"sadaweqsdqwe")
    const serviceUpdate = await Service.findByIdAndUpdate(id,{
        $set:{
            status:req.body.status
        }
    })
    res
    .status(200)
    .send({data:serviceUpdate.status})
    // serviceUpdate.save()
    console.log(serviceUpdate)
    } catch (error) {
        
    }
    
} 

const mechanicService = async(req,res)=>{
    try {
        const services = await MechanicService.find().populate("user")
    console.log(services,"the mechanic service is here")
    res
    .status(200)
    .send({data:services})
    } catch (error) {
        
    }
    

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
    mechanicService
}