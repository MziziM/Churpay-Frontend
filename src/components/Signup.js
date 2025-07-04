import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [church_name, setChurchName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        church_name,
        email,
        password,
      });
      setMsg("Registration successful! You can now log in.");
      setChurchName(""); setEmail(""); setPassword("");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Create Your Church Account</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input className="border rounded p-2" type="text" placeholder="Church Name" value={church_name} onChange={e => setChurchName(e.target.value)} required />
        <input className="border rounded p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border rounded p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-purple-700 text-white font-bold py-2 rounded hover:bg-purple-800 transition">Sign Up</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Already have an account? <a href="/login" className="text-purple-700 font-semibold">Log in</a></p>
      {msg && <div className="mt-4 text-center text-sm text-purple-800 font-semibold">{msg}</div>}
    </section>
  );
}
      