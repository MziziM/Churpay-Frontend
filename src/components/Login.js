import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("member");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (role === "member") {
      localStorage.setItem("churpay_token", "member1token");
      setMsg("Logged in as member!");
      setTimeout(() => navigate("/dashboard"), 800);
    } else if (role === "admin") {
      localStorage.setItem("churpay_token", "admintoken");
      setMsg("Logged in as admin!");
      setTimeout(() => navigate("/admin"), 800);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-purple-800 mb-4">ChurPay Login</h2>
        <label className="block font-semibold text-purple-700 mb-2">
          Select Role:
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800"
        >
          Login
        </button>
        {msg && <div className="text-green-600 mt-2">{msg}</div>}
      </form>
    </section>
  );
}