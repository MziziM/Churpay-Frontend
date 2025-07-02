import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.post("https://churpay-backend.onrender.com/api/login", { email, password });
      const { token, role, name } = res.data;
      localStorage.setItem("churpay_token", token);
      localStorage.setItem("churpay_role", role);
      localStorage.setItem("churpay_name", name || email);
      setMsg("Login successful! Redirecting...");
      setTimeout(() => {
        if (role === "admin") navigate("/admin_dashboard");
        else if (role === "church") navigate("/church_dashboard");
        else navigate("/memberdashboard");
      }, 1200);
    } catch {
      setMsg("Login failed. Check your credentials and try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-purple-50 py-8 px-3">
      {/* Login Card */}
      <form
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md mt-14 flex flex-col items-center"
        onSubmit={handleLogin}
      >
        <img
          src="/churpay_logo.png"
          alt="ChurPay Logo"
          className="h-16 md:h-20 mb-7"
          style={{ objectFit: "contain" }}
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800 mb-2 text-center">Sign In to ChurPay</h1>
        <div className="mb-7 text-gray-500 text-center text-base md:text-lg">
          Welcome back! Please enter your login details below.
        </div>
        <input
          className="w-full border border-purple-200 rounded-xl px-5 py-4 mb-4 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Email"
          type="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-purple-200 rounded-xl px-5 py-4 mb-6 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-purple-700 text-yellow-300 font-bold w-full py-4 rounded-2xl hover:bg-purple-800 transition mb-3 text-lg md:text-xl shadow"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>
        {msg && (
          <div className={`text-center mt-2 ${msg.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {msg}
          </div>
        )}
        <div className="mt-7 text-base text-center text-gray-600">
          New here?{" "}
          <Link
            to="/signup"
            className="text-purple-700 font-semibold hover:underline"
          >
            Create your account
          </Link>
        </div>
      </form>
    </div>
  );
}