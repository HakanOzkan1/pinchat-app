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

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.resolve(__dirname, "./pinchat-frontend/build")));
  
    app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./pinchat-frontend/build", "index.html"));
  });
  }

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running!")
})