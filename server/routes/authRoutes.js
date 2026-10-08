const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ======================================================
// REGISTER USER
// POST /api/auth/register
// ======================================================

router.post("/register", async function (req, res) {

    try {

        // Get registration details
        const { name, email, password } = req.body;


        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // ==================================================
        // CHECK IF USER ALREADY EXISTS
        // ==================================================

        const existingUser = await User.findOne({
            email: email
        });


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // ==================================================
        // HASH PASSWORD
        // ==================================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ==================================================
        // CREATE NEW USER
        // ==================================================

        const user = new User({

            name: name,

            email: email,

            password: hashedPassword

        });


        // ==================================================
        // SAVE USER TO MONGODB
        // ==================================================

        await user.save();


        // ==================================================
        // SEND SUCCESS RESPONSE
        // ==================================================

        res.status(201).json({

            message: "Registration successful",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.log("Registration error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// LOGIN USER
// POST /api/auth/login
// ======================================================

router.post("/login", async function (req, res) {

    try {

        // Get login details
        const { email, password } = req.body;


        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and password are required"

            });

        }


        // ==================================================
        // FIND USER BY EMAIL
        // ==================================================

        const user = await User.findOne({
            email: email
        });


        // ==================================================
        // CHECK USER
        // ==================================================

        if (!user) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        // ==================================================
        // COMPARE PASSWORD
        // ==================================================

        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!passwordMatch) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        // ==================================================
        // CREATE JWT TOKEN
        // ==================================================

        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // ==================================================
        // SEND LOGIN RESPONSE
        // ==================================================

        res.status(200).json({

            message: "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.log("Login error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;