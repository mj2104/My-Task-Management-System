const mongoose = require("mongoose");


// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = new mongoose.Schema(
    {

        // User's name
        name: {
            type: String,
            required: true,
            trim: true
        },


        // User's email
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },


        // User's password
        password: {
            type: String,
            required: true
        }

    },

    {
        timestamps: true
    }
);


// ======================================================
// CREATE USER MODEL
// ======================================================

const User = mongoose.model("User", userSchema);


module.exports = User;