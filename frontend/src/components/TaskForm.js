import React, { useState } from 'react';
import api from '../api';

const TaskForm = () => {
    const [task, setTask] = useState({ title: '', description: '', due_date: '' });
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/createTask', task, { headers: { Authorization: `Bearer ${token}` } });
            alert("Task Created!");
        } catch (error) {
            alert("Error creating task");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} required />
            <input type="date" name="due_date" onChange={handleChange} required />
            <button type="submit">Create Task</button>
        </form>
    );
};

export default TaskForm;
