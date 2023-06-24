const express = require("express")
const app = express()
const cors = require("cors")
// const mongoose = require("mongoose")
const dbConfig = require('./config/dbconfig')


require('dotenv').config()
const port = process.env.PORT || 1102;

app.use(express.json()) //to destructure somthing that comes in the formof JSON
app.use(cors())
const userrouter = require("./routes/userRoute")
app.use("/api/user",userrouter)


app.listen(port, ()=> console.log(`listening to port ${port}`))



