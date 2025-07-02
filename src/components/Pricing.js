import React from "react";

export default function Pricing() {
  return (
    <section className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">ChurPay Pricing</h2>
      <p className="mb-6 text-lg text-gray-800">
        Simple, transparent, pay-as-you-go pricing.<br/>
        <span className="text-yellow-500 font-semibold">No monthly fees. No surprises.</span>
      </p>
      <div className="bg-purple-50 p-8 rounded-xl mb-6 flex flex-col items-center shadow">
        <span className="text-5xl font-extrabold text-yellow-400 mb-2">2.5%</span>
        <span className="text-lg font-bold text-purple-700 mb-4">per successful transaction</span>
        <ul className="text-gray-700 space-y-2 mb-4 text-center">
          <li>✔ No setup fees</li>
          <li>✔ No monthly minimums</li>
          <li>✔ All features included</li>
          <li>✔ Free support</li>
        </ul>
        <span className="text-xs text-gray-500">* Payout and payment gateway fees included.</span>
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold text-purple-700">Need custom pricing?</span>{" "}
        If your church processes over R100,000/month,{" "}
        <a href="mailto:support@churpay.com" className="text-yellow-500 underline">contact us</a> for a custom rate.
      </div>
      <div className="mt-6 text-center">
        <span className="text-gray-800">Questions?</span>{" "}
        <a href="/faq" className="text-purple-700 font-semibold underline">See our FAQ</a>
      </div>
    </section>
  );
}