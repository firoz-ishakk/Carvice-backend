const Mechanic = require("../models/mechanicregmodel")
const bcrypt = require("bcrypt");
const mechanicWork = require("../models/mechanicmodel")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongodb').ObjectId;



const mechanicLogin = async(req,res)=>{
    const body = req.body
    const mechanic = await Mechanic.findOne({email:req.body.email})
    if(!mechanic){
       res  
       .status(200) 
       .send({message:"Mechanic doesn't exist"})
    }
    if(await bcrypt.compare(req.body.password,mechanic.password)){
        const token = jwt.sign({
            name:mechanic.name,mechanicid:mechanic._id
        },process.env.JWT_SECRET,{expiresIn: "1hr"})
        res 
        .status(200)
        .send({message:"Mechanic successfully logged in" , success:true, data:token})
    }
   
}

const getWorks = async(req,res)=>{
    try {
        const mechtoken = req.params.id
        const work = await mechanicWork.find({Mechanic_issued:mechtoken})

        res 
        .status(200)
        .send({data:work}) 
    } catch (error) {
        res 
        .status(500)
        .send({message:"Something went wrong"})
    }   
}

const changeStatus =async(req,res)=>{
    try {
        const status = req.body.status
    console.log(status)
    const mechId =req.params.id
    console.log(mechId,"id")
    const changeStatus = await mechanicWork.findByIdAndUpdate({_id:mechId},{
        $set:{
            status:status
        }
    })
    if(changeStatus){
        res
        .status(200)    
        .send({message:"updated successfully",data:changeStatus,success:true})
    }
    } catch (error) {
        res
        .status(500)    
        .send({message:"Something went wrong"})
    }
    
}

const amount =async(req,res)=>{
    try {
        const id = req.params.id
        const objectIdInstance = new ObjectId(id);
        console.log(id,"id")
        const payment = req.body.amount
        console.log(payment,"kiki")
        const amount = await mechanicWork.findByIdAndUpdate({_id:objectIdInstance},{
            $set:{
                amount:payment
            }
        })
        res 
        .status(200)    
        .send({message:"done",data:amount})
    } catch (error) {
        console.log(error)
    }
 
}

module.exports = {
    mechanicLogin,
    getWorks,
    changeStatus,
    amount
}