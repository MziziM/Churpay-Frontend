import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";
import axios from "axios";
import React from "react";

export default function ProjectsPublic() {
  const { notify } = useNotification();
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    axios.get("https://churpay-backend.onrender.com/api/projects")
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load projects");
        setLoading(false);
      });
  }, []);

  function handleGiveSuccess() {
    notify({ type: "success", message: "Thank you for your gift!" });
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-purple-700">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-10 text-center">Support a Church Project</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <img src={project.image_url} alt={project.title} className="h-40 object-cover rounded mb-4" />
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{project.title}</h2>
            <div className="text-purple-500 mb-1 font-semibold">{project.church}</div>
            <p className="text-gray-700 mb-3 flex-grow">{project.description}</p>
            <div className="w-full bg-gray-200 rounded h-3 mb-2">
              <div
                className="bg-yellow-400 h-3 rounded"
                style={{
                  width: `${Math.min(100, Math.round((project.total_raised / project.goal_amount) * 100))}%`
                }}
              />
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span>Raised: R{project.total_raised}</span>
              <span>Goal: R{project.goal_amount}</span>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="bg-purple-700 text-yellow-300 font-bold px-5 py-2 rounded shadow text-center hover:bg-purple-800 transition"
              onClick={handleGiveSuccess}
            >
              View & Give
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}