import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTaskById } from "../api";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTask() {
      const response = await getTaskById(id, token);
      setTask(response.data);
    }
    fetchTask();
  }, [id, token]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <small>Due: {task.due_date}</small>
    </div>
  );
}

export default TaskDetails;
