import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://churpay-backend.onrender.com/api/projects")
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-5 sm:mb-8 text-center">
        Giving Projects
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
          {projects.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-10 text-lg">
              No projects available yet.
            </div>
          )}
          {projects.map(project => (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              className="block group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-200 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <div className="relative">
                <img
                  src={project.image || "https://placehold.co/600x300?text=Project+Image"}
                  alt={project.title}
                  className="rounded-t-2xl w-full h-40 sm:h-48 object-cover object-center transition group-hover:scale-105 duration-200"
                />
                {/* Status Badge */}
                {project.status && (
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow
                    ${project.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {project.status}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-1 truncate w-full" title={project.title}>
                  {project.title}
                </h2>
                <div className="text-sm text-purple-500 mb-2 w-full truncate">{project.church}</div>
                <div className="text-gray-700 text-sm mb-2 w-full line-clamp-2">
                  {project.description}
                </div>
                {/* Progress bar */}
                <div className="w-full mb-2">
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{
                        width: `${Math.min(100, Math.round((project.raised / project.goal) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Raised: <b>R{project.raised}</b></span>
                    <span>Goal: R{project.goal}</span>
                  </div>
                </div>
                {/* Button */}
                <Link
                  to={`/projects/${project.id}`}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold py-2 mt-2 rounded-lg transition text-center block"
                >
                  Give to this Project
                </Link>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}