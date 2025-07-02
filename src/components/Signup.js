import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Create Your Church Account</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          className="border border-yellow-400 rounded p-3 bg-white text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="text"
          placeholder="Church Name"
          value={church_name}
          onChange={e => setChurchName(e.target.value)}
          required
        />
        <input
          className="border border-yellow-400 rounded p-3 bg-white text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border border-yellow-400 rounded p-3 bg-white text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-yellow-400 text-purple-800 font-bold py-3 rounded hover:bg-yellow-300 transition">Sign Up</button>
      </form>
      <p className="mt-6 text-sm text-center text-purple-800">
        Already have an account?{" "}
        <Link to="/login" className="text-yellow-400 font-semibold hover:underline">Log in</Link>
      </p>
      {msg && <div className="mt-4 text-center text-sm text-purple-800 font-semibold">{msg}</div>}
    </section>
  );
}