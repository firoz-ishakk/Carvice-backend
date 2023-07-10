const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
    name:       {
        type:String,
        // required:true
    },
    
    numberplate:{
        type:String,
        // required:true
    },

    phone:{
        type: Number,
        // ref:"User",
        // required:true
        
    },
    address:{
        type:String,
        // required:true
    },

    pickup:     {
        type:String,
        // required:true
    },

    service:    {
        type:String,
        // required:true
    },
    status:{
        type:String,
        default:"Not done"
    },
    user:{
        type:ObjectId,
        ref : "User"
    },
    
},
    {
    timestamps : true
    }
)

module.exports = mongoose.model("Service", serviceSchema)