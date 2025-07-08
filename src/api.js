import axios from "axios";

const API_BASE = "https://churpay-backend.onrender.com/api";

export const memberAPI = {
  getDashboard: (token) =>
    axios.get(`${API_BASE}/member/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateGoal: (goal, token) =>
    axios.post(
      `${API_BASE}/member/goal`,
      { goal },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  updateRecurring: (data, token) =>
    axios.post(
      `${API_BASE}/member/recurring`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};

export const getUserData = (token) =>
  axios.get(`${API_BASE}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDonationStats = (token) =>
  axios.get(`${API_BASE}/donations/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProjects = () => axios.get(`${API_BASE}/projects`);