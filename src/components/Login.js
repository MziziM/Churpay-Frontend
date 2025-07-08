import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await authAPI.login(email, password);
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
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-600 dark:from-purple-900 dark:to-gray-900 py-8 px-2">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border-t-4 border-yellow-300">
        <div className="relative mb-8 w-full flex justify-center">
          <img
            src="/churpay_logo2.png"
            alt="ChurPay Logo"
            className="h-16 md:h-24"
            style={{ objectFit: "contain" }}
          />
          <div className="absolute -bottom-2 w-24 h-1 bg-yellow-300 rounded-full"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 dark:text-yellow-300 mb-3 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-yellow-300 dark:to-yellow-400">
            Sign In to ChurPay
          </span>
        </h1>
        <div className="mb-8 text-purple-600 dark:text-yellow-100 text-center text-lg md:text-xl max-w-md">
          Welcome back! Please enter your login details below.
        </div>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleLogin}
        >
          <div className="relative w-full mb-5">
            <input
              className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-4 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
              placeholder="Email"
              type="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          <div className="relative w-full mb-6">
            <input
              className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-4 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full flex justify-end mb-2">
            <Link to="/forgot-password" className="text-sm text-purple-600 dark:text-yellow-200 hover:text-purple-800 dark:hover:text-yellow-300 transition-colors">
              Forgot your password?
            </Link>
          </div>
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-yellow-300 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg tracking-wide mt-3 transform hover:translate-y-[-1px] active:translate-y-[1px]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : "Sign In"}
          </button>
          {msg && (
            <div className={`mt-6 text-center font-medium ${msg.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-yellow-200"} p-4 rounded-xl ${msg.includes("success") ? "bg-green-50 dark:bg-green-900 dark:bg-opacity-20" : "bg-red-50 dark:bg-red-900 dark:bg-opacity-20"} border ${msg.includes("success") ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"}`}>
              {msg.includes("success") ? (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {msg}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 dark:text-yellow-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {msg}
                </div>
              )}
              {msg.includes("success") && (
                <div className="mt-3 text-sm text-green-500 dark:text-green-300 flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting you...
                </div>
              )}
            </div>
          )}
          <div className="mt-6 text-center">
            <span className="text-purple-600 dark:text-yellow-200">New here?</span>{" "}
            <Link
              to="/signup"
              className="text-purple-700 dark:text-yellow-300 hover:underline font-bold inline-flex items-center group"
            >
              Create your account
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
<<<<<<< HEAD
        
=======



>>>>>>> c429ac8 (Add axios to frontend dependencies)
