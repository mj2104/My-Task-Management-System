const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");

const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// AUTHENTICATION ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);


// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", function (req, res) {

    res.send("Task Management System Backend is Running!");

});


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose.connect(process.env.MONGO_URI)

    .then(function () {

        console.log("MongoDB connected successfully!");


        app.listen(process.env.PORT || 5000, function () {

            console.log(
                `Server running at http://localhost:${process.env.PORT || 5000}`
            );

        });

    })

    .catch(function (error) {

        console.log("MongoDB connection error:", error);

    });