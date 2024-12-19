import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [100, "Task title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Task description is required"],
            maxlength: [500, "Task description cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "in Progress", "completed", "overdue"],
            default: "pending",
        },
        dueDate: {
            type: Date,
            required: [true, "Task due date is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Middleware to set "Overdue" status for past due dates
taskSchema.pre("save", function (next) {
    if (this.dueDate && new Date(this.dueDate) < new Date() && this.status !== "Completed") {
        this.status = "Overdue";
    }
    next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
