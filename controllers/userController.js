const User = require("../models/userModel");
const Service = require("../models/servicesModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mechanic = require("../models/mechanicModel")
const otpHelper = require("../util/otp");
// const authmiddleware = require("../middlewares/authMiddlewares")


let data = {}
//registeration of user
const userRegister = async (req,res) => {
  console.log(req.body,"dfdsf")
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log(existingUser, "the user exisits");
      console.log("gfdhgfd")
       res
        .status(200)
        .send({ message: "This user exists", success: false });
    } else {
      data = req.body
      const phone = data.phone;
      otpHelper.sendOtp(phone);
      console.log("gfdhgfd")
       res
      .status(200)
      .send({message:"ok",success:true})
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Something went wrong here", error });
  }
};
//user login
const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    console.log(user,"user")
    console.log(user.access,"sadsad")
    const access = user.access
    if (!user) {
      res
      .status(200)
      .send({ message: "user does not exist", success: false });
    } 
    else {
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
            user,
            success: true,
          });
      } else {
        res
        .status(200)
        .send({message:"wrong creds", success:false})
        console.log("something went wrong")
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
    .status(400)
    .send({message:"something went wrong"})
  }
}

const carService = async(req,res)=>{
  try {
    
      console.log(req.body)
      const serviceAction = await Service({
        name : req.body.name,
        numberplate : req.body.numberplate,
        phone : req.body.number,
        address : req.body.address,
        pickup : req.body.pickup, 
        service  : req.body.service,
        user : req.body.userid
      })
        await User.findByIdAndUpdate(req.body.userid,{
          $push: {Mybookings:serviceAction._id}
        })

      res
      .status(200)
      .send({message:"done bwoi",success:true})
      const servicedatabase = await serviceAction.save()
    // }
  } catch (error) {
    console.log(error)
    res
    .status(500)
    .send({message:"failure in proceeding",error})
  }
  
};

const mechanicService = async(req,res)=>{
  const id = req.body.userid
  try {
    const mechanicData = new Mechanic({
      name : req.body.name,
      carname: req.body.carname,
      numberplate : req.body.carnumber,
      phone : req.body.number,
      address: req.body.address,
      user : req.body.userid,
      issue : req.body.issues
    })
    await User.findByIdAndUpdate(id,{
      $push:{
        mechanic_appoints:mechanicData._id
      }
    })
    res 
    .status(200)
    .send({message:"Done",success : true})
    await mechanicData.save()
  } catch (error) {
  console.log(error)
  }
}

const editUser = async(req,res)=>{
  const userId = req.body.userId
  try {
    const userEdit = await User.findByIdAndUpdate(userId,{
      $set:{
        name:req.body.name
      }
    },{new:true})
    res
    .status(200)
    .send({message:"done",success:true,userEdit})
    await userEdit.save()
  } catch (error) {
    console.log("errrrrror",error)
  }
}

const serviceHistory = async(req,res)=>{
  const userId = req.body.userId 
  const userHistory = await User.findById(userId).populate("Mybookings")
  console.log(userHistory,"hey")
  if(userHistory){
    res
    .status(200)
    .send({message:"got em",success:true,data:
      userHistory.Mybookings})

    
  }
}

const resendOtp = async(req,res)=>{
  console.log(req.body)
  const resend = otpHelper.sendOtp()
}

const otp = async(req,res) => {
  try {
    const otp = req.params.otp
    // console.log(req.params.otp,"awwww");
    // console.log(data,"asdasdads")
    let { name, email, password, cpassword, phone } = data;
    await otpHelper.verifyOtp(phone, otp).then(async (verification) => {
      if (verification.status == "approved") {
        password = await bcrypt.hash(password, 10);
        confirmpassword = await bcrypt.hash(cpassword, 10);
        const users = new User({
          name: name,
          email: email,
          password: password,
          confirmpassword: confirmpassword,
          phone: phone,
        });
        users.save()
          return res
          .status(200)
          .send({message:"otp ok",success:true})
          
          // console.log("dasda")
      } else if (verification.status == "pending") {
        console.log("otp not matched");
      }
    }); 
  } catch (error) {
    console.log(error)
  }
 
};

module.exports = {
  userRegister,
  userLogin,
  carService,
  getUserById,
  mechanicService,
  editUser,
  serviceHistory,
  otp,
  resendOtp
 
};
