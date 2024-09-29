const express = require("express")
const { sendOpt, signup } = require("../controllers/Auth")
const router = express.Router()


router.post("/sendOpt" , sendOpt );
router.post("/signup" , signup)

module.exports = router;