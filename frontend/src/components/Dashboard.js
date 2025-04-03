import React, { useEffect, useState } from "react";
import { getAllTasks, markTaskComplete, deleteTask, createTask, updateTask } from "../api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaEdit, FaTrash, FaSignOutAlt, FaPlus } from "react-icons/fa";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "" });
    const [editTask, setEditTask] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getAllTasks(token);
            const pendingTasks = response.data.filter(task => !task.completed);
            setTasks(pendingTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await markTaskComplete(taskId, token);
            fetchTasks();
        } catch (error) {
            console.error("Error marking task as complete:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId, token);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleAddTask = async () => {
        if (!newTask.title || !newTask.description || !newTask.due_date) {
            alert("Please fill all fields");
            return;
        }

        try {
            await createTask(newTask, token);
            setShowAddModal(false);
            setNewTask({ title: "", description: "", due_date: "" });
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = (task) => {
        setEditTask(task);
        setShowEditModal(true);
    };

    const handleUpdateTask = async () => {
        if (!editTask.title || !editTask.description || !editTask.due_date) {
            alert("Please fill all fields");
            return;
        }

        try {
            await updateTask(editTask._id, editTask, token);
            setShowEditModal(false);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📋 Task Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Add Task Button */}
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <FaPlus /> Add Task
                </button>
            </div>

            <div className="row">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className="col-md-4 mb-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text">{task.description}</p>
                                    <p><strong>Due Date:</strong> {task.due_date}</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-success" onClick={() => handleCompleteTask(task._id)}>
                                            <FaCheckCircle /> Complete
                                        </button>
                                        <button className="btn btn-warning" onClick={() => handleEditTask(task)}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteTask(task._id)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center w-100">No pending tasks!</p>
                )}
            </div>

            {/* Bootstrap Modal for Adding Task */}
            {showAddModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Task</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Description"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="form-control mb-2"
                                    value={newTask.due_date}
                                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bootstrap Modal for Editing Task */}
            {showEditModal && editTask && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    value={editTask.description}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="form-control mb-2"
                                    value={editTask.due_date}
                                    onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleUpdateTask}>Update Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
