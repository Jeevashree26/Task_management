import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../api";

function UpdateTask() {
  const { id } = useParams();
  const [task, setTask] = useState({ title: "", description: "", due_date: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTask() {
      const response = await getTaskById(id, token);
      setTask(response.data);
    }
    fetchTask();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, task, token);
      alert("Task updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error updating task");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control my-2" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
        <textarea className="form-control my-2" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} required></textarea>
        <input type="date" className="form-control my-2" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} required />
        <button type="submit" className="btn btn-success w-100">Update Task</button>
      </form>
    </div>
  );
}

export default UpdateTask;
