import React from "react";
import { markTaskComplete, deleteTask } from "../api";

const TaskList = ({ tasks, token, refreshTasks }) => {
    return (
        <div className="task-list">
            {tasks.map(task => (
                <div key={task._id} className="task-card">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p><strong>Due:</strong> {task.due_date}</p>
                    <button onClick={() => markTaskComplete(token, task._id).then(refreshTasks)}>Complete</button>
                    <button onClick={() => deleteTask(token, task._id).then(refreshTasks)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
