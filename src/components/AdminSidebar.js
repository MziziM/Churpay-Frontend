import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Churches", path: "/admin/churches", icon: "⛪" },
  { name: "Members", path: "/admin/members", icon: "👥" },
  { name: "Projects", path: "/admin/projects", icon: "📁" },
  { name: "Donations", path: "/admin/donations", icon: "💸" },
  { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  // Add more nav items as you build more admin sections
];

export default function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-gradient-to-b from-purple-800 to-indigo-900 text-white shadow-lg z-30 flex flex-col">
      <div className="px-6 py-8 flex flex-col items-center border-b border-indigo-700">
        <img src="/logo.png" alt="ChurPay Logo" className="h-10 mb-3" />
        <h1 className="font-extrabold text-2xl tracking-wide text-yellow-300">Admin</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 font-semibold text-lg rounded-l-full transition-all ${
                isActive
                  ? "bg-yellow-300 text-purple-800 shadow-md"
                  : "hover:bg-indigo-700 hover:text-yellow-200"
              }`
            }
            end
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-6 py-4 border-t border-indigo-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}