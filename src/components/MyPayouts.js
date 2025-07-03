import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyPayouts({ token }) {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    axios.get("/api/church/my-payouts", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPayouts(res.data))
      .catch(() => setPayouts([]));
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">My Payout Requests</h2>
      <table className="w-full border rounded">
        <thead>
          <tr>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Bank</th>
            <th className="border px-2 py-1">Account #</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td className="border px-2 py-1">R{p.amount}</td>
              <td className="border px-2 py-1">{p.bank_name}</td>
              <td className="border px-2 py-1">{p.account_number}</td>
              <td className="border px-2 py-1">{p.status}</td>
              <td className="border px-2 py-1">{(new Date(p.created_at)).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}