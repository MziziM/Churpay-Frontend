import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MemberDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    axios
      .get("https://churpay-backend.onrender.com/api/donations", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 py-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Member Dashboard</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="mb-8 bg-purple-50 rounded-xl p-5 shadow flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-xl font-bold text-purple-700">{donations.length}</div>
              <div className="text-gray-500">Total Donations</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">
                R{donations.reduce((sum, d) => sum + Number(d.amount || 0), 0)}
              </div>
              <div className="text-gray-500">Total Given</div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-3 text-purple-700">Recent Donations</h2>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-100">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-purple-700">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-purple-700">Project</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-purple-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      No donations yet.
                    </td>
                  </tr>
                )}
                {donations.slice(0, 6).map(d => (
                  <tr key={d.id}>
                    <td className="px-3 py-2 text-sm">{new Date(d.date).toLocaleString()}</td>
                    <td className="px-3 py-2 text-sm">{d.project}</td>
                    <td className="px-3 py-2 text-sm font-bold text-purple-800">R{d.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}