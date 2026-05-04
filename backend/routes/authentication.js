const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "superSecret";

router.post("/createuser", async (req, res) => {
    let success = false
    try {
        // dont use email repeat
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "sorry a user with this email is alredy exist" });
        }
        // hash and  use salt to password genrate for more security
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        //create a new user 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        // create JWT payload
        const data = {
            user: {
                id: user.id,
            }
        }

        // generate auth token
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken });
    }

    catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }

})

router.post("/login", async (req, res) => {
    let success = false
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "please try to login with correct credantials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ error: "please try to login with correct credantials" });
        }

        const data = {
            user: {
                id: user.id,
            }
        }


        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error");
    }
})

router.post("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        let user = await User.findById(userId).select("-password")
        res.json({ user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error");
    }
})
module.exports = router;