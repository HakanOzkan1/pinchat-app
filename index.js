const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const path = require('path');
var cors = require('cors');
app.use(cors());

dotenv.config();

app.use(express.json())

mongoose.connect("mongodb+srv://hakan:12345@teacherbase.8ji0l.mongodb.net/pin?retryWrites=true&w=majority")
.then(()=> {
    console.log("MongoDB Connected")
}).catch(err=> console.log(err))

app.use("/api/users",userRoute)
app.use("/api/pins",pinRoute)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.resolve(__dirname, "./client/build")));
  
    app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
  }

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running!")
})