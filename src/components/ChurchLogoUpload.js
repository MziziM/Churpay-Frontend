import React, { useState } from "react";
import axios from "axios";

// Add your actual church ID here (or get it from props/context)
const CHURCH_ID = 1;

export default function ChurchLogoUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload file to backend
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const logoUrl = res.data.url;

      // 2. Update the church's logo_url in the backend
      await axios.post(`http://localhost:5000/api/church/${CHURCH_ID}/logo`, {
        logo_url: logoUrl,
      });

      setMessage("Logo uploaded and saved to church profile!");
    } catch (err) {
      setMessage("Failed to upload or save logo.");
    }
  }

  return (
    <div className="p-4 border rounded max-w-sm">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="mt-2 h-32 rounded" />}
      <button onClick={handleUpload} className="bg-purple-700 text-yellow-300 px-4 py-2 mt-2 rounded">
        Upload & Save Logo
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
}