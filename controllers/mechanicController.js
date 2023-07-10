const Mechanic = require("../models/mechanicRegModel")
const bcrypt = require("bcrypt");
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

module.exports = {
    mechanicLogin,

}