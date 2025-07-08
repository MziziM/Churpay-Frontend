import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// If you use AdminAuthNavbar or authAPI, import them here from the correct location in your unified src
// import AdminAuthNavbar from "./AdminAuthNavbar";
// import { authAPI } from "../api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      // Replace this with your actual API call
      // const res = await authAPI.adminLogin(form.email, form.password);
      // localStorage.setItem("adminToken", res.data.token);
      setMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setMsg("Login failed: " + (err.response?.data?.message || err.response?.data?.error || "Check your credentials and try again."));
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6b21a8 0%, #111827 100%)', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0001', padding: 40, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '4px solid #facc15' }}>
        <img src="/churpay_logo2.png" alt="ChurPay Logo" style={{ height: 64, objectFit: 'contain', marginBottom: 24 }} />
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#6b21a8', marginBottom: 12, textAlign: 'center' }}>Admin Login</h1>
        <div style={{ marginBottom: 24, color: '#6b21a8', textAlign: 'center', fontSize: 18, fontWeight: 500 }}>
          <span style={{ fontWeight: 700 }}>Restricted:</span> Only for authorized admins.
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            style={{ width: '100%', marginBottom: 16, padding: 14, border: '1px solid #ddd', borderRadius: 8, fontSize: 16 }}
            required
            onChange={handleChange}
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={{ width: '100%', marginBottom: 16, padding: 14, border: '1px solid #ddd', borderRadius: 8, fontSize: 16 }}
            required
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button
            type="submit"
            style={{ width: '100%', background: '#6b21a8', color: '#fff', fontWeight: 700, padding: 14, border: 'none', borderRadius: 8, fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
        {msg && (
          <div style={{ marginTop: 24, textAlign: 'center', fontWeight: 500, color: msg.includes('success') ? '#16a34a' : '#dc2626', background: msg.includes('success') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.includes('success') ? '#bbf7d0' : '#fecaca'}`, borderRadius: 8, padding: 16 }}>
            {msg}
            {msg.includes('success') && (
              <div style={{ marginTop: 12, fontSize: 14, color: '#16a34a' }}>
                Redirecting to admin dashboard...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
