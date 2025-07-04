import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale);
import axios from "axios";
import { FaMoneyBillWave, FaUsers, FaChurch, FaProjectDiagram, FaRegCalendarCheck, FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import PayoutRequestForm from "./PayoutRequestForm";
import MyPayouts from "./MyPayouts";

// Replace with your real logic for fetching the user's token:
const userToken = window.localStorage.getItem("jwt_token");

export default function ChurchDashboard() {
  const CHURCH_NAME = "GCC Faith Center";
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/projects")
      .then(res => setProjects(res.data.filter(p => p.church === CHURCH_NAME)))
      .catch(() => setProjects([]));
    axios.get("http://localhost:5000/api/donations")
      .then(res => setDonations(res.data.filter(d => d.church === CHURCH_NAME)))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, [showForm]);

  // Download CSV of donations
  function downloadCSV() {
    const headers = ["Date", "Project", "Giver", "Amount", "Reference"];
    const rows = donations.map(d =>
      [d.date, d.project, d.giver, d.amount, d.ref].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "churpay_church_donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Download PDF
  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#7c3aed");
    doc.text("Church Giving Statement", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor("#333");
    let y = 35;
    doc.text("Date", 20, y);
    doc.text("Project", 50, y);
    doc.text("Giver", 100, y);
    doc.text("Amount", 140, y);
    doc.text("Ref", 170, y);
    y += 7;
    doc.setLineWidth(0.5);
    doc.line(20, y, 200, y);
    donations.forEach(d => {
      y += 8;
      doc.text(d.date, 20, y);
      doc.text(d.project, 50, y);
      doc.text(d.giver, 100, y);
      doc.text("R" + d.amount, 140, y);
      doc.text(d.ref, 170, y);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`church_giving_statement.pdf`);
  }

  function handleProjectSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const goal = Number(form.goal.value);
    if (!title || !goal) return alert("All fields required!");

    axios.post("http://localhost:5000/api/projects", {
      title,
      goal,
      raised: 0,
      status: "Pending",
      church: CHURCH_NAME,
      description: "",
      image: "",
      created: new Date().toISOString().slice(0, 10)
    })
      .then(res => {
        setProjects(prev => [res.data, ...prev]);
        setShowForm(false);
        form.reset();
        alert("New project created!");
      })
      .catch(() => alert("Failed to save project. Backend may be offline."));
  }

  function handleProjectApproval(id, newStatus) {
    axios.patch(`http://localhost:5000/api/projects/${id}/status`, { status: newStatus })
      .then(() => {
        setProjects(projects =>
          projects.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
      })
      .catch(() => alert("Failed to update status. Backend may be offline."));
  }

  // Chart data for top projects
  const projectNames = projects.map(p => p.title);
  const projectTotals = projects.map(
    p => donations.filter(d => d.project === p.title).reduce((sum, d) => sum + Number(d.amount), 0)
  );
  const barData = {
    labels: projectNames,
    datasets: [
      {
        label: "Raised (R)",
        data: projectTotals,
        backgroundColor: "#a78bfa"
      }
    ]
  };

  // Summary stats
  const stats = {
    totalGiven: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    numDonors: new Set(donations.map(d => d.giver)).size,
    totalProjects: projects.length,
  };

  return (
    <section className="max-w-6xl mx-auto mt-8 md:mt-12 p-2 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      {/* Hero header and summary cards (MemberDashboard style) */}
      <div className="mb-10">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6 bg-gradient-to-r from-purple-100 via-indigo-100 to-yellow-100 dark:from-purple-900 dark:via-indigo-900 dark:to-gray-900 shadow flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-purple-200 dark:bg-purple-800 shadow-md">
            <FaChurch className="text-4xl text-purple-600 dark:text-purple-200" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-extrabold text-purple-800 dark:text-purple-200 mb-1">
              Welcome, {CHURCH_NAME}
            </div>
            <div className="text-md md:text-lg text-gray-700 dark:text-gray-300 font-medium">
              Track your church giving and projects at a glance
            </div>
          </div>
        </div>
        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl p-5 shadow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-gray-900 flex flex-col items-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-700 mb-3">
              <FaMoneyBillWave className="text-2xl text-purple-700 dark:text-yellow-200" />
            </div>
            <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-100">
              R{stats.totalGiven.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">Total Given</div>
          </div>
          <div className="rounded-2xl p-5 shadow bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-gray-900 flex flex-col items-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-200 dark:bg-yellow-700 mb-3">
              <FaUsers className="text-2xl text-yellow-600 dark:text-yellow-100" />
            </div>
            <div className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-100">
              {stats.numDonors}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">Donors</div>
          </div>
          <div className="rounded-2xl p-5 shadow bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-gray-900 flex flex-col items-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-200 dark:bg-indigo-700 mb-3">
              <FaProjectDiagram className="text-2xl text-indigo-700 dark:text-indigo-100" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-100">
              {stats.totalProjects}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">Projects</div>
          </div>
        </div>
      </div>

      {/* Top actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <button
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold px-4 py-2 rounded-xl shadow transition"
          onClick={downloadCSV}
        >
          <FaDownload /> CSV
        </button>
        <button
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-yellow-300 font-bold px-4 py-2 rounded-xl shadow transition"
          onClick={downloadPDF}
        >
          <FaDownload /> PDF
        </button>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl shadow transition"
          onClick={() => setShowForm(true)}
        >
          + Project
        </button>
      </div>

      {/* Payouts */}
      <div className="my-10">
        <PayoutRequestForm token={userToken} />
        <MyPayouts token={userToken} />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-10 shadow-xl">
        <div className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-300 mb-3 font-bold">
          <FaRegCalendarCheck /> Top Projects
        </div>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={70} />
      </div>

      {/* Create Project Form */}
      {showForm && (
        <form
          className="mb-10 p-6 bg-purple-50 dark:bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto"
          onSubmit={handleProjectSubmit}
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-purple-800 dark:text-purple-200">Project Title</label>
            <input
              type="text"
              name="title"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-purple-800 dark:text-purple-200">Goal Amount (ZAR)</label>
            <input
              type="number"
              name="goal"
              min="1"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800 w-full"
          >
            Create Project
          </button>
          <button
            type="button"
            className="mt-4 bg-gray-300 dark:bg-gray-700 text-purple-700 dark:text-purple-200 px-6 py-2 rounded shadow w-full"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Project List */}
      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4 mt-8 flex items-center gap-2">
        <FaProjectDiagram /> Projects
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Goal</th>
              <th className="py-2 px-4 border-b text-left">Raised</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Created</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i}>
                <td className="py-2 px-4 border-b">{p.title}</td>
                <td className="py-2 px-4 border-b">R{p.goal.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-purple-800 dark:text-purple-200 font-bold">
                  R{donations.filter(d => d.project === p.title).reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
                </td>
                <td className={`py-2 px-4 border-b font-semibold ${
                  p.status === "Pending"
                    ? "text-yellow-500"
                    : p.status === "Active"
                    ? "text-green-600 dark:text-green-300"
                    : "text-red-500 dark:text-red-400"
                } flex items-center gap-1`}>
                  {p.status === "Active" && <FaCheckCircle />}
                  {p.status === "Rejected" && <FaTimesCircle />}
                  {p.status}
                </td>
                <td className="py-2 px-4 border-b">{p.created}</td>
                <td className="py-2 px-4 border-b">
                  {p.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                        onClick={() => handleProjectApproval(p.id, "Active")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                        onClick={() => handleProjectApproval(p.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-purple-700 dark:text-purple-300">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Donations Table */}
      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4 mt-10 flex items-center gap-2">
        <FaMoneyBillWave /> Donations
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Project</th>
              <th className="py-2 px-4 border-b text-left">Giver</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Reference</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr key={i}>
                <td className="py-2 px-4 border-b">{d.date}</td>
                <td className="py-2 px-4 border-b">{d.project}</td>
                <td className="py-2 px-4 border-b">{d.giver}</td>
                <td className="py-2 px-4 border-b">R{d.amount.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{d.ref}</td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-purple-700 dark:text-purple-300">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}