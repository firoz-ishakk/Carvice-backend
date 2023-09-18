const User = require("../models/usermodcel");
const Service = require("../models/servicesmcodel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mechanic = require("../models/mechaniccmodel")
const otpHelper = require("../util/otp");
// const razorpay = require('razorpay');


let data = {}
//registeration of user
const userRegister = async (req,res) => {
console.log(req.body,"opopopo")
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
 
       res
        .status(200)
        .send({ message: "This user exists", success: false });
    } else {
      data = req.body
      const phone = data.phone;
      otpHelper.sendOtp(phone);
 
       res
      .status(200)
      .send({message:"ok",success:true})
    }
  } catch (error) {
 
    res.status(400).send({ message: "Something went wrong here", error });
  }
};
//user login
const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    console.log(user,"lol")
    if (!user || user.access === false) {
      res
      .status(200)
      .send({ message: "", success: false });
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
       
      }
      }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error });
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
    const userId = req.body.userId
    console.log(userId,"sng")
    console.log(req.body,"oka oka")
    console.log(req.body.bookCarwash,"andi")
      const serviceAction = await Service({
        name : req.body.bookCarwash.name,
        numberplate : req.body.bookCarwash.numberplate,
        phone : req.body.bookCarwash.number,
        address : req.body.bookCarwash.address,
        pickup : req.body.bookCarwash.pickup, 
        service  : req.body.bookCarwash.service,
        user : req.body.userid,
        totalamount:req.body.bookCarwash.totalPayment
      })
      console.log(serviceAction._id,"popills")
       const rec = await User.findByIdAndUpdate({_id:userId},{
          $push: {Mybookings:serviceAction._id, 
          }
        })
        console.log(rec,"is this okay ?")
        console.log(serviceAction._id,"pop")
      res
      .status(200)
      .send({message:"done bwoi",success:true})
      const servicedatabase = await serviceAction.save()
  } catch (error) {

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
    res 
    .status(500)
    .send({message:"Something went wrong"})
  }
}

const serviceHistory = async(req,res)=>{
  try {
    const userId = req.body.userId 
    const userHistory = await User.findById(userId).populate("Mybookings")
    if(userHistory){
      res
      .status(200)
      .send({message:"got em",success:true,data:
        userHistory.Mybookings})
    }
  } catch (error) {
    res
    .status(500)
    .send({message:"Something went wrong"})
  } 
 
}

const resendOtp = async(req,res)=>{
  console.log(req.body)
  const resend = otpHelper.sendOtp()
}

const otp = async(req,res) => {
  try {
    const otp = req.params.otp
    let { name, email, password, phone } = data;
    await otpHelper.verifyOtp(phone, otp).then(async (verification) => {
      if (verification.status == "approved") {
        password = await bcrypt.hash(password, 10);
        // confirmpassword = await bcrypt.hash(cpassword, 10);
        const users = new User({
          name: name,
          email: email,
          password: password,
          // confirmpassword: confirmpassword,
          phone: phone,
        });
        users.save()
          return res
          .status(200)
          .send({message:"otp ok",success:true})
      } else if (verification.status == "pending") {
        console.log("otp not matched");
      }
    }); 
  } catch (error) {
    res
    .status(500)  
    .send({message:"Something went wrong"})
  }
 
};

const cancellation = async(req,res)=>{
  try {
    const id = req.params.id
    console.log(id,"id")
    const user = req.body.userId
    console.log(user,"id")
    const cancel = await Service.findByIdAndDelete({_id:id})
    if(cancel){
      await User.findByIdAndUpdate({_id:user},{
      $pull:
         { 
          Mybookings:id
        }
      })
      res 
      .status(200)  
      .send({message:"Cancelled Successfully",data:cancel})
    }
  } catch (error) {
    res 
    .status(500)  
    send({message:"Someting went wrong"})
  }
}

const mechHistory = async(req,res)=>{
  try {
    const history = await Mechanic.find()
    if(history){
      res 
      .status(200)  
      .send({data:history})
    }
  } catch (error) {
    res 
    .status(500)
    .send({message:"Something went wrong"})
  }

}

const payment = async(req, res) => {
  try {
    console.log(req.params)
    const id = req.params.id
    console.log(req.body,"asd")
    const saveAmount = await Mechanic.findByIdAndUpdate({_id:id},{
      $set:{
        payment_status:"paid"
      }
    },{new:true})
    const servicePayment = await Service
    res.json({message:"payment done"});
  } catch (error) {
    console.log(error);
    res.status(500).send('Payment failed');
  }
}

const paymentofservice = async(req, res) => {
  try {

    const id = req.params.id
    console.log(id,"sadasd")
    console.log(req.body,"asd")
    const findbyid = await Service.findById({_id:id})
    console.log(findbyid,"uioiuoiu")
    const saveAmount = await Service.findByIdAndUpdate({_id:id},{
      $set:{
        paymentStatus:"paid"
      }
    },{new:true})
    console.log(saveAmount,"sad")
    res.json({message:"payment done"});
  } catch (error) {
    console.log(error);
    res.status(500).send('Payment failed');
  }
}

module.exports = {
  userRegister,
  userLogin,
  carService,
  getUserById,
  mechanicService,
  editUser,
  serviceHistory,
  otp,
  resendOtp,
  cancellation,
  mechHistory,
  payment,
  paymentofservice
};
