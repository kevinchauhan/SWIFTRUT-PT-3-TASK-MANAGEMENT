import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const TaskCard = ({ task, onEdit, fetchTasks }) => {
    const { user } = useAuthStore();
    const [status, setStatus] = useState(task.status); // Use `status` from the task schema

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/tasks/${task._id}`,
                { status: newStatus },
                {
                    withCredentials: true,
                }
            );
            setStatus(newStatus); // Update local state
            fetchTasks(); // Refresh task list
            toast.success("Task status updated successfully");
        } catch (error) {
            toast.error("Failed to update task status");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/tasks/${task._id}`, {
                withCredentials: true,
            });
            fetchTasks(); // Refresh task list
            toast.success("Task deleted successfully");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    // Apply dynamic styles based on task status
    const statusStyles = {
        pending: "bg-yellow-500 text-white",
        "in Progress": "bg-blue-500 text-white",
        completed: "bg-green-500 text-white",
        overdue: "bg-red-500 text-white",
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-lg font-medium text-primary">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>

            <p className="text-sm text-gray-400">
                Due: {moment(task.dueDate).format("DD/MM/YY")}
            </p>


            {/* Status Dropdown */}
            <div className="mt-2 flex items-center">
                <label htmlFor="status" className="mr-2 font-medium text-sm">
                    Status:
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`py-1 px-2 rounded-md ${statusStyles[status]}`}
                >
                    <option value="pending">Pending</option>
                    <option value="in Progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-4 justify-end">
                <button
                    onClick={() => onEdit(task)}
                    className="py-1 px-4 bg-blue-500 text-white rounded-md"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="py-1 px-4 bg-red-500 text-white rounded-md"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
