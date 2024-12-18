import Task from "../models/Task.js";

class TaskController {
    // Create a new task
    static async createTask(req, res) {
        const { title, description, dueDate } = req.body;

        try {
            const userTasks = await Task.countDocuments({ createdBy: req.user.id });

            // Restrict regular users to creating a maximum of 10 tasks
            if (req.user.role === "User" && userTasks >= 10) {
                return res.status(403).json({ message: "Task limit exceeded" });
            }

            const task = new Task({
                title,
                description,
                dueDate,
                status: "Pending",
                createdBy: req.user.id,
            });

            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: "Failed to create task", error });
        }
    }

    // Fetch tasks with advanced querying (filtering and sorting)
    static async getTasks(req, res) {
        const { status, sortBy, sortOrder = "asc", dueDate, search } = req.query;

        try {
            // Build query filter
            const filter = { createdBy: req.user.id };
            if (status) filter.status = status;
            if (dueDate) filter.dueDate = { $lte: new Date(dueDate) }; // Tasks with dueDate <= specified date
            if (search) filter.title = { $regex: search, $options: "i" }; // Case-insensitive search in title

            // Build sorting object
            const sort = sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {};

            const tasks = await Task.find(filter).sort(sort);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch tasks", error });
        }
    }

    // Fetch a single task by ID
    static async getTaskById(req, res) {
        const { id } = req.params;

        try {
            const task = await Task.findOne({ _id: id, createdBy: req.user.id });
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
                { _id: id, createdBy: req.user.id },
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
            const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user.id });
            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete task", error });
        }
    }
}

export default TaskController;
