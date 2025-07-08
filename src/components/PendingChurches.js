import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PendingChurches() {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) return setMsg("Please log in as admin.");
    // Fetch pending churches
    axios.post("http://localhost:5000/api/admin/pending-churches", { token })
      .then(res => setPending(res.data))
      .catch(() => setMsg("Error loading pending churches."));
  }, []);

  const handleApprove = (id) => {
    const token = localStorage.getItem("churpay_token");
    axios.post("http://localhost:5000/api/admin/approve-church", { token, church_id: id })
      .then(() => {
        setPending(pending.filter(ch => ch.id !== id));
      })
      .catch(() => alert("Failed to approve church."));
  };

  const handleReject = (id) => {
    const token = localStorage.getItem("churpay_token");
    axios.post("http://localhost:5000/api/admin/reject-church", { token, church_id: id })
      .then(() => {
        setPending(pending.filter(ch => ch.id !== id));
      })
      .catch(() => alert("Failed to reject church."));
  };

  return (
    <section className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-900 mb-6">Pending Church Applications</h2>
      {msg && <div className="mb-6 text-red-600 font-semibold text-center">{msg}</div>}

      {pending.length === 0 ? (
        <div className="text-center text-purple-700 font-semibold py-12">
          No pending applications.
        </div>
      ) : (
        <table className="min-w-full bg-white border border-purple-200 rounded-xl shadow-md">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Church Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(ch => (
              <tr key={ch.id} className="border-b border-purple-100 hover:bg-yellow-50 transition-colors duration-200">
                <td className="py-3 px-6">{ch.church_name}</td>
                <td className="py-3 px-6">{ch.email}</td>
                <td className="py-3 px-6 space-x-4">
                  <button
                    onClick={() => handleApprove(ch.id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(ch.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}