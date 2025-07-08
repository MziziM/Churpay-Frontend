import { useState } from "react";
import axios from "axios";

export default function PaymentForm({ onSubmit }) {
  const [type, setType] = useState("Tithe");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      setMsg("You must be logged in!");
      return;
    }
    try {
      await axios.post("/api/transactions", {
        token,
        date: new Date().toISOString().slice(0, 10),
        name: type,
        amount: `R${amount}`,
        status: "Success"
      });
      setMsg("Payment added!");
      setAmount("");
      if (onSubmit) onSubmit();
    } catch (err) {
      setMsg("Failed to save payment.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 p-6 rounded-xl mb-8 shadow-md flex flex-col md:flex-row gap-4 items-center">
      <select
        className="border rounded p-2 text-purple-800"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="Tithe">Tithe</option>
        <option value="Offering">Offering</option>
        <option value="Event">Event</option>
      </select>
      <input
        type="number"
        min="1"
        placeholder="Amount (R)"
        className="border rounded p-2 w-32"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button className="bg-yellow-400 text-purple-900 font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition" type="submit">
        Add Payment
      </button>
      {msg && <span className="ml-4 text-purple-800">{msg}</span>}
    </form>
  );
}