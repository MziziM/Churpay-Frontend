import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [role, setRole] = useState("church");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("/api/login", { email, password, role });
      setMsg("Login successful! Redirecting...");
      localStorage.setItem("churpay_token", res.data.token);
      localStorage.setItem("churpay_role", role);

      // Save user info to use for navbar or conditional rendering
      localStorage.setItem("churpay_user", JSON.stringify(res.data.user || {}));

      // Navigate based on role
      const redirectPath = role === "church" ? "/dashboard" : "/member-dashboard";
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-t-4 border-yellow-400 p-16">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ChurPay Logo" className="h-12 mb-2" />
          <div className="h-1 w-16 bg-yellow-400 rounded-full mb-4"></div>
        </div>
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-2">Sign In to ChurPay</h2>
        <p className="text-center text-lg text-purple-500 mb-6">
          Welcome back! Please enter your login details below.
        </p>
        {/* Role Selector */}
        <div className="flex justify-center mb-4 gap-2">
          <button
            type="button"
            onClick={() => setRole("church")}
            className={`px-6 py-3 rounded-l-full border border-purple-400 font-semibold transition ${
              role === "church"
                ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white"
                : "bg-white text-purple-700"
            }`}
          >
            Church
          </button>
          <button
            type="button"
            onClick={() => setRole("member")}
            className={`px-6 py-3 rounded-r-full border border-purple-400 font-semibold transition ${
              role === "member"
                ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white"
                : "bg-white text-purple-700"
            }`}
          >
            Member
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              {/* Filled email icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#a78bfa">
                <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                <path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.511l8.25 5.5 8.25-5.5V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm17.25 1.489-7.728 5.156a1.25 1.25 0 0 1-1.444 0L3.75 8.239v9.011c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.239z" fill="#a78bfa"/>
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-12 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-lg"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              {/* Filled lock icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#a78bfa">
                <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z" fill="#a78bfa"/>
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-12 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-lg"
            />
          </div>
          <div className="text-right text-sm text-purple-600 hover:underline cursor-pointer">
            Forgot your password?
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-yellow-300 font-bold py-4 rounded-xl shadow-md transition text-xl"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-md text-gray-600">
          New here?{" "}
          <a href="/signup" className="text-purple-700 font-semibold hover:underline">
            Create your account →
          </a>
        </div>
        {msg && (
          <div className="mt-6 text-center text-md text-purple-800 font-semibold">{msg}</div>
        )}
      </div>
    </div>
  );
}
