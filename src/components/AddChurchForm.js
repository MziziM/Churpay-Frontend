import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddChurchForm() {
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleLogoChange(e) {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
    else setLogoPreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    let logo_url = null;
    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadRes = await axios.post(
          "https://churpay-backend.onrender.com/api/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        logo_url = uploadRes.data.url;
      }
      await axios.post("https://churpay-backend.onrender.com/api/churches", {
        ...form,
        logo_url,
      });
      setMsg("Church added successfully! 🎉");
      setTimeout(() => navigate("/churches"), 1500);
    } catch (err) {
      setMsg("Failed to add church. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center pt-10 bg-purple-50 min-h-screen px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl px-6 sm:px-10 py-8 max-w-2xl w-full flex flex-col items-center border-4 border-purple-200"
      >
        <img
          src={logoPreview || "/churpay_logo2.png"}
          alt="Church Logo Preview"
          className="mb-6 h-16 w-16 object-cover rounded-xl border-2 border-purple-300 bg-gray-50 shadow"
        />
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-purple-800 text-center tracking-wide drop-shadow">
          Add New Church
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Name *</label>
            <input name="name" value={form.name || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium"
              required autoFocus />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Lead Pastor</label>
            <input name="lead_pastor" value={form.lead_pastor || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Contact Person</label>
            <input name="contact_person" value={form.contact_person || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Phone</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Email</label>
            <input name="email" value={form.email || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Address</label>
            <input name="address" value={form.address || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Established</label>
            <input name="established" value={form.established || ""} onChange={handleChange}
              type="date"
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium" />
          </div>
          <div>
            <label className="block text-purple-800 mb-1 font-semibold">Status</label>
            <select name="status" value={form.status || ""} onChange={handleChange}
              className="w-full border-2 border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 font-medium">
              <option value="">Select...</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="w-full mb-4">
          <label className="block text-purple-800 mb-1 font-semibold">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="block w-full text-base"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-700 text-yellow-300 font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-800 transition w-full text-xl mt-2 mb-2"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Church"}
        </button>
        {msg && (
          <div className={`mt-3 text-lg text-center ${msg.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}