const express = require("express")
const app = express()
const cors = require("cors")
// const mongoose = require("mongoose")
const dbConfig = require('./config/dbconfig')


require('dotenv').config()
const port = process.env.PORT || 1102;

app.use(express.json()) //to destructure somthing that comes in the formof JSON
app.use(cors())


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

const userrouter = require("./routes/userRoute")
const adminrouter = require("./routes/adminRoute")
app.use("/api/user",userrouter)
app.use("/api/admin",adminrouter)


app.listen(port, ()=> console.log(`listening to port ${port}`))



