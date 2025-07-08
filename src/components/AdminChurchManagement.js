// src/components/AdminChurchManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChurchManagement() {
  const [churches, setChurches] = useState([]);
  const [editingChurch, setEditingChurch] = useState(null);
  const [formData, setFormData] = useState({ church_name: "", email: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      setMsg("Please log in as admin.");
      return;
    }
    setLoading(true);
    axios
      .post("https://churpay-backend.onrender.com/api/admin/churches", { token })
      .then((res) => {
        setChurches(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMsg("Failed to load churches.");
        setLoading(false);
      });
  }, []);

  function startEdit(church) {
    setEditingChurch(church);
    setFormData({ church_name: church.church_name, email: church.email });
    setMsg("");
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submitEdit(e) {
    e.preventDefault();
    const token = localStorage.getItem("churpay_token");
    axios
      .post("https://churpay-backend.onrender.com/api/admin/edit-church", {
        token,
        church_id: editingChurch.id,
        ...formData,
      })
      .then(() => {
        setMsg("Church updated successfully!");
        setEditingChurch(null);
        // Update local list
        setChurches((prev) =>
          prev.map((ch) =>
            ch.id === editingChurch.id ? { ...ch, ...formData } : ch
          )
        );
      })
      .catch(() => setMsg("Failed to update church."));
  }

  function impersonate(church) {
    localStorage.setItem("churpay_token", `church-${church.id}`);
    localStorage.setItem("churpay_church_name", church.church_name);
    window.location.href = "/church-dashboard";
  }

  return (
    <section className="max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-3xl shadow-2xl mt-4 mb-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-purple-900 mb-6">Church Management</h2>
      {msg && (
        <div className="mb-6 text-center text-green-600 font-semibold">{msg}</div>
      )}

      {loading ? (
        <div className="py-12 text-center text-purple-700 font-bold text-lg">
          Loading churches…
        </div>
      ) : !editingChurch ? (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl shadow border border-purple-200 overflow-hidden bg-white">
            <thead className="bg-purple-700 text-white text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Logo</th>
                <th className="py-3 px-4 text-left">Church Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {churches.map((ch) => (
                <tr key={ch.id} className="border-b border-purple-100 hover:bg-yellow-50 transition">
                  <td className="py-3 px-4">
                    {ch.logo_url ? (
                      <img
                        src={ch.logo_url.startsWith("http") ? ch.logo_url : `https://churpay-backend.onrender.com/api/${ch.logo_url.replace(/^\//, "")}`}
                        alt="Church Logo"
                        className="h-10 w-10 object-cover rounded-full border border-purple-200 shadow-sm"
                      />
                    ) : (
                      <span className="inline-block h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-purple-600 font-bold">
                        {ch.church_name ? ch.church_name[0].toUpperCase() : "C"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-purple-800">{ch.church_name}</td>
                  <td className="py-3 px-4 text-purple-700">{ch.email}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-yellow-400 px-4 py-1 rounded-lg text-purple-800 font-semibold hover:bg-yellow-500"
                      onClick={() => startEdit(ch)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-purple-700 px-4 py-1 rounded-lg text-yellow-300 font-semibold hover:bg-purple-800"
                      onClick={() => impersonate(ch)}
                    >
                      Impersonate
                    </button>
                  </td>
                </tr>
              ))}
              {churches.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-purple-700 font-semibold">
                    No churches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // EDIT FORM
        <form
          onSubmit={submitEdit}
          className="max-w-md mx-auto bg-purple-50 rounded-2xl p-6 shadow space-y-4 mt-8"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Edit Church</h3>
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