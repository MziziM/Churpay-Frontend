import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

export default function ProjectsPublic() {
  const { notify } = useNotification();

  // Demo list of projects — replace with backend fetch later!
  const projects = [
    {
      id: "101",
      title: "Church Roof Project",
      church: "GCC Faith Center",
      description: "Help us fix our church roof before rainy season.",
      total_raised: 3500,
      goal_amount: 10000,
      image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      id: "102",
      title: "Youth Camp 2025",
      church: "Living Word Church",
      description: "Sponsor kids for this year’s spiritual youth camp.",
      total_raised: 2200,
      goal_amount: 8000,
      image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    },
    {
      id: "103",
      title: "Community Feeding Scheme",
      church: "New Hope Assembly",
      description: "Donate food parcels for families in need.",
      total_raised: 4700,
      goal_amount: 12000,
      image_url: "https://images.unsplash.com/photo-1515168833906-d2a3b82b9a5e",
    },
  ];

  function handleGiveSuccess() {
    notify({ type: "success", message: "Thank you for your gift!" });
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
              // Demo: show a toast when clicked (remove this on production or call after real payment)
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