import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import jsPDF from "jspdf";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";

export default function MemberDashboard() {
  // --- State ---
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, byMonth: {} });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Giving Goal Feature
  const [givingGoal, setGivingGoal] = useState(5000);

  // Notification Popups
  const [notification, setNotification] = useState("");
  const { width, height } = useWindowSize();

  // --- Fetch Profile Info ---
  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      setMsg(
        <>
          Please log in as a member to view your dashboard.{" "}
          <a href="/login" className="text-purple-700 underline">Go to Login</a>
        </>
      );
      setLoading(false);
      return;
    }
    axios
      .get("/api/profile", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(res => {
        setProfile(res.data);
      })
      .catch(() => {
        setMsg("Failed to load profile. Please login again.");
        setLoading(false);
      });
  }, []);

  // --- Fetch Member Donations ---
  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    axios
      .get("http://localhost:5000/api/donations")
      .then(res => {
        const allTx = res.data;
        // Filter for this member
        const tx = allTx.filter(t => t.giver === profile.name);
        setTransactions(tx);

        // Compute stats
        const total = tx.reduce((sum, t) => sum + Number(t.amount), 0);
        // By month
        const byMonth = {};
        tx.forEach(t => {
          const month = new Date(t.date).toLocaleString("default", { month: "short" });
          byMonth[month] = (byMonth[month] || 0) + Number(t.amount);
        });
        setStats({ total, byMonth });
        setLoading(false);
      })
      .catch(() => {
        setMsg("Failed to load donations.");
        setLoading(false);
      });
  }, [profile, showThankYou]);

  // --- Download PDF receipt for a transaction ---
  function downloadReceipt(tx) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#7c3aed");
    doc.text("ChurPay Giving Receipt", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text(`Date: ${tx.date}`, 20, 40);
    doc.text(`Type: ${tx.type || tx.project}`, 20, 50);
    doc.text(`Amount: R${tx.amount}`, 20, 60);
    doc.text(`Status: Success`, 20, 70);
    doc.text(`Transaction ID: ${tx.ref || tx.id || ""}`, 20, 80);
    doc.text("Thank you for your generosity!", 20, 100);
    doc.save(`receipt_${tx.ref || tx.id || "churpay"}.pdf`);
  }

  // --- Give Now Form submit ---
  function handleGiveSubmit(e) {
    e.preventDefault();
    const type = e.target.type.value;
    const amount = parseFloat(e.target.amount.value);
    if (!type || !amount) return alert("Fill in all fields!");

    const donation = {
      type,
      project: type,
      church: "General",
      amount,
      date: new Date().toISOString().slice(0, 10),
      giver: profile.name,
      ref: "RCPT-" + Math.floor(Math.random() * 1000000),
    };

    axios.post("http://localhost:5000/api/donations", donation)
      .then(() => {
        setShowForm(false);
        setShowThankYou(true);
        setShowConfetti(true);
        setNotification(`You gave R${amount} to ${type}!`);
        setTimeout(() => setNotification(""), 3000);
        setTimeout(() => setShowConfetti(false), 4000);
      })
      .catch(() => alert("Failed to record donation!"));
  }

  // Chart data for recharts
  const chartData = Object.entries(stats.byMonth).map(([month, amt]) => ({
    month, amt,
  }));

  // Impact, badges logic (same as before)
  const givenSoFar = stats.total || 0;
  const progress = Math.min(100, ((givenSoFar / givingGoal) * 100).toFixed(1));
  const impact = [
    {
      label: "Churches Helped",
      icon: "⛪️",
      value: Math.floor((stats.total || 0) / 2000) + 1,
    },
    {
      label: "Projects Funded",
      icon: "🎯",
      value: Math.floor((stats.total || 0) / 1500) + 2,
    },
    {
      label: "Kids Sponsored",
      icon: "🧒🏾",
      value: Math.floor((stats.total || 0) / 500) + 3,
    },
    {
      label: "Meals Provided",
      icon: "🍲",
      value: Math.floor((stats.total || 0) / 100) + 10,
    },
  ];
  const badges = [];
  if ((stats.total || 0) > 0) badges.push({ icon: "🌟", label: "First Gift" });
  if ((stats.total || 0) >= 1000) badges.push({ icon: "🔥", label: "R1000 Club" });
  if ((stats.total || 0) >= 5000) badges.push({ icon: "💎", label: "R5000 Club" });
  if (transactions.length >= 3) badges.push({ icon: "🏅", label: "Consistent Giver" });
  if (transactions.some(tx => tx.amount >= 2000)) badges.push({ icon: "🦁", label: "Big Gift" });

  return (
    <section className="max-w-4xl mx-auto mt-4 md:mt-12 p-2 md:p-8 bg-white rounded-2xl shadow-xl relative overflow-x-auto">
      {/* --- Notification Popup --- */}
      {notification && (
        <div className="fixed top-6 right-3 md:right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce transition-all duration-700">
          {notification}
        </div>
      )}
      {/* --- Confetti and Thank You Modal --- */}
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={300} />
      )}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-sm mx-auto">
            <div className="text-3xl font-bold text-green-700 mb-3">Thank You! 🙏</div>
            <div className="text-lg text-purple-700 mb-5">Your giving makes a difference.</div>
            <button
              onClick={() => setShowThankYou(false)}
              className="mt-4 bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- Top bar --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800">My Giving Dashboard</h2>
        {profile && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-purple-700">{profile.name}</span>
            <span className="inline-block w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-xl text-purple-800">
              {profile.name?.[0]?.toUpperCase() || "M"}
            </span>
          </div>
        )}
      </div>
      {msg && <div className="mb-4 text-red-600">{msg}</div>}

      {/* --- Give Now Button --- */}
      <div className="flex justify-end mb-6">
        <button
          className="bg-yellow-400 text-purple-900 font-bold px-6 py-3 rounded-xl shadow hover:bg-yellow-300 transition w-full sm:w-auto"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Give Now"}
        </button>
      </div>

      {/* --- Give Now Form --- */}
      {showForm && (
        <form
          className="mb-10 p-6 bg-purple-50 rounded-xl shadow-lg max-w-md mx-auto"
          onSubmit={handleGiveSubmit}
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-purple-800">Type</label>
            <select name="type" className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option value="Tithe">Tithe</option>
              <option value="Offering">Offering</option>
              <option value="Missions">Missions</option>
              <option value="Project">Project</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-purple-800">Amount (ZAR)</label>
            <input
              type="number"
              name="amount"
              min="1"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800 w-full"
          >
            Give Now
          </button>
        </form>
      )}

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-xl shadow text-center">
          <div className="text-lg text-purple-700 font-bold mb-2">Total Given</div>
          <div className="text-3xl text-purple-900 font-bold mb-1">R{stats.total}</div>
          <div className="w-full bg-gray-200 rounded h-3 mt-2">
            <div
              className="bg-yellow-400 h-3 rounded"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
          <div className="text-xs text-gray-700 mt-2">
            Progress to Goal: <b>{progress}%</b> (Goal: R{givingGoal})
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow text-center flex flex-col justify-center items-center">
          <div className="text-lg text-purple-700 font-bold mb-2">Impact</div>
          <div className="flex flex-wrap justify-center gap-3">
            {impact.map(i => (
              <span key={i.label} className="bg-yellow-100 px-3 py-1 rounded-full font-bold text-purple-900 text-sm flex items-center gap-2">
                <span className="text-xl">{i.icon}</span>
                {i.value} {i.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- Badges --- */}
      {badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {badges.map(b => (
            <span key={b.label} className="bg-purple-100 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-purple-800 shadow">
              <span className="text-lg">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      )}

      {/* --- Giving by Month Bar Chart --- */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <div className="text-purple-800 font-semibold mb-2">Giving by Month</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amt" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* --- Transactions Table --- */}
      <h3 className="text-xl font-semibold text-purple-700 mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <table className="min-w-full bg-white border rounded-xl">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i}>
                  <td className="py-2 px-4 border-b">{tx.date}</td>
                  <td className="py-2 px-4 border-b">{tx.type || tx.project}</td>
                  <td className="py-2 px-4 border-b">R{tx.amount}</td>
                  <td className="py-2 px-4 border-b font-bold text-green-600">Success</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-purple-700 text-yellow-300 px-3 py-1 rounded shadow hover:bg-purple-800"
                      onClick={() => downloadReceipt(tx)}
                    >
                      PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-purple-700">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}