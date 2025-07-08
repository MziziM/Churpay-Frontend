// src/components/Features.js
import React from "react";

export default function Features() {
  return (
    <section className="px-6 py-10 text-center">
      <h2 className="text-3xl font-bold mb-6">🌟 Powerful Features</h2>
      <p className="text-gray-600 mb-4">Everything your church needs for digital giving and tracking.</p>
      <ul className="space-y-2 text-left max-w-xl mx-auto text-purple-800">
        <li>✅ Easy giving via mobile and web</li>
        <li>✅ Church and project targeting</li>
        <li>✅ Donation history & receipts</li>
        <li>✅ Giving goals and badges</li>
      </ul>
    </section>
  );
}