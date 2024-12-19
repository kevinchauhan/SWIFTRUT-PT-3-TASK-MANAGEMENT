import Task from "../models/Task.js";
import User from "../models/User.js";

class TaskController {
    // Create a new task
    static async createTask(req, res) {
        const { title, description, dueDate } = req.body;

        try {
            const userTasks = await Task.countDocuments({ userId: req.user.id });

            // Restrict regular users to creating a maximum of 10 tasks
            if (req.user.role === "User" && userTasks >= 10) {
                return res.status(403).json({ message: "Task limit exceeded" });
            }

            const task = new Task({
                title,
                description,
                dueDate,
                status: "pending",
                userId: req.user.id,
            });

            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: "Failed to create task", error });
        }
    }

    // Fetch tasks with advanced querying (filtering and sorting)
    static async getTasks(req, res) {
        const { status, sortBy, sortOrder = "asc", dueDate, search, page = 1, limit = 10 } = req.query;

        try {
            const user = await User.findById(req.user.id)
            // Build query filter
            const filter = user.role === "admin" ? {} : { userId: req.user.id };
            if (status) filter.status = status;
            if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
            if (search) filter.title = { $regex: search, $options: "i" };

            // Build sorting object
            const sort = sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {};

            // Pagination logic
            const skip = (page - 1) * limit;

            // Fetch tasks with filter, sorting, and pagination
            const tasks = await Task.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .populate('userId');

            // Total task count for pagination metadata
            const totalTasks = await Task.countDocuments(filter);

            res.status(200).json({
                tasks,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: Number(page),
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch tasks", error });
        }
    }


    // Fetch a single task by ID
    static async getTaskById(req, res) {
        const { id } = req.params;

        try {
            const task = await Task.findOne({ _id: id, userId: req.user.id });
            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch task", error });
        }
    }

    // Update a task
    static async updateTask(req, res) {
        const { id } = req.params;

        try {
            const task = await Task.findOneAndUpdate(
                { _id: id, userId: req.user.id },
                req.body,
                { new: true }
            );

            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: "Failed to update task", error });
        }
    }

    // Delete a task
    static async deleteTask(req, res) {
        const { id } = req.params;

        try {
            const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete task", error });
        }
    }
}

export default TaskController;
