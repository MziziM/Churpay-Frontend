import React, { useState } from "react";
import axios from "axios";

export default function PayoutRequestForm({ token }) {
  const [form, setForm] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
  });
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(
        "/api/church/request-payout",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Payout request submitted!");
      setForm({
        amount: "",
        bank_name: "",
        account_number: "",
        account_holder: "",
      });
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.error || "Failed to submit request"));
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Request Payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="amount" type="number" placeholder="Amount"
          value={form.amount} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
        <input name="bank_name" placeholder="Bank Name"
          value={form.bank_name} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
        <input name="account_number" placeholder="Account Number"
          value={form.account_number} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
        <input name="account_holder" placeholder="Account Holder"
          value={form.account_holder} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded">
          Request Payout
        </button>
      </form>
      {msg && <div className="mt-3 text-purple-700">{msg}</div>}
    </div>
  );
}