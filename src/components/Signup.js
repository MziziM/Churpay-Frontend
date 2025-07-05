import React, { useState, useEffect } from "react";
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
  const [churches, setChurches] = useState([]);
  const [churchSearch, setChurchSearch] = useState("");
  const [selectedChurchId, setSelectedChurchId] = useState("");

  useEffect(() => {
    if (role === "member") {
      axios.get("https://churpay-backend.onrender.com/api/churches")
        .then(res => setChurches(res.data))
        .catch(() => setChurches([]));
    }
  }, [role]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setMsg("");
  try {
    let data;
    let endpoint;
    if (role === "church") {
      endpoint = "https://churpay-backend.onrender.com/api/register";
      data = {
        church_name: form.church_name,
        email: form.email,
        password: form.password,
        lead_pastor: form.lead_pastor,
        contact_person: form.contact_person,
        role,
      };
    } else if (role === "member") {
      endpoint = "https://churpay-backend.onrender.com/api/register";
      data = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        church_id: selectedChurchId,
      };
    } else if (role === "admin") {
      endpoint = "https://churpay-backend.onrender.com/api/admin-register";
      data = {
        admin_name: form.admin_name,
        admin_email: form.admin_email,
        password: form.password,
        role,
      };
    } else {
      setMsg("Invalid role.");
      setLoading(false);
      return;
    }

    const res = await axios.post(endpoint, data);
    setMsg("Signup successful! You can now log in.");
    if (role === "admin" && res.status === 201) {
      window.location.href = "/admin/dashboard";
    }
  } catch (err) {
    setMsg("Registration failed: " + (err.response?.data?.msg || "Check your details and try again."));
  }
  setLoading(false);
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 py-8 px-2">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
        <img
          src="/churpay_logo.png"
          alt="ChurPay Logo"
          className="h-16 md:h-20 mb-7"
          style={{ objectFit: "contain" }}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-2 text-center drop-shadow-lg">Create your account</h1>
        <div className="mb-7 text-yellow-100 text-center text-lg md:text-xl">
          Sign up to give, support projects, or manage your church.
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-3 w-full">
          {roles.map(r => (
            <button
              key={r.key}
              type="button"
              className={`flex-1 rounded-2xl px-3 py-4 sm:py-3 text-lg font-bold border-2
                ${role === r.key ? "bg-purple-700 text-yellow-300 border-purple-700 shadow-md" : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-gray-800 dark:text-yellow-100 dark:border-purple-700"}
                hover:bg-purple-100 transition-all duration-150 text-center`}
              onClick={() => setRole(r.key)}
            >
              <div>{r.label}</div>
              <div className="text-xs font-normal text-purple-400 mt-1">{r.desc}</div>
            </button>
          ))}
        </div>
        {role && (
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            {(role === "member") && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  required
                  onChange={handleChange}
                  autoComplete="name"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  required
                  onChange={handleChange}
                  autoComplete="email"
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
                {/* Church selection for members */}
                <div>
                  <label className="block mb-1 text-purple-200 font-semibold">Select Your Church</label>
                  <input
                    type="text"
                    placeholder="Search churches..."
                    value={churchSearch}
                    onChange={e => setChurchSearch(e.target.value)}
                    className="mb-2 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-purple-800 dark:text-yellow-100 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition w-full"
                  />
                  <select
                    required
                    value={selectedChurchId}
                    onChange={e => setSelectedChurchId(e.target.value)}
                    className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  >
                    <option value="">Choose a church...</option>
                    {churches.filter(c => (c.name || "").toLowerCase().includes(churchSearch.toLowerCase())).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {role === "church" && (
              <>
                <input
                  type="text"
                  name="church_name"
                  placeholder="Church Name"
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  required
                  onChange={handleChange}
                  autoComplete="organization"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Church Email"
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
                <input
                  type="text"
                  name="lead_pastor"
                  placeholder="Lead Pastor Name"
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  required
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="contact_person"
                  placeholder="Contact Person"
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
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
                  className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl px-5 py-3 text-lg focus:border-purple-400 outline-none dark:bg-gray-800 dark:text-yellow-100"
                  required
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="admin_email"
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
          <div className="mt-2 text-center text-yellow-200 font-medium text-lg">{msg}</div>
        )}
      </div>
    </div>
  );
}