const Mechanic = require("../models/mechanicRegModel")
const bcrypt = require("bcrypt");
const mechanicWork = require("../models/mechanicModel")
const jwt = require("jsonwebtoken")

const mechanicLogin = async(req,res)=>{
    const body = req.body
    console.log(body,'dad baadii'); 
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
        // console.log(mechtoken,"asd")
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

module.exports = {
    mechanicLogin,
    getWorks

}