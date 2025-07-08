import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// ✅ Correct API base
const API_BASE = "https://churpay-backend.onrender.com/api";

// ✅ API helpers
export const memberAPI = {
  getDashboard: () => axios.get(`${API_BASE}/member/dashboard`),
  updateGoal: (goal) => axios.post(`${API_BASE}/member/goal`, { goal }),
  updateRecurring: (data) => axios.post(`${API_BASE}/member/recurring`, data),
};

export const getUserData = () => axios.get(`${API_BASE}/user`);
export const getDonationStats = () => axios.get(`${API_BASE}/donations/stats`);
export const getProjects = () => axios.get(`${API_BASE}/projects`);

// ✅ Render app without router wrapper here
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);