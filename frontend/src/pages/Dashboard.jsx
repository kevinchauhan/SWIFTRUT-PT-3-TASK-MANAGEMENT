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
    const [sortBy, setSortBy] = useState("none"); // Sorting state
    const [filterBy, setFilterBy] = useState("all"); // Filtering state
    const { user } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    // Fetch tasks from the API
    useEffect(() => {
        fetchTasks();
    }, [user, currentPage, filterBy, sortBy]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/tasks`,
                {
                    params: {
                        status: filterBy !== "all" ? filterBy : undefined,
                        sortBy: sortBy === "ascending" ? "dueDate" : sortBy === "descending" ? "dueDate" : undefined,
                        sortOrder: sortBy === "descending" ? "desc" : "asc",
                        page: currentPage,
                        limit: 10, // Items per page
                    },
                    withCredentials: true,
                }
            );

            const { tasks, totalPages } = response.data;
            setTasks(tasks);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load tasks");
            setLoading(false);
        }
    };
    console.log(tasks)
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
                await axios.put(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/tasks/${selectedTask._id}`,
                    selectedTask,
                    { withCredentials: true }
                );
                toast.success("Task updated successfully");
                fetchTasks();
            } else {
                // Create new task
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/tasks`,
                    selectedTask,
                    { withCredentials: true }
                );
                toast.success("Task created successfully");
                fetchTasks();
            }
            closeModal(); // Close modal after saving
        } catch (error) {
            toast.error("Failed to save task");
        }
    };

    // Delete a task
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/tasks/${taskId}`, { withCredentials: true });
            toast.success("Task deleted successfully");
            closeModal(); // Close modal if deleting from edit mode
            fetchTasks();
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    // Apply sorting logic
    const sortedTasks = () => {
        let sorted = [...tasks];

        if (sortBy === "ascending") {
            sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === "descending") {
            sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        }

        // Apply filtering
        if (filterBy === "completed") {
            sorted = sorted.filter(task => task.completed);
        } else if (filterBy === "pending") {
            sorted = sorted.filter(task => !task.completed);
        }

        return sorted;
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold text-primary mb-6">Dashboard</h2>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-medium text-primary">Your Tasks</h2>

                        <button
                            onClick={() => openModal()}
                            className="py-2 px-4 bg-accent text-white rounded-md hover:bg-primary"
                        >
                            Add New Task
                        </button>
                    </div>

                    {/* Filter and Sort Tabs */}
                    <div className="flex mb-4">
                        <button
                            onClick={() => setFilterBy("all")}
                            className={`py-2 px-4 ${filterBy === "all" ? "bg-primary text-white" : "bg-gray-200"}`}
                        >
                            All Tasks
                        </button>
                        <button
                            onClick={() => setFilterBy("completed")}
                            className={`py-2 px-4 ml-2 ${filterBy === "completed" ? "bg-primary text-white" : "bg-gray-200"}`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilterBy("pending")}
                            className={`py-2 px-4 ml-2 ${filterBy === "pending" ? "bg-primary text-white" : "bg-gray-200"}`}
                        >
                            Pending
                        </button>

                        <div className="ml-4 flex">
                            <button
                                onClick={() => setSortBy("ascending")}
                                className={`py-2 px-4 ${sortBy === "ascending" ? "bg-primary text-white" : "bg-gray-200"}`}
                            >
                                Sort by Due Date (Asc)
                            </button>
                            <button
                                onClick={() => setSortBy("descending")}
                                className={`py-2 px-4 ml-2 ${sortBy === "descending" ? "bg-primary text-white" : "bg-gray-200"}`}
                            >
                                Sort by Due Date (Desc)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks?.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => openModal(task)} // Handle task click for edit
                                onEdit={openModal}
                                fetchTasks={fetchTasks}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                            className="py-2 px-4 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="py-2 px-4 text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="py-2 px-4 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                </div>
            )}

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
                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-sm font-semibold">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={selectedTask?.dueDate || ""}
                            onChange={(e) =>
                                setSelectedTask({ ...selectedTask, dueDate: e.target.value })
                            }
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
                        />
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
