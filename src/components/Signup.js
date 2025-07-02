import React, { useState } from "react";
import axios from "axios";

const roles = [
  { key: "member", label: "Member", desc: "Give, track donations, support projects" },
  { key: "church", label: "Church", desc: "Create projects, receive support, manage your profile" },
  { key: "admin", label: "Admin", desc: "Platform management (invite only)" }
];

export default function Signup() {
  const [role, setRole] = useState(null);
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
      const endpoint =
        role === "church"
          ? "https://churpay-backend.onrender.com/api/register-church"
          : role === "member"
          ? "https://churpay-backend.onrender.com/api/register-member"
          : "https://churpay-backend.onrender.com/api/register-admin";
      await axios.post(endpoint, { ...form, role });
      setMsg("Signup successful! You can now log in.");
    } catch (err) {
      setMsg("Registration failed: " + (err.response?.data?.msg || "Check your details and try again."));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-8 px-2">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 max-w-lg w-full flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-1 text-center">Create your account</h1>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          {roles.map(r => (
            <button
              key={r.key}
              type="button"
              className={`flex-1 rounded-2xl px-3 py-4 sm:py-3 text-lg font-bold border-2
                ${role === r.key ? "bg-purple-700 text-yellow-300 border-purple-700 shadow-md" : "bg-purple-50 text-purple-700 border-purple-200"}
                hover:bg-purple-100 transition-all duration-150 text-center`}
              onClick={() => setRole(r.key)}
            >
              <div>{r.label}</div>
              <div className="text-xs font-normal text-purple-400 mt-1">{r.desc}</div>
            </button>
          ))}
        </div>

        {role && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {role === "member" && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="name"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="email"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </>
            )}
            {role === "church" && (
              <>
                <input
                  type="text"
                  name="church_name"
                  placeholder="Church Name"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="organization"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Church Email"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <input
                  type="text"
                  name="lead_pastor"
                  placeholder="Lead Pastor Name"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="contact_person"
                  placeholder="Contact Person"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                />
              </>
            )}
            {role === "admin" && (
              <>
                <input
                  type="text"
                  name="admin_name"
                  placeholder="Admin Name"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="admin_email"
                  placeholder="Admin Email"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border-2 border-purple-100 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none"
                  required
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </>
            )}
            <button
              type="submit"
              className={`w-full bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold py-3 rounded-2xl transition-all shadow text-lg tracking-wide mt-1 ${loading && "opacity-60 pointer-events-none"}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>
        )}
        {msg && (
          <div className="mt-2 text-center text-base font-medium text-purple-600">{msg}</div>
        )}
      </div>
    </div>
  );
}