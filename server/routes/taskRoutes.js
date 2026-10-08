const express = require("express");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CREATE A NEW TASK
// POST /api/tasks
// ======================================================

router.post("/", authMiddleware, async function (req, res) {

    try {

        const { title, description } = req.body;


        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        if (!title) {

            return res.status(400).json({

                message: "Task title is required"

            });

        }


        // ==================================================
        // CREATE TASK
        // ==================================================

        const task = new Task({

            title: title,

            description: description || "",

            user: req.userId

        });


        // ==================================================
        // SAVE TASK
        // ==================================================

        await task.save();


        // ==================================================
        // SEND RESPONSE
        // ==================================================

        res.status(201).json({

            message: "Task created successfully",

            task: task

        });

    } catch (error) {

        console.log("Create task error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// GET ALL TASKS FOR LOGGED-IN USER
// GET /api/tasks
// ======================================================

router.get("/", authMiddleware, async function (req, res) {

    try {

        const tasks = await Task.find({

            user: req.userId

        }).sort({

            createdAt: -1

        });


        res.status(200).json(tasks);

    } catch (error) {

        console.log("Get tasks error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// GET ONE TASK
// GET /api/tasks/:id
// ======================================================

router.get("/:id", authMiddleware, async function (req, res) {

    try {

        const task = await Task.findOne({

            _id: req.params.id,

            user: req.userId

        });


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        res.status(200).json(task);

    } catch (error) {

        console.log("Get task error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// UPDATE TASK
// PUT /api/tasks/:id
// ======================================================

router.put("/:id", authMiddleware, async function (req, res) {

    try {

        const { title, description } = req.body;


        // ==================================================
        // FIND TASK BELONGING TO LOGGED-IN USER
        // ==================================================

        const task = await Task.findOne({

            _id: req.params.id,

            user: req.userId

        });


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        // ==================================================
        // VALIDATE TITLE
        // ==================================================

        if (!title) {

            return res.status(400).json({

                message: "Task title is required"

            });

        }


        // ==================================================
        // UPDATE TASK
        // ==================================================

        task.title = title;

        task.description = description || "";


        await task.save();


        res.status(200).json({

            message: "Task updated successfully",

            task: task

        });

    } catch (error) {

        console.log("Update task error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// MARK TASK AS COMPLETED / PENDING
// PATCH /api/tasks/:id/status
// ======================================================

router.patch("/:id/status", authMiddleware, async function (req, res) {

    try {

        const { completed } = req.body;


        // ==================================================
        // FIND TASK BELONGING TO LOGGED-IN USER
        // ==================================================

        const task = await Task.findOne({

            _id: req.params.id,

            user: req.userId

        });


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        // ==================================================
        // UPDATE COMPLETION STATUS
        // ==================================================

        task.completed = completed;


        await task.save();


        res.status(200).json({

            message: completed
                ? "Task marked as completed"
                : "Task marked as pending",

            task: task

        });

    } catch (error) {

        console.log("Update task status error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ======================================================
// DELETE TASK
// DELETE /api/tasks/:id
// ======================================================

router.delete("/:id", authMiddleware, async function (req, res) {

    try {

        // ==================================================
        // FIND TASK BELONGING TO LOGGED-IN USER
        // ==================================================

        const task = await Task.findOne({

            _id: req.params.id,

            user: req.userId

        });


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        // ==================================================
        // DELETE TASK
        // ==================================================

        await Task.findByIdAndDelete(req.params.id);


        res.status(200).json({

            message: "Task deleted successfully"

        });

    } catch (error) {

        console.log("Delete task error:", error);


        res.status(500).json({

            message: "Server error"

        });

    }

});


module.exports = router;