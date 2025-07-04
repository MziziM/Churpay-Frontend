import React, { useState } from "react";
import axios from "axios";

export default function AdminSignup() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axios.post("https://churpay-backend.onrender.com/api/admin-register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMsg("Admin account created! You can now log in.");
    } catch (err) {
      setMsg("Registration failed: " + (err.response?.data?.error || "Check your details and try again."));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 py-8 px-2">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
        <img
          src="/churpay_logo.png"
          alt="ChurPay Logo"
          className="h-16 md:h-20 mb-7"
          style={{ objectFit: "contain" }}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-2 text-center drop-shadow-lg">Admin Signup</h1>
        <div className="mb-7 text-yellow-100 text-center text-lg md:text-xl">
          <span className="font-bold">Restricted:</span> Only for authorized users.  
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
            required
            onChange={handleChange}
            autoComplete="new-password"
          />
          <button
            type="submit"
            className={`w-full bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold py-3 rounded-2xl transition-all shadow text-lg tracking-wide mt-1 ${loading && "opacity-60 pointer-events-none"}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Admin Account"}
          </button>
        </form>
        {msg && (
          <div className="mt-2 text-center text-yellow-200 font-medium text-lg">{msg}</div>
        )}
      </div>
    </div>
  );
}