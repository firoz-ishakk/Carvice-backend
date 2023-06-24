// const { default: mongoose } = require('mongoose');
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection

connection.on("connected",()=>{
    console.log("mongoDB is sucessfully connected");
})

connection.error("error",(error)=>{
    console.log("mongo DB connection error",error);
})

module.export = mongoose