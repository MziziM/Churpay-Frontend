// src/components/ChurchEditForm.js
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ChurchEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [church, setChurch] = useState(null);
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/churches/${id}`)
      .then((res) => {
        setChurch(res.data);
        setForm(res.data);
        setLogoPreview(res.data.logo_url ? `http://localhost:5000${res.data.logo_url}` : null);
        setLoading(false);
      })
      .catch(() => {
        setError("Church not found.");
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    let logo_url = form.logo_url;
    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        logo_url = uploadRes.data.url;
      }
      await axios.put(`http://localhost:5000/api/churches/${id}`, {
        ...form,
        logo_url,
      });
      setMsg("Changes saved! 🚀");
      setTimeout(() => navigate(`/churches/${id}`), 1200);
    } catch (err) {
      setError("Failed to save. Try again!");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-700"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-lg text-red-500">{error}</div>
    );

  return (
    <div className="flex flex-col items-center pt-10 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-2xl w-full"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700">Edit Church</h1>

        {msg && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border-l-4 border-green-400 text-green-700 text-center">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Name</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Lead Pastor</label>
          <input
            name="lead_pastor"
            value={form.lead_pastor || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Contact Person</label>
          <input
            name="contact_person"
            value={form.contact_person || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Email</label>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Address</label>
          <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Established</label>
          <input
            name="established"
            value={form.established || ""}
            onChange={handleChange}
            type="date"
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2 font-medium">Status</label>
          <select
            name="status"
            value={form.status || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">Select...</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-24 h-24 object-cover rounded-2xl mt-4 mx-auto border"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-purple-700 text-yellow-300 font-bold px-8 py-3 rounded-xl shadow hover:bg-purple-800 transition w-full text-xl"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}