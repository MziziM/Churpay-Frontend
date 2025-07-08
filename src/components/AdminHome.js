import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navClass = (path) =>
    `block px-5 py-3 rounded-xl font-semibold text-lg mb-2 transition ${
      location.pathname === path
        ? "bg-yellow-300 text-purple-800 shadow"
        : "text-white hover:bg-purple-700 hover:text-yellow-300"
    }`;

  return (
    <aside className="bg-purple-800 min-h-screen w-60 p-6 flex flex-col fixed left-0 top-0 z-50 shadow-xl">
      <div className="text-2xl font-bold text-yellow-300 mb-8">Admin Panel</div>
      <Link to="/admin_dashboard" className={navClass("/admin_dashboard")}>Dashboard</Link>
      <Link to="/admin-analytics" className={navClass("/admin-analytics")}>Analytics</Link>
      <Link to="/admin-church-management" className={navClass("/admin-church-management")}>Manage Churches</Link>
      <Link to="/all-users" className={navClass("/all-users")}>All Users</Link>
      <Link to="/bulk-message" className={navClass("/bulk-message")}>Bulk Message</Link>
      <Link to="/pending-churches" className={navClass("/pending-churches")}>Pending Churches</Link>
      <Link to="/activity-log" className={navClass("/activity-log")}>Activity Log</Link>
      {/* Add more links as needed */}
    </aside>
  );
}