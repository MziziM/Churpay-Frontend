import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaChurch,
  FaChartBar,
  FaEnvelope,
  FaMoneyBillWave,
  FaCrown,
  FaProjectDiagram,
  FaLightbulb,
} from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("https://churpay-backend.onrender.com/api/admin/stats")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load admin stats");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-purple-700">Loading...</div>;
  }
  if (error || !stats) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error || "No stats available"}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-8 font-inter">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-10 mb-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
        <div className="flex items-center gap-6 flex-1">
          <MdOutlineDashboard className="text-7xl drop-shadow-xl" />
          <div>
            <div className="text-lg font-semibold tracking-wide mb-1">Welcome,</div>
            <div className="text-3xl font-bold leading-tight">Admin</div>
            <div className="text-base font-medium text-white mt-0.5">Platform Admin</div>
            <div className="text-xs mt-2 text-purple-200">"Manage churches, projects, users and more."</div>
          </div>
        </div>
      </div>
      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          icon={<FaChurch className="text-2xl text-purple-500 mb-2" />}
          value={stats.churches}
          label="Churches"
          borderColor="border-purple-400 dark:border-purple-600"
          valueClass="text-purple-800 dark:text-purple-200"
        />
        <SummaryCard
          icon={<FaUsers className="text-2xl text-green-500 mb-2" />}
          value={stats.members}
          label="Members"
          borderColor="border-green-400 dark:border-green-600"
          valueClass="text-green-800 dark:text-green-200"
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-2xl text-yellow-500 mb-2" />}
          value={`R${stats.totalRevenue}`}
          label="Total Revenue"
          borderColor="border-yellow-400 dark:border-yellow-500"
          valueClass="text-yellow-700 dark:text-yellow-200"
        />
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold text-sm">
            <FaCrown /> Top Church
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-100 font-bold">{stats.topChurch}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-200 font-semibold text-sm">
            <FaProjectDiagram /> Top Project
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-100 font-bold">{stats.topProject}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
            <FaEnvelope /> New Messages
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-100 font-bold">{stats.newMessages}</div>
        </div>
      </div>
      {/* Section Divider */}
      <div className="my-8 border-b border-gray-200 dark:border-gray-700" />
      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        <AdminCard
          icon={<FaChurch className="text-2xl text-purple-500" />}
          label="Manage Churches"
          desc="View, add, or update churches."
          onClick={() => navigate("/admin/churches")}
        />
        <AdminCard
          icon={<FaUsers className="text-2xl text-green-500" />}
          label="Manage Members"
          desc="Control members & admins."
          onClick={() => navigate("/admin/members")}
        />
        <AdminCard
          icon={<FaProjectDiagram className="text-2xl text-blue-500" />}
          label="Manage Projects"
          desc="Create & view all projects."
          onClick={() => navigate("/admin/projects")}
        />
        <AdminCard
          icon={<FaChartBar className="text-2xl text-pink-500" />}
          label="Analytics"
          desc="See platform analytics."
        />
        <AdminCard
          icon={<MdOutlineMessage className="text-2xl text-blue-500" />}
          label="Messages"
          desc="Send or review messages."
        />
        <AdminCard
          icon={<FaLightbulb className="text-2xl text-yellow-400" />}
          label="Ideas"
          desc="View and manage new ideas."
        />
      </div>
      {/* Footer */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-10">
        ChurPay Admin &copy; {new Date().getFullYear()} — For the Kingdom 💜
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, value, label, borderColor, valueClass }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col items-start border-l-4 ${borderColor}`}>
      {icon}
      <div className={`text-2xl font-extrabold mb-1 ${valueClass}`}>{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{label}</div>
    </div>
  );
}

// Reusable card component for admin sections
function AdminCard({ icon, label, desc, onClick }) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      type={onClick ? "button" : undefined}
      role={onClick ? "button" : undefined}
      className={`bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg p-6 flex flex-col gap-3 items-start transition-all border border-gray-50 dark:border-gray-800 ${onClick ? "cursor-pointer" : ""} group`}
    >
      <div className="mb-2">{icon}</div>
      <div className="font-semibold text-gray-800 dark:text-gray-100 text-lg group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-all">{label}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
    </Component>
  );
}