import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPayouts({ token }) {
  const [payouts, setPayouts] = useState([]);
  const [msg, setMsg] = useState("");

  // Load all payout requests
  useEffect(() => {
    if (!token) return;
    axios.post("/api/admin/payout-requests", { token })
      .then(res => setPayouts(res.data))
      .catch(() => setMsg("Failed to load payout requests."));
  }, [token]);

  // Approve payout
  function handleApprove(id) {
    axios.post("/api/admin/approve-payout", { token, payout_id: id })
      .then(() => {
        setPayouts(payouts => payouts.map(p =>
          p.id === id ? { ...p, status: "approved" } : p
        ));
        setMsg("Payout approved!");
      })
      .catch(() => setMsg("Failed to approve."));
  }

  // Reject payout
  function handleReject(id) {
    axios.post("/api/admin/reject-payout", { token, payout_id: id })
      .then(() => {
        setPayouts(payouts => payouts.map(p =>
          p.id === id ? { ...p, status: "rejected" } : p
        ));
        setMsg("Payout rejected.");
      })
      .catch(() => setMsg("Failed to reject."));
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Payout Requests</h2>
      {msg && <div className="mb-4 text-purple-700">{msg}</div>}
      <table className="min-w-full bg-white border rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Church</th>
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-left">Bank</th>
            <th className="py-2 px-4 border-b text-left">Account #</th>
            <th className="py-2 px-4 border-b text-left">Holder</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Requested</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td className="py-2 px-4 border-b">{p.church_name || p.church}</td>
              <td className="py-2 px-4 border-b">R{Number(p.amount).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{p.bank_name}</td>
              <td className="py-2 px-4 border-b">{p.account_number}</td>
              <td className="py-2 px-4 border-b">{p.account_holder}</td>
              <td className="py-2 px-4 border-b font-semibold capitalize">{p.status}</td>
              <td className="py-2 px-4 border-b">{(new Date(p.created_at)).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                {p.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                      onClick={() => handleApprove(p.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      onClick={() => handleReject(p.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {payouts.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-purple-700">
                No payout requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
