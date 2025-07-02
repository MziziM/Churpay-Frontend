// src/components/AdminDashboard.js

import React, { useState } from "react";
import AdminHome from "./AdminHome";
import AdminChurchManagement from "./AdminChurchManagement";
import AdminAnalytics from "./AdminAnalytics";
import BulkMessage from "./BulkMessage";

const TABS = [
  { name: "Dashboard", comp: AdminHome },
  { name: "Church Management", comp: AdminChurchManagement },
  { name: "Analytics", comp: AdminAnalytics },
  { name: "Bulk Messages", comp: BulkMessage }
];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = TABS[tab].comp;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 bg-purple-800 p-6 text-white fixed left-0 top-0 h-full z-30 shadow-xl">
        <div className="text-2xl font-bold text-yellow-300 mb-8">Admin Panel</div>
        {TABS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setTab(i)}
            className={`block text-left px-5 py-3 mb-2 rounded-xl font-semibold text-lg transition ${
              tab === i
                ? "bg-yellow-300 text-purple-800 shadow"
                : "hover:bg-purple-700 hover:text-yellow-300"
            }`}
          >
            {t.name}
          </button>
        ))}
      </aside>

      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-purple-700 p-2 rounded-xl shadow-lg focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="6" width="16" height="2" fill="#FFF"/>
          <rect x="4" y="11" width="16" height="2" fill="#FFF"/>
          <rect x="4" y="16" width="16" height="2" fill="#FFF"/>
        </svg>
      </button>

      {/* Sidebar Drawer (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setSidebarOpen(false)}>
          <aside
            className="absolute left-0 top-0 w-64 h-full bg-purple-800 p-6 shadow-2xl animate-slide-in flex flex-col text-white"
            style={{animationFillMode: 'forwards'}}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-2xl font-bold text-yellow-300 mb-8">Admin Panel</div>
            {TABS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => { setTab(i); setSidebarOpen(false); }}
                className={`block text-left px-5 py-3 mb-2 rounded-xl font-semibold text-lg transition ${
                  tab === i
                    ? "bg-yellow-300 text-purple-800 shadow"
                    : "hover:bg-purple-700 hover:text-yellow-300"
                }`}
              >
                {t.name}
              </button>
            ))}
            <button className="mt-auto text-sm text-yellow-200 hover:underline pt-6" onClick={() => setSidebarOpen(false)}>Close</button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-60 p-4 md:p-10 transition-all w-full">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <ActiveComponent />
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
      @keyframes slide-in { 0% { transform: translateX(-100%); opacity:0; } 100% { transform: translateX(0); opacity:1; } }
      .animate-slide-in { animation: slide-in 0.23s cubic-bezier(.77,.21,.68,1.15) forwards; }
      `}</style>
    </div>
  );
}