import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api"; 

const AddTask = ({ token }) => {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        due_date: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!taskData.title || !taskData.description || !taskData.due_date) {
                setError("All fields are required!");
                return;
            }
            await createTask(taskData, token);
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("Error adding task:", error);
            setError("Failed to add task. Please try again.");
        }
    };

    return (
        <div>
            <h2>Add New Task</h2>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error if any */}
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} required />
                <input type="date" name="due_date" onChange={handleChange} required />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
