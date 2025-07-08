import React from "react";

export default function Profile() {
  const church = localStorage.getItem("churpay_church_name") || "User";
  return (
    <section className="max-w-lg mx-auto my-16 bg-white rounded-2xl shadow-xl p-10 text-center">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Profile</h2>
      <div className="w-20 h-20 rounded-full mx-auto bg-yellow-200 text-purple-800 flex items-center justify-center text-3xl font-bold mb-4">
        {church[0].toUpperCase()}
      </div>
      <div className="text-xl font-bold text-purple-800 mb-2">{church}</div>
      <div className="text-gray-500">Email coming soon...</div>
    </section>
  );
}