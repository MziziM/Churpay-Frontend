import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import axios from "axios";
import Features from "./components/Features";

const API_BASE = "https://churpay-backend.onrender.com/api";

export const memberAPI = {
  getDashboard: () => axios.get("/api/member/dashboard"),
  updateGoal: (goal) => axios.post("/api/member/goal", { goal }),
  updateRecurring: (data) => axios.post("/api/member/recurring", data),
};

export const getUserData = () => axios.get(`${API_BASE}/user`);
export const getDonationStats = () => axios.get(`${API_BASE}/donations/stats`);
export const getProjects = () => axios.get(`${API_BASE}/projects`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);