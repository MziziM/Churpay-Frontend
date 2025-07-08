import { useState } from "react";
import axios from "axios";

export default function CreateProject({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      setMsg("You must be logged in as a church.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/church/create-project", {
        token,
        title,
        description,
        goal_amount: goal,
        image_url: image
      });
      setMsg("Project created! 🎉");
      setTitle(""); setDescription(""); setGoal(""); setImage("");
      if (onSuccess) onSuccess();
    } catch {
      setMsg("Failed to create project.");
    }
  }

  return (
    <form className="bg-purple-50 p-8 rounded-xl shadow mb-8 space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-2xl font-bold text-purple-800 mb-2">Create New Project</h3>
      <input
        className="border rounded p-3 w-full"
        placeholder="Project Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border rounded p-3 w-full"
        placeholder="Describe the project..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        required
      />
      <input
        className="border rounded p-3 w-full"
        type="number"
        placeholder="Goal Amount (optional)"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />
      <input
        className="border rounded p-3 w-full"
        placeholder="Image URL (optional)"
        value={image}
        onChange={e => setImage(e.target.value)}
      />
      <button className="bg-yellow-400 text-purple-800 font-bold px-8 py-3 rounded-xl shadow hover:bg-yellow-300 transition" type="submit">
        Add Project
      </button>
      {msg && <div className="mt-2 text-purple-800">{msg}</div>}
    </form>
  );
}