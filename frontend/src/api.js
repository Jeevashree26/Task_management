import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export const registerUser = (userData) => axios.post(`${API_URL}/register`, userData);

export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);

export const createTask = (taskData, token) =>
    axios.post(`${API_URL}/createTask`, taskData, { headers: { Authorization: `Bearer ${token}` } });

export const getAllTasks = (token) =>
    axios.get(`${API_URL}/getAllTasks`, { headers: { Authorization: `Bearer ${token}` } });

export const updateTask = (taskId, taskData, token) =>
    axios.put(`${API_URL}/updateTask/${taskId}`, taskData, { headers: { Authorization: `Bearer ${token}` } });

export const deleteTask = (taskId, token) =>
    axios.delete(`${API_URL}/deleteTask/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });

export const markTaskComplete = (taskId, token) =>
    axios.patch(`${API_URL}/markTaskComplete/${taskId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const getTaskById = (taskId, token) =>
    axios.get(`${API_URL}/getTask/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
