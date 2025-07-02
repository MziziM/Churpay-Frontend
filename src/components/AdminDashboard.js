import React, { useState } from "react";
import jsPDF from "jspdf";

export default function AdminDashboard() {
  // Dummy data
  const [churches] = useState([
    { id: 1, name: "GCC Faith Center", city: "Johannesburg", status: "Active", joined: "2024-06-15" },
    { id: 2, name: "Bethel Life", city: "Durban", status: "Active", joined: "2024-05-29" },
    { id: 3, name: "Life Changers", city: "Cape Town", status: "Pending", joined: "2024-07-02" },
  ]);
  const [projects] = useState([
    { id: 1, title: "Roof Repair", church: "GCC Faith Center", goal: 10000, raised: 5500, status: "Active" },
    { id: 2, title: "School Shoes Drive", church: "GCC Faith Center", goal: 7000, raised: 3600, status: "Active" },
    { id: 3, title: "Soup Kitchen", church: "Life Changers", goal: 5000, raised: 1900, status: "Pending" },
  ]);
  const [users] = useState([
    { id: 1, name: "Mzizi Mzwakhe", email: "mzizi@email.com", church: "GCC Faith Center", joined: "2024-06-10" },
    { id: 2, name: "Lebo", email: "lebo@email.com", church: "Bethel Life", joined: "2024-06-22" },
    // More dummy users...
  ]);

  // Totals
  const totalChurches = churches.length;
  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalRaised = projects.reduce((sum, p) => sum + p.raised, 0);

  // Download CSV (platform summary)
  function downloadCSV() {
    const headers = ["Church", "Project", "Goal", "Raised", "Status"];
    const rows = projects.map(p =>
      [p.church, p.title, p.goal, p.raised, p.status].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "churpay_platform_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Download PDF (platform summary)
  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#7c3aed");
    doc.text("ChurPay Platform Analytics", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor("#333");
    let y = 35;
    doc.text("Church", 20, y);
    doc.text("Project", 60, y);
    doc.text("Goal", 110, y);
    doc.text("Raised", 140, y);
    doc.text("Status", 170, y);
    y += 7;
    doc.setLineWidth(0.5);
    doc.line(20, y, 200, y);
    projects.forEach(p => {
      y += 8;
      doc.text(p.church, 20, y);
      doc.text(p.title, 60, y);
      doc.text("R" + p.goal, 110, y);
      doc.text("R" + p.raised, 140, y);
      doc.text(p.status, 170, y);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`churpay_platform_analytics.pdf`);
  }

  return (
    <section className="max-w-5xl mx-auto mt-6 md:mt-12 p-2 md:p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">{totalChurches}</p>
          <p className="text-gray-700 mt-2">Churches</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">{totalUsers}</p>
          <p className="text-gray-700 mt-2">Users</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">{totalProjects}</p>
          <p className="text-gray-700 mt-2">Projects</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">R{totalRaised.toLocaleString()}</p>
          <p className="text-gray-700 mt-2">Total Raised</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          className="bg-purple-700 text-yellow-300 font-bold px-5 py-2 rounded-xl shadow hover:bg-purple-800 transition w-full md:w-auto"
          onClick={downloadCSV}
        >
          Download CSV
        </button>
        <button
          className="bg-purple-50 text-purple-700 font-bold px-5 py-2 rounded-xl shadow border border-purple-200 hover:bg-purple-100 transition w-full md:w-auto"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {/* Churches Table */}
      <h3 className="text-xl font-semibold text-purple-700 mb-4 mt-8">Churches</h3>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">City</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {churches.map((c, i) => (
              <tr key={i}>
                <td className="py-2 px-4 border-b">{c.name}</td>
                <td className="py-2 px-4 border-b">{c.city}</td>
                <td className="py-2 px-4 border-b">{c.status}</td>
                <td className="py-2 px-4 border-b">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Projects Table */}
      <h3 className="text-xl font-semibold text-purple-700 mb-4">Projects</h3>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Church</th>
              <th className="py-2 px-4 border-b text-left">Goal</th>
              <th className="py-2 px-4 border-b text-left">Raised</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i}>
                <td className="py-2 px-4 border-b">{p.title}</td>
                <td className="py-2 px-4 border-b">{p.church}</td>
                <td className="py-2 px-4 border-b">R{p.goal.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-purple-800 font-bold">R{p.raised.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <h3 className="text-xl font-semibold text-purple-700 mb-4">Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Church</th>
              <th className="py-2 px-4 border-b text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td className="py-2 px-4 border-b">{u.name}</td>
                <td className="py-2 px-4 border-b">{u.email}</td>
                <td className="py-2 px-4 border-b">{u.church}</td>
                <td className="py-2 px-4 border-b">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}