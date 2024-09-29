const Opt = require("../models/Opt");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// otp send
module.exports.sendOpt = async (req , res) => {
 try {
    const {email} = req.body;

    if(!email) {
       return res.status(404).json({
            success : false,
            message : "Please fill the required field"
        })
    } 

    const existingUser = await User.find({email})
    console.log(existingUser , "existin");
    
    if(!existingUser) {
      return  res.status(404).json({
            success : false,
            message : `User with email - ${email} alredy exist`
        })
    }

    const otp = Math.floor(Math.random()*899999+100000); 
    const otpData = await Opt.create({email , otp , createdAt : Date.now()})

   return res.status(200).json({
        success : true,
        message : `OTP sent successfully`
    })

 } catch (error) {
    console.log(error)
    res.status(500).json({
        success : true,
        message : `Something went wrong while sending the otp , please try again`
    })
 }
}
// signup

module.exports.signup = async (req , res) => {
    try {
        const {otp , firstName , lastName , email , password , confirmPassword , accountType } = req.body;
        if(!otp || !firstName || !lastName || !email || !password || !confirmPassword || !accountType){
            res.status(404).json({
                success : false,
                message : "Please fill the required field"
            })
        }
        if(password !== confirmPassword){
            res.status(404).json({
                success : false,
                message : "Password does not match"
            })
        }
        const existingUser =  await User.findOne({email})
        if(existingUser) {
            res.status(404).json({
                success : false,
                message : "User alredy registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        const profileDetails = {
            gender : "",
            dateOfBirth : "",
            about : "",
            contactNumber : ""
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            accountType,
            additionalDetails : profileDetails._id ,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(200).json({
            success : true,
            message : "User registered successfully",
            user : user
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : true,
            message : `Something went wrong while creating user , please try again`
        })
    }
}

// login

module.exports.login = async (req , res) => {
    try { 
        const {email , password} = req.body;
        const user = await User.findOne({email})
        if(!email || !password){
            return res.status(404).json({
                success : false,
                message : "Please fill all the required fields"
            })
        }

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User is not registered , kindly signup"
            })
        }

        const payload = {
            id : user._id,
            email : user.email,
            accountType : user.accountType
        }
    
       if(await bcrypt.compare(password , user.password)) {
            jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "24h"
            })
       }

     
    } catch (error) {

    }
}

// changePassoword