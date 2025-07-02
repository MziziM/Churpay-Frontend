import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) return setMsg("Please log in as admin.");

    axios.post("http://localhost:5000/api/admin/activity-logs", { token })
      .then(res => setLogs(res.data))
      .catch(() => setMsg("Failed to load activity logs."));
  }, []);

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.admin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-900 mb-6">Admin Activity Log</h2>
      {msg && <div className="mb-6 text-red-600 font-semibold text-center">{msg}</div>}

      <input
        type="text"
        placeholder="Search by action or admin..."
        className="mb-6 w-full border border-yellow-400 rounded-lg p-2"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-xl shadow-md max-h-[500px]">
        <table className="min-w-full bg-white border border-purple-200 rounded-xl">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Date / Time</th>
              <th className="py-3 px-6 text-left font-semibold">Admin</th>
              <th className="py-3 px-6 text-left font-semibold">Action</th>
              <th className="py-3 px-6 text-left font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-purple-700 font-semibold">
                  No matching logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-b border-purple-100 hover:bg-yellow-50 transition"
                >
                  <td className="py-3 px-6">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-6">{log.admin}</td>
                  <td className="py-3 px-6">{log.action}</td>
                  <td className="py-3 px-6">{log.details || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}