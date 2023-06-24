const User = require("../models/userModel");
const Service = require("../models/servicesModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authmiddleware = require("../middlewares/authMiddlewares")

//registeration of user
const userRegister = async (req, res) => {
  try {
    console.log("sadasdasdasd");
    const existingUser = await User.findOne({ email: req.body.email });
    console.log(existingUser);
    if (existingUser) {
      console.log(existingUser, "the user exisits");
      return res
        .status(400)
        .send({ message: "the user exists", success: false });
    } else {
      console.log("adi");
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.mobilenumber,
        password: hashPassword,
        confirm: req.body.cpassword,
      });
      console.log(newUser, "hello");
      await newUser.save();
      res.status(200).send({ message: "new user registered", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong here bwoi", error });
  }
};
//user login
const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user,"asdasdasduser")
    if (!user) {
      res.status(400).send({ message: "user dose not exist", success: false });
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1hr",
        });
        
        res
          .status(200)
          .send({
            message: "successfully logged in",
            data: token,
            success: true,
            user
          });
      } else {
        res.status(400).send({ success: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong :(", error });
  }
};

const getUserById = async(req,res)=>{
  try {
    const user = await User.findOne({_id:req.body.userId})
    if(!user){
      res
      .status(200)
      .send({message:"user does not exist",success:false})
    }else{
     res
      .status(200)
      .send({message:"user exists",success:true,data:{
        name:user.name,
        email:user.email
      }})
    }
  } catch (error) {
    res
    .status(500)
    .send({message:"something went wrong"})
  }
}

const carService = async(req,res)=>{
  const service = await Service.findOne({name:req.body.name})
  try {
    if(service){
      console.log(service,"service is available")
      res
      .status(200)
      .send({message:"service available thru axios"})
    }else{
      const serviceAction = await Service({
        name : req.body.name,
        numberplate : req.body.numberplate,
        phone : req.body.number,
        address : req.body.address,
        pickup : req.body.pickup, 
        service  : req.body.service
      })
      res
      .status(200)
      .send({message:"done bwoi",success:true})
      const servicedatabase = await serviceAction.save()
    }
  } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({message:"failure in proceeding",error})
  }
  
};

module.exports = {
  userRegister,
  userLogin,
  carService,
  getUserById
};
