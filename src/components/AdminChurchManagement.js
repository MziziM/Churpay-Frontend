import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChurchManagement() {
  const [churches, setChurches] = useState([]);
  const [editingChurch, setEditingChurch] = useState(null);
  const [formData, setFormData] = useState({ church_name: "", email: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      setMsg("Please log in as admin.");
      return;
    }
    axios.post("http://localhost:5000/api/admin/churches", { token })
      .then(res => setChurches(res.data))
      .catch(() => setMsg("Failed to load churches."));
  }, []);

  function startEdit(church) {
    setEditingChurch(church);
    setFormData({ church_name: church.church_name, email: church.email });
    setMsg("");
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submitEdit(e) {
    e.preventDefault();
    const token = localStorage.getItem("churpay_token");
    axios.post("http://localhost:5000/api/admin/edit-church", {
      token,
      church_id: editingChurch.id,
      ...formData,
    })
      .then(() => {
        setMsg("Church updated successfully!");
        setEditingChurch(null);
        // Update local list
        setChurches(prev =>
          prev.map(ch =>
            ch.id === editingChurch.id ? { ...ch, ...formData } : ch
          )
        );
      })
      .catch(() => setMsg("Failed to update church."));
  }

  function impersonate(church) {
    // For demo: set churpay_token to church id and redirect
    localStorage.setItem("churpay_token", `church-${church.id}`);
    localStorage.setItem("churpay_church_name", church.church_name);
    window.location.href = "/church-dashboard"; // adjust route if needed
  }

  return (
    <section className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-900 mb-6">Church Management</h2>
      {msg && (
        <div className="mb-6 text-center text-green-600 font-semibold">{msg}</div>
      )}

      {!editingChurch ? (
        <table className="min-w-full rounded-lg shadow-md border border-purple-200 overflow-hidden">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Church Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {churches.map(ch => (
              <tr key={ch.id} className="border-b border-purple-100 hover:bg-yellow-50 transition">
                <td className="py-3 px-6">{ch.church_name}</td>
                <td className="py-3 px-6">{ch.email}</td>
                <td className="py-3 px-6 space-x-4">
                  <button
                    className="bg-yellow-400 px-4 py-1 rounded text-purple-800 font-semibold hover:bg-yellow-500"
                    onClick={() => startEdit(ch)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-purple-700 px-4 py-1 rounded text-yellow-300 font-semibold hover:bg-purple-800"
                    onClick={() => impersonate(ch)}
                  >
                    Impersonate
                  </button>
                </td>
              </tr>
            ))}
            {churches.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-purple-700 font-semibold">
                  No churches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <form
          onSubmit={submitEdit}
          className="max-w-md mx-auto bg-purple-50 rounded-xl p-6 shadow space-y-4"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Edit Church</h3>
          <label className="block font-semibold text-purple-700">Church Name</label>
          <input
            type="text"
            name="church_name"
            value={formData.church_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <label className="block font-semibold text-purple-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              className="bg-gray-300 text-purple-700 px-6 py-2 rounded shadow hover:bg-gray-400"
              onClick={() => setEditingChurch(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-700 text-yellow-300 px-6 py-2 rounded shadow hover:bg-purple-800 font-bold"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </section>
  );
}