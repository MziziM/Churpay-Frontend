import React, { useState } from "react";
import axios from "axios";

export default function ChurchLogoManager({ churchId }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const logoUrl = res.data.url;
    // Now update church with logoUrl
    await axios.post(`http://localhost:5000/api/church/${churchId}/logo`, {
      logo_url: logoUrl,
    });
    alert("Logo uploaded and church updated!");
  }

  return (
    <div className="p-4 border rounded max-w-sm">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="mt-2 h-32 rounded" />}
      <button
        onClick={handleUpload}
        className="bg-purple-700 text-yellow-300 px-4 py-2 mt-2 rounded"
      >
        Upload and Save Logo
      </button>
    </div>
  );
}