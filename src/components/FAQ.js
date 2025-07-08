// src/components/FAQ.js
import React from "react";

export default function FAQ() {
  return (
    <section className="px-6 py-10 bg-purple-50">
      <h2 className="text-3xl font-bold text-center mb-6">❓Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <h4 className="font-semibold">How do I give?</h4>
          <p className="text-gray-600">Simply log in, click “Give Now”, and select your church or project.</p>
        </div>
        <div>
          <h4 className="font-semibold">Is ChurPay secure?</h4>
          <p className="text-gray-600">Yes, your data is encrypted and handled with care.</p>
        </div>
      </div>
    </section>
  );
}