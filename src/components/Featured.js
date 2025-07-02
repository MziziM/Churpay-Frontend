import React from "react";

export default function Featured() {
  return (
    <section className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Why ChurPay?</h2>
      <ul className="space-y-6 text-lg text-gray-800">
        <li>
          <span className="font-bold text-purple-700">🛡 Secure Payment Gateway:</span> Built for churches, tithes, donations, and event payments.
        </li>
        <li>
          <span className="font-bold text-purple-700">🔗 Easy Integration:</span> Plug into church websites and apps with simple setup.
        </li>
        <li>
          <span className="font-bold text-purple-700">📊 Real-Time Dashboard:</span> Track every transaction and generate instant reports.
        </li>
        <li>
          <span className="font-bold text-purple-700">💳 Multiple Payment Methods:</span> Card, EFT, QR code, and more.
        </li>
        <li>
          <span className="font-bold text-purple-700">🙌 Recurring Giving:</span> Members can automate weekly or monthly tithes.
        </li>
      </ul>
    </section>
  );
}