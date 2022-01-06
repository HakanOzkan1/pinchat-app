const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const path = require('path')

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(()=> {
    console.log("MongoDB Connected")
}).catch(err=> console.log(err))

app.use("/api/users",userRoute)
app.use("/api/pins",pinRoute)

//Server production assets
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join("pinchat-frontend/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'pinchat-frontend','build','index.html'))
    })
}

app.listen(8800,()=>{
    console.log("Backend server is running!")
})