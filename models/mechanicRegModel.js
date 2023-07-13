const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const {Schema} = mongoose

const mechanicRegSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    address:{
        type:String
    },
    password:{
        type:String
    },
    Service_issued:[{
        type:ObjectId,
        ref:"Mechanic"
    }],
    access: { type: Boolean, default: true },
},
{
    timestamps:true
}
)

module.exports = mongoose.model("mechanicRegistration", mechanicRegSchema)