import express from "express";
import TaskController from "../controllers/TaskController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authenticate);

// Task routes
router.post("/", TaskController.createTask);
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
