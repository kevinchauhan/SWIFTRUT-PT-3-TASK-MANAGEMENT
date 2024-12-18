import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import Modal from "react-modal"; // Import React-Modal

// Set the root element for React-Modal
Modal.setAppElement("#root");

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [selectedTask, setSelectedTask] = useState(null); // Task for view/edit
    const { user } = useAuthStore();

    // Fetch tasks from the API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("/api/tasks", {
                    withCredentials: true,
                });
                setTasks(response.data.tasks);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load tasks");
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    // Open modal for creating or editing a task
    const openModal = (task = { title: "", description: "" }) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
    };

    // Save the task (create or update)
    const handleSaveTask = async (e) => {
        e.preventDefault();
        try {
            if (selectedTask._id) {
                // Update existing task
                await axios.put(`/api/tasks/${selectedTask._id}`, selectedTask, { withCredentials: true });
                toast.success("Task updated successfully");
                setTasks((prev) =>
                    prev?.map((task) => (task._id === selectedTask._id ? selectedTask : task))
                );
            } else {
                // Create new task
                const response = await axios.post("/api/tasks", selectedTask, { withCredentials: true });
                toast.success("Task created successfully");
                setTasks((prev) => [response.data.task, ...prev]);
            }
            closeModal(); // Close modal after saving
        } catch (error) {
            toast.error("Failed to save task");
        }
    };

    // Delete a task
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
            toast.success("Task deleted successfully");
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
            closeModal(); // Close modal if deleting from edit mode
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold text-primary mb-6">Dashboard</h2>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div>
                    <button
                        onClick={() => openModal()}
                        className="mb-4 py-2 px-4 bg-accent text-white rounded-md hover:bg-primary"
                    >
                        Add New Task
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks?.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => openModal(task)} // Handle task click for edit
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Task Modal for Edit/View/Delete */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="bg-white p-6 rounded-md shadow-md w-1/2 mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    {selectedTask?._id ? "Edit Task" : "Create New Task"}
                </h2>
                <form onSubmit={handleSaveTask}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-semibold">
                            Task Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={selectedTask?.title || ""}
                            onChange={(e) =>
                                setSelectedTask({ ...selectedTask, title: e.target.value })
                            }
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold">
                            Task Description
                        </label>
                        <textarea
                            id="description"
                            value={selectedTask?.description || ""}
                            onChange={(e) =>
                                setSelectedTask({ ...selectedTask, description: e.target.value })
                            }
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-primary text-white rounded-md hover:bg-accent"
                        >
                            {selectedTask?._id ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
                {selectedTask?._id && (
                    <button
                        onClick={() => handleDeleteTask(selectedTask._id)}
                        className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Task
                    </button>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
