import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaMoneyBillWave, FaUsers, FaChurch, FaProjectDiagram, FaDownload } from "react-icons/fa";
import axios from "axios";
import MyPayouts from "./MyPayouts";

const userToken = window.localStorage.getItem("churpay_token");

export default function ChurchDashboard() {
  const [church, setChurch] = useState(null);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const churchRes = await axios.get("/api/church/profile", {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setChurch(churchRes.data);

        const [projectsRes, donationsRes] = await Promise.all([
          axios.get("https://churpay-backend.onrender.com/api/projects"),
          axios.get("https://churpay-backend.onrender.com/api/donations")
        ]);

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

  const projectNames = projects.map(p => p.title);
  const projectTotals = projects.map(
    p => donations.filter(d => d.project === p.title).reduce((sum, d) => sum + Number(d.amount), 0)
  );

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
        <SummaryCard
          icon={<FaMoneyBillWave className="text-2xl text-purple-700 dark:text-yellow-200" />}
          value={`R${stats.totalGiven.toLocaleString()}`}
          label="Total Given"
          bg="from-purple-50 to-purple-100"
        />
        <SummaryCard
          icon={<FaUsers className="text-2xl text-yellow-600 dark:text-yellow-100" />}
          value={stats.numDonors}
          label="Donors"
          bg="from-yellow-50 to-yellow-100"
        />
        <SummaryCard
          icon={<FaProjectDiagram className="text-2xl text-indigo-700 dark:text-indigo-100" />}
          value={stats.totalProjects}
          label="Projects"
          bg="from-indigo-50 to-indigo-100"
        />
      </div>

      {/* Top actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <ActionButton onClick={downloadCSV} icon={<FaDownload />} text="CSV" />
        <ActionButton onClick={downloadPDF} icon={<FaDownload />} text="PDF" />
        <ActionButton onClick={() => setShowForm(true)} icon={null} text="+ Project" color="green" />
        <ActionButton onClick={() => setShowPayoutForm(true)} icon={null} text="Request Payout" color="gradient" />
      </div>

      {/* Project Add Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
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
            <Input label="Project Title" name="title" required placeholder="e.g. New Roof" />
            <Input label="Goal Amount (R)" name="goal" type="number" required min="1" placeholder="e.g. 10000" />
            <Textarea label="Description" name="description" rows={3} placeholder="Describe the project..." />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Project Image</label>
              <input type="file" name="image" accept="image/*" className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition" />
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all">Add</button>
              <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Recent Donations Table */}
      <DataTable
        title="Recent Donations"
        headers={["Date", "Giver", "Project", "Amount", "Reference"]}
        rows={donations.slice(0, 10).map(d => [
          new Date(d.date).toLocaleString(),
          d.giver,
          d.project,
          `R${d.amount}`,
          d.ref
        ])}
      />

      {/* Projects Overview */}
      <div className="mb-7">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Projects Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-gradient-to-br from-purple-100 to-indigo-50 p-4 rounded-xl shadow relative flex flex-col">
              <div className="font-semibold text-lg">{p.title}</div>
              <div className="text-sm text-gray-500">{p.description}</div>
              <div className="flex items-center mt-2">
                <span className="font-bold text-purple-700 mr-2">Raised:</span>
                <span className="text-green-700">R{p.raised} / R{p.goal}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Complete' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                <button
                  className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 rounded"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/projects/${p.id}`)}
                >Share Project</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income vs Payout Pie Chart and Table */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Income vs. Payouts</h3>
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <div>Total Given: <b>R{stats.totalGiven.toLocaleString()}</b></div>
            <div>Total Payouts: <b>R{(church?.total_payouts || 0).toLocaleString()}</b></div>
            <div>Balance: <b>R{(stats.totalGiven - (church?.total_payouts || 0)).toLocaleString()}</b></div>
          </div>
        </div>
        <div className="mt-3 bg-gray-50 rounded-xl shadow">
          <DataTable
            headers={["Date", "Amount", "Status"]}
            rows={(church?.payouts || []).slice(0, 7).map(p => [
              new Date(p.date).toLocaleString(),
              `R${p.amount}`,
              p.status
            ])}
          />
        </div>
      </div>

      {/* Donor/Member List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Donor List</h3>
        <DataTable
          headers={["Name", "Total Given", "Gifts"]}
          rows={Object.entries(
            donations.reduce((acc, d) => {
              if (!acc[d.giver]) acc[d.giver] = { total: 0, count: 0 };
              acc[d.giver].total += Number(d.amount);
              acc[d.giver].count += 1;
              return acc;
            }, {})
          ).map(([giver, data]) => [giver, `R${data.total}`, data.count])}
        />
        <button
          className="mt-3 bg-purple-700 text-yellow-300 font-bold px-4 py-2 rounded-xl shadow hover:bg-purple-800 transition text-xs"
          onClick={() => {
            const headers = "Name,Total Given,Gifts\n";
            const rows = Object.entries(
              donations.reduce((acc, d) => {
                if (!acc[d.giver]) acc[d.giver] = { total: 0, count: 0 };
                acc[d.giver].total += Number(d.amount);
                acc[d.giver].count += 1;
                return acc;
              }, {})
            ).map(([giver, data]) => `${giver},${data.total},${data.count}`).join("\n");
            const blob = new Blob([headers + rows], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "church_donors.csv";
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          Export Donor List
        </button>
      </div>

      {/* Announcements Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Announcements</h3>
        <form onSubmit={async e => {
          e.preventDefault();
          const announcement = e.target.announcement.value.trim();
          if (!announcement) return;
          alert("Announcement posted (simulate save): " + announcement);
          e.target.reset();
        }}>
          <textarea name="announcement" rows={2} className="w-full p-2 border rounded mb-2" placeholder="Write an announcement..." />
          <button type="submit" className="bg-purple-700 text-yellow-300 font-bold px-4 py-2 rounded-xl shadow hover:bg-purple-800 transition text-xs">
            Post Announcement
          </button>
        </form>
        <ul className="mt-3 list-disc ml-5 text-sm text-purple-700">
          <li>Winter blanket drive is halfway there! 🧣</li>
          <li>New project: Sunday School Upgrade 🚸</li>
        </ul>
      </div>

      {/* Bank Details */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Bank Account Info</h3>
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-purple-50 rounded-xl shadow">
          <div>Bank: <b>{church.bank_name || "—"}</b></div>
          <div>Account Number: <b>{church.bank_account || "—"}</b></div>
          <div>Account Holder: <b>{church.account_holder || "—"}</b></div>
          <button
            className="mt-2 bg-yellow-300 text-purple-900 px-3 py-1 rounded font-bold text-xs shadow"
            onClick={() => alert("Coming soon: update bank info!")}
          >Edit Details</button>
        </div>
      </div>

      {/* Documents Vault */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Documents Vault</h3>
        <div className="flex gap-3 flex-wrap">
          {(church.docs || [{ name: "Bank Letter.pdf", url: "#" }, { name: "Reg Certificate.pdf", url: "#" }]).map((doc, i) => (
            <a key={i} href={doc.url} download className="block bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded shadow">
              {doc.name}
            </a>
          ))}
          <label className="block cursor-pointer bg-yellow-200 px-3 py-2 rounded shadow text-purple-800">
            + Upload
            <input type="file" className="hidden" onChange={e => alert("File upload coming soon!")} />
          </label>
        </div>
      </div>

      {/* Payouts */}
      <div className="my-10">
        <MyPayouts token={userToken} />
      </div>
    </section>
  );
}

// --- Reusable UI Components ---

function SummaryCard({ icon, value, label, bg }) {
  return (
    <div className={`rounded-2xl p-5 shadow bg-gradient-to-br ${bg} flex flex-col items-start`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-opacity-30 mb-3">{icon}</div>
      <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-100">{value}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">{label}</div>
    </div>
  );
}

function ActionButton({ onClick, icon, text, color }) {
  let classes =
    "flex items-center gap-2 font-bold px-4 py-2 rounded-xl shadow transition";
  if (color === "green") {
    classes += " bg-green-600 hover:bg-green-700 text-white";
  } else if (color === "gradient") {
    classes += " bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white";
  } else {
    classes += " bg-purple-700 hover:bg-purple-800 text-yellow-300";
  }
  return (
    <button className={classes} onClick={onClick}>
      {icon} {text}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">{label}</label>
      <input {...props} className="px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 font-semibold text-base shadow focus:outline-none focus:border-indigo-400 transition" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">{label}</label>
      <textarea {...props} className="px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 font-semibold text-base shadow focus:outline-none focus:border-indigo-400 transition" />
    </div>
  );
}

function DataTable({ title, headers, rows }) {
  return (
    <div className="bg-white rounded-2xl shadow mb-7 overflow-x-auto">
      {title && <h3 className="text-xl font-bold text-purple-700 px-6 py-4">{title}</h3>}
      <table className="min-w-full divide-y divide-purple-100">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-extrabold text-purple-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-purple-50 transition-all">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
