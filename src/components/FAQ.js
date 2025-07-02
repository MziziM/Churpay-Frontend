import React from "react";

export default function FAQ() {
  return (
    <section className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-purple-700">How do I sign my church up?</p>
          <p className="text-gray-800">Click “Get Started” on our homepage and fill in your church details. Our team will contact you to complete your registration.</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">What payment methods are supported?</p>
          <p className="text-gray-800">ChurPay supports EFT (Ozow), card payments, QR code, and more.</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">How soon does my church receive funds?</p>
          <p className="text-gray-800">Most payouts happen instantly or within one business day, depending on your bank.</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">What are your fees?</p>
          <p className="text-gray-800">We charge a simple per-transaction fee—no monthly costs, no hidden charges.</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">Can we use ChurPay for events?</p>
          <p className="text-gray-800">Absolutely! ChurPay makes it easy to sell event tickets, register attendees, and track all payments in one place.</p>
        </div>
      </div>
    </section>
  );
}