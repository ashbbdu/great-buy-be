const mongoose = require("mongoose");

const Otp = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true
    },
    otp : {
        type : String,
        required : true,
        trim : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 60 * 5
    }
})

module.exports = mongoose.model("Otp" , Otp)