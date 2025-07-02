// src/components/AddChurchForm.js
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddChurchForm() {
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleLogoChange(e) {
    setLogoFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let logo_url = null;
    if (logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);
      const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      logo_url = uploadRes.data.url;
    }
    await axios.post(`http://localhost:5000/api/churches`, {
      ...form,
      logo_url,
    });
    navigate("/churches");
  }

  return (
    <div className="flex flex-col items-center pt-10 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Add New Church</h1>
        {/* Add all inputs (same as edit) */}
        {/* ...copy-paste inputs from edit form above... */}
        {/* You can add the full field list here as above */}
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Name</label>
          <input name="name" value={form.name || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Lead Pastor</label>
          <input name="lead_pastor" value={form.lead_pastor || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Contact Person</label>
          <input name="contact_person" value={form.contact_person || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Phone</label>
          <input name="phone" value={form.phone || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Email</label>
          <input name="email" value={form.email || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Address</label>
          <input name="address" value={form.address || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Established</label>
          <input name="established" value={form.established || ""} onChange={handleChange}
            type="date" className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Status</label>
          <select name="status" value={form.status || ""} onChange={handleChange}
            className="w-full border px-4 py-2 rounded">
            <option value="">Select...</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 mb-2">Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>
        <button type="submit"
          className="bg-purple-700 text-yellow-300 font-bold px-8 py-3 rounded-xl shadow hover:bg-purple-800 transition w-full text-xl"
        >
          Add Church
        </button>
      </form>
    </div>
  );
}