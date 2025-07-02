import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Active Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {projects.map(project => (
          <Link
            to={`/projects/${project.id}`}
            key={project.id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition"
          >
            <img src={project.image || "https://via.placeholder.com/400x160?text=No+Image"} alt={project.title} className="rounded mb-3 w-full h-40 object-cover" />
            <div className="text-xl font-semibold text-purple-700">{project.title}</div>
            <div className="text-gray-600 text-sm mb-2">{project.church}</div>
            <div className="text-gray-700 text-center">{project.description}</div>
            <span className="mt-2 text-purple-500 underline">Give Now</span>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-20">No projects found.</div>
        )}
      </div>
    </div>
  );
}