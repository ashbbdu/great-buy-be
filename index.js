
const express = require("express");
const authRoutes = require("./routes/Auth");
const { connect } = require("./config/database");
require("dotenv").config;
const app = express()

app.use(express.json())
const PORT = process.env.PORT || 8081;


connect()

app.get("/" , (req , res) => {
    res.send("App is up and running")
})
app.use("/api/v1/auth" , authRoutes )

app.listen(PORT , () => {
    console.log("App is running...." + PORT);    
})

