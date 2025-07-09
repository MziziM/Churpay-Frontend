import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaMoneyBillWave, FaUsers, FaChurch, FaProjectDiagram, FaDownload } from "react-icons/fa";
import axios from "axios";
import MyPayouts from "./MyPayouts";

// Token (use churpay_token for consistency)
const userToken = window.localStorage.getItem("churpay_token");

export default function ChurchDashboard() {
  const [church, setChurch] = useState(null);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch everything on load and when showForm changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Get church profile (main info)
        const churchRes = await axios.get("/api/church/profile", {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setChurch(churchRes.data);

        // 2. Get all projects, donations
        const [projectsRes, donationsRes] = await Promise.all([
          axios.get("https://churpay-backend.onrender.com/api/projects"),
          axios.get("https://churpay-backend.onrender.com/api/donations")
        ]);

        // 3. Filter for this church's projects/donations
        const filteredProjects = projectsRes.data.filter(
          p => p.church === churchRes.data.name
        );
        const filteredDonations = donationsRes.data.filter(
          d => d.church === churchRes.data.name
        );

        setProjects(filteredProjects);
        setDonations(filteredDonations);
      } catch (err) {
        setChurch(null);
        setProjects([]);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  // Add Project logic
  async function handleProjectSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const goal = Number(form.goal.value);
    const description = form.description.value.trim();
    const imageFile = form.image.files[0];
    if (!title || !goal) return alert("All fields required!");
    let imageUrl = "";
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile); // DEMO only
    }
    try {
      const res = await axios.post("https://churpay-backend.onrender.com/api/projects", {
        title,
        goal,
        raised: 0,
        status: "Pending",
        church: church?.name,
        description,
        image: imageUrl,
        created: new Date().toISOString().slice(0, 10)
      });
      setProjects(prev => [res.data, ...prev]);
      setShowForm(false);
      form.reset();
      alert("New project created!");
    } catch {
      alert("Failed to save project. Backend may be offline.");
    }
  }

  // Project approval logic
  function handleProjectApproval(id, newStatus) {
    axios.patch(`https://churpay-backend.onrender.com/api/projects/${id}/status`, { status: newStatus })
      .then(() => {
        setProjects(projects =>
          projects.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
      })
      .catch(() => alert("Failed to update status. Backend may be offline."));
  }

  // Chart data for top projects (if you use Chart.js)
  const projectNames = projects.map(p => p.title);
  const projectTotals = projects.map(
    p => donations.filter(d => d.project === p.title).reduce((sum, d) => sum + Number(d.amount), 0)
  );

  // Summary stats
  const stats = {
    totalGiven: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    numDonors: new Set(donations.map(d => d.giver)).size,
    totalProjects: projects.length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-purple-600 text-xl font-bold">
        Loading church dashboard...
      </div>
    );
  }

  if (!church) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600 text-xl font-bold">
        Failed to load church data.
      </div>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-3 py-8 font-inter">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-10 mb-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
        <div className="flex items-center gap-6 flex-1">
          <FaChurch className="text-7xl drop-shadow-xl" />
          <div>
            <div className="text-lg font-semibold tracking-wide mb-1">Welcome,</div>
            <div className="text-3xl font-bold leading-tight">{church.name}</div>
            <div className="text-base font-mono text-yellow-200 mt-1 flex items-center gap-2">
              <span className="font-semibold text-xs text-purple-100">Account Number:</span>
              <span className="bg-purple-900 text-yellow-200 px-2 py-0.5 rounded text-xs tracking-widest" title="Account Number">
                {String(church.account_number || "").padStart(7, '0')}
              </span>
            </div>
            <div className="text-base font-medium text-white mt-0.5">Church</div>
            <div className="text-xs mt-2 text-purple-200">"Track your church giving and projects at a glance."</div>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
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
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold px-4 py-2 rounded-xl shadow transition"
          onClick={() => setShowPayoutForm(true)}
        >
          Request Payout
        </button>
      </div>

      {/* Project Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <form
            className="w-full max-w-lg mx-auto bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-800 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
            onSubmit={handleProjectSubmit}
          >
            <div className="flex items-center justify-center mb-2">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white text-2xl shadow-lg mr-3">
                <FaProjectDiagram />
              </span>
              <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center tracking-tight">Add Project</h2>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Project Title</label>
              <input type="text" name="title" required className="px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 font-semibold text-base shadow focus:outline-none focus:border-indigo-400 transition" placeholder="e.g. New Roof" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Goal Amount (R)</label>
              <input type="number" name="goal" required min="1" className="px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 font-semibold text-base shadow focus:outline-none focus:border-indigo-400 transition" placeholder="e.g. 10000" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Description</label>
              <textarea name="description" rows={3} className="px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 font-semibold text-base shadow focus:outline-none focus:border-indigo-400 transition" placeholder="Describe the project..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Project Image</label>
              <input type="file" name="image" accept="image/*" className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition" />
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all">Add</button>
              <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Payouts (modal trigger, or show in section) */}
      <div className="my-10">
        <MyPayouts token={userToken} />
      </div>
    </section>
  );
}
