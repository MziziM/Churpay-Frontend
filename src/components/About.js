import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-800">About ChurPay</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-700 mb-6">
          ChurPay was founded with a simple mission: to help churches focus more on ministry and less on money management.
        </p>
        
        <p className="text-gray-700 mb-6">
          Our team of passionate developers and church leaders came together to create a solution that makes collecting tithes and offerings as seamless as possible for both churches and their members.
        </p>
        
        <p className="text-gray-700 mb-6">
          We believe that technology should enable ministry, not complicate it. That's why we've designed ChurPay to be intuitive, secure, and affordable for churches of all sizes.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700 mt-8">Our Values</h2>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Integrity</strong> - We believe in transparency and honesty in all our operations.</li>
          <li><strong>Service</strong> - We're here to serve the church community with excellence.</li>
          <li><strong>Innovation</strong> - We're constantly improving our platform to better serve churches.</li>
          <li><strong>Accessibility</strong> - We strive to make our services available to all churches regardless of size.</li>
        </ul>
      </div>
    </div>
  );
}