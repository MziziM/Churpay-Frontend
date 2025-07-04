import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      setMsg("Login successful! Redirecting...");
      localStorage.setItem("churpay_token", res.data.token);
      localStorage.setItem("churpay_church_name", res.data.church_name);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Church Login</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input className="border rounded p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border rounded p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-purple-700 text-white font-bold py-2 rounded hover:bg-purple-800 transition">Login</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Don’t have an account? <a href="/signup" className="text-purple-700 font-semibold">Sign up</a></p>
      {msg && <div className="mt-4 text-center text-sm text-purple-800 font-semibold">{msg}</div>}
    </section>
  );
}
        