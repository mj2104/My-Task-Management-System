const mongoose = require("mongoose");


// ======================================================
// TASK SCHEMA
// ======================================================

const taskSchema = new mongoose.Schema(

    {

        // ==================================================
        // TASK TITLE
        // ==================================================

        title: {
            type: String,
            required: true,
            trim: true
        },


        // ==================================================
        // TASK DESCRIPTION
        // ==================================================

        description: {
            type: String,
            default: "",
            trim: true
        },


        // ==================================================
        // TASK COMPLETION STATUS
        // ==================================================

        completed: {
            type: Boolean,
            default: false
        },


        // ==================================================
        // USER WHO CREATED THE TASK
        // ==================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },

    {

        timestamps: true

    }

);


// ======================================================
// CREATE TASK MODEL
// ======================================================

const Task = mongoose.model("Task", taskSchema);


module.exports = Task;