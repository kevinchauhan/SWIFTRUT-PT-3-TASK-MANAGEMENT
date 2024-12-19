const TaskModal = ({ isOpen, task, onClose, onSave, onDelete }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                <h3>{task ? "Edit Task" : "Create New Task"}</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave(task); // Call onSave with the task
                    }}
                >
                    {/* Your form fields go here */}
                    <button type="submit">{task ? "Update" : "Create"}</button>
                </form>
                {task && (
                    <button onClick={() => onDelete(task._id)}>Delete</button>
                )}
            </div>
        </div>
    );
};

export default TaskModal;
