import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminAuthNavbar from "./AdminAuthNavbar";

export default function AdminSignup() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Register admin
      await axios.post("https://churpay-backend.onrender.com/api/admin-register", {
        admin_name: form.name,
        admin_email: form.email,
        password: form.password,
        role: "admin"
      });
      // Auto-login admin
      const res = await axios.post("https://churpay-backend.onrender.com/api/admin-login", {
        email: form.email,
        password: form.password
      });
      localStorage.setItem("adminToken", res.data.token);
      setMsg("Admin account created! Redirecting to dashboard...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setMsg("Registration failed: " + (err.response?.data?.error || err.response?.data?.message || "Check your details and try again."));
    }
    setLoading(false);
  }

  return (
    <div>
      <AdminAuthNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 py-8 px-2">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 md:p-16 max-w-2xl w-full flex flex-col items-center border border-indigo-200 dark:border-indigo-700">
          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-300 mb-3 text-center drop-shadow-lg tracking-tight">Admin Signup</h1>
          <div className="mb-8 text-yellow-100 text-center text-xl md:text-2xl">
            <span className="font-bold">Restricted:</span> Only for authorized users.
          </div>
          <form onSubmit={handleSubmit} className="space-y-7 w-full max-w-lg">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-6 py-4 text-xl focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-6 py-4 text-xl focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-6 py-4 text-xl focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
              required
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="submit"
              className={`w-full bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold py-4 rounded-2xl transition-all shadow text-xl tracking-wide mt-1 ${loading && "opacity-60 pointer-events-none"}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Admin Account"}
            </button>
          </form>
          {msg && (
            <div className="mt-4 text-center text-yellow-200 font-medium text-xl">{msg}</div>
          )}
        </div>
      </div>
    </div>
  );
}