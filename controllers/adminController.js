const adminEmail = process.env.adminEmail
const adminPassword = process.env.adminPassword
const jwt = require("jsonwebtoken");
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



module.exports =  {
    adminLogin
}