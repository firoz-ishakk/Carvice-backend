const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    phone:{
        type:Number
    },
    
    password:{
        type:String
    },
    token:{
        type:String
    }
})

module.exports = mongoose.model("User", userSchema)
