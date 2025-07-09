import React, { useState, useEffect } from "react";
import { FaChurch, FaHandsHelping, FaChild, FaUtensils, FaUserCircle, FaMedal, FaArrowUp, FaSpinner } from "react-icons/fa";
import { MdStar, MdRepeat, MdTrendingUp } from "react-icons/md";
import jsPDF from "jspdf";
import { memberAPI } from "../api";
import axios from "axios";

const BADGE_LIST = [
  { key: "firstGift", label: "First Gift", icon: <MdStar className="inline mb-1 text-yellow-400" /> },
  { key: "r1000Club", label: "R1000 Club", icon: <FaMedal className="inline mb-1 text-yellow-400" /> },
  { key: "r5000Club", label: "R5000 Club", icon: <FaMedal className="inline mb-1 text-yellow-600" /> },
  { key: "consistentGiver", label: "Consistent Giver", icon: <MdRepeat className="inline mb-1 text-green-400" /> },
  { key: "bigGift", label: "Big Gift", icon: <MdTrendingUp className="inline mb-1 text-purple-400" /> },
];

const DEFAULT_STATS = {
  memberName: "Your Name",
  memberAccountNumber: "",
  churchName: "Your Church",
  totalGiven: 0,
  transactions: 0,
  activeGivers: "-",
  churchesHelped: 0,
  projectsFunded: 0,
  kidsSponsored: 0,
  mealsProvided: 0,
  badges: {},
  goal: 5000,
  recurring: { enabled: false, type: "Tithe", amount: 500 },
  monthlyTrend: [],
};

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [donations, setDonations] = useState([]);
  const [showGiveOptions, setShowGiveOptions] = useState(false);
  const [giveAmount, setGiveAmount] = useState(100);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(DEFAULT_STATS.goal);
  const [updatingGoal, setUpdatingGoal] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await memberAPI.getDashboard();
        setStats({
          ...DEFAULT_STATS,
          ...data.stats,
          memberName: data.stats?.memberName || DEFAULT_STATS.memberName,
          memberAccountNumber: data.stats?.memberAccountNumber || DEFAULT_STATS.memberAccountNumber,
          churchName: data.stats?.churchName || DEFAULT_STATS.churchName,
          goal: data.stats?.goal || DEFAULT_STATS.goal,
          recurring: data.stats?.recurring || DEFAULT_STATS.recurring,
          badges: data.stats?.badges || DEFAULT_STATS.badges,
          monthlyTrend: data.stats?.monthlyTrend || DEFAULT_STATS.monthlyTrend,
        });
        setDonations(data.donations || []);
        setNewGoal(data.stats?.goal || DEFAULT_STATS.goal);
      } catch (err) {
        setError("Failed to load dashboard.");
      }
      setLoading(false);
    }
    fetchAll();
    // eslint-disable-next-line
  }, []);

  // Bar width for goal progress
  const totalGiven = Number(stats.totalGiven) || 0;
  const goal = Number(stats.goal) || 1;
  const barWidth = Math.min((totalGiven / goal) * 100, 100);

  function handleGiveNow(e) {
    e.preventDefault();
    setShowGiveOptions(false);
    let itemName = stats.churchName ? `Church: ${stats.churchName}` : "ChurPay Member Gift";
    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?amount=${giveAmount}&item_name=${encodeURIComponent(itemName)}&custom_str1=ACC${stats.memberAccountNumber}`;
    window.location.href = payfastUrl;
  }

  async function handleGoalSave() {
    setUpdatingGoal(true);
    try {
      await memberAPI.updateGoal({ goal: newGoal });
      setStats(prev => ({ ...prev, goal: newGoal }));
      setEditingGoal(false);
    } catch (err) {
      alert("Failed to update goal.");
    }
    setUpdatingGoal(false);
  }

  function downloadCSV() {
    if (!donations.length) return;
    const headers = "Date,Project,Amount\n";
    const rows = donations.map(d => `${new Date(d.date).toLocaleString()},${d.project},R${d.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function downloadPDF() {
    if (!donations.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ChurPay Giving Statement", 14, 18);
    doc.setFontSize(10);
    doc.text(`Name: ${stats.memberName || ""}`, 14, 28);
    doc.text(`Church: ${stats.churchName || ""}`, 14, 34);
    doc.text(`Account #: ${stats.memberAccountNumber || ""}`, 14, 40);
    doc.setFontSize(12);
    doc.text("Recent Donations:", 14, 50);
    let y = 60;
    doc.setFontSize(10);
    donations.slice(0, 10).forEach(d => {
      doc.text(`${new Date(d.date).toLocaleString()}  |  ${d.project}  |  R${d.amount}`, 14, y);
      y += 7;
    });
    doc.save("ChurPay-Donations.pdf");
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-3xl text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-8 font-inter">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-10 mb-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
        <div className="flex items-center gap-6 flex-1">
          <FaUserCircle className="text-7xl drop-shadow-xl" />
          <div>
            <div className="text-lg font-semibold tracking-wide mb-1">Welcome back,</div>
            <div className="text-3xl font-bold leading-tight">{stats.memberName}</div>
            {stats.memberAccountNumber && (
              <div className="text-base font-mono text-yellow-200 mt-1 flex items-center gap-2">
                <span className="font-semibold text-xs text-purple-100">Account Number:</span>
                <span className="bg-purple-900 text-yellow-200 px-2 py-0.5 rounded text-xs tracking-widest" title="Account Number">
                  {String(stats.memberAccountNumber).padStart(7, '0')}
                </span>
              </div>
            )}
            <div className="text-base font-medium text-white mt-0.5">Member</div>
            <div className="text-base font-semibold text-yellow-200 mt-1 flex items-center gap-2">
              <FaChurch className="inline text-yellow-300" /> {stats.churchName || "No church linked"}
            </div>
            <div className="text-xs mt-2 text-purple-200">"Your giving is making an eternal impact."</div>
          </div>
        </div>
        {/* Give Now Button in Hero Card */}
        <div className="flex flex-col items-end relative mt-6 md:mt-0">
          <button
            className="bg-gradient-to-r from-yellow-400 to-purple-500 hover:from-purple-500 hover:to-yellow-400 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl transition-all border-2 border-white"
            onClick={() => setShowGiveOptions(prev => !prev)}
          >
            Give Now
          </button>
          {showGiveOptions && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowGiveOptions(false)}>
              <form
                className="flex flex-col bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-700 rounded-xl shadow-2xl p-6 w-72 z-40 relative"
                onClick={e => e.stopPropagation()}
                onSubmit={handleGiveNow}
              >
                <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Amount (R)</label>
                <input
                  type="number"
                  min={1}
                  value={giveAmount}
                  onChange={e => setGiveAmount(e.target.value)}
                  className="mb-3 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-purple-800 dark:text-yellow-100 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-6 py-2 rounded-full text-base font-bold shadow-xl transition-all mb-2"
                >
                  Give Now
                </button>
                <button
                  type="button"
                  className="text-gray-500 dark:text-gray-300 font-medium py-1 rounded hover:bg-purple-50 dark:hover:bg-gray-800 transition text-xs"
                  onClick={() => setShowGiveOptions(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      {/* Giving Goal Card */}
      <div className="mb-7 bg-gradient-to-r from-yellow-50 via-yellow-100 to-purple-50 rounded-2xl p-5 shadow-md relative">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-700 text-sm">Giving Goal: </span>
            {editingGoal ? (
              <>
                <input
                  type="number"
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  className="w-20 px-1 py-0.5 border rounded"
                  disabled={updatingGoal}
                />
                <button
                  className="ml-2 text-green-600 text-xs font-semibold flex items-center gap-1"
                  onClick={handleGoalSave}
                  disabled={updatingGoal}
                >
                  {updatingGoal && <FaSpinner className="animate-spin text-xs" />}
                  Save
                </button>
                <button
                  className="ml-1 text-gray-500 text-xs"
                  onClick={() => setEditingGoal(false)}
                  disabled={updatingGoal}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="font-bold text-yellow-700 text-lg">R{stats.goal}</span>
                <button className="ml-2 text-xs text-purple-600 underline" onClick={() => setEditingGoal(true)}>Edit</button>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">{barWidth.toFixed(0)}% of goal</div>
        </div>
        <div className="mt-3 h-4 bg-yellow-100 rounded overflow-hidden shadow-inner">
          <div
            className="h-4 bg-gradient-to-r from-yellow-400 to-purple-400 transition-all duration-700"
            style={{ width: `${barWidth}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 mt-1">Given so far: <b>R{stats.totalGiven}</b></div>
      </div>
      {/* Monthly Giving Trend */}
      <div className="mb-8">
        <div className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
          <FaArrowUp className="text-green-400" /> Monthly Giving Trend
        </div>
        <div className="h-24 w-full bg-purple-50 rounded-xl flex items-end gap-2 px-2 border border-purple-100 shadow-sm">
          {stats.monthlyTrend && stats.monthlyTrend.length > 0 ? (
            stats.monthlyTrend.map((amt, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-purple-500 via-purple-300 to-purple-100 rounded-t-lg w-7 hover:scale-110 transition-transform"
                style={{
                  height: `${(amt / Math.max(...stats.monthlyTrend, 1) * 80)}px`,
                  minHeight: 6,
                }}
                title={`R${amt}`}
              ></div>
            ))
          ) : (
            <div className="text-gray-400 text-xs">No data</div>
          )}
        </div>
      </div>
      {/* Recent Donations */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
        <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2">
          <FaHandsHelping className="text-purple-400" /> Recent Donations
        </h2>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="bg-purple-700 text-yellow-300 font-bold px-5 py-2 rounded-xl shadow hover:bg-purple-800 transition text-xs md:text-sm"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-yellow-400 text-purple-900 font-bold px-5 py-2 rounded-xl shadow hover:bg-yellow-300 transition text-xs md:text-sm"
          >
            Download PDF Statement
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-purple-100">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-extrabold text-purple-700">Date</th>
              <th className="px-3 py-3 text-left text-xs font-extrabold text-purple-700">Project</th>
              <th className="px-3 py-3 text-left text-xs font-extrabold text-purple-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-7">
                  No donations yet. Start your giving journey!
                </td>
              </tr>
            )}
            {donations.slice(0, 6).map(d => (
              <tr key={d.id} className="hover:bg-purple-50 transition-all">
                <td className="px-3 py-2 text-sm">{new Date(d.date).toLocaleString()}</td>
                <td className="px-3 py-2 text-sm">{d.project}</td>
                <td className="px-3 py-2 text-sm font-bold text-purple-700">R{d.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer/Call to Action */}
      <div className="text-xs text-gray-400 mt-2 text-center">
        Thank you for being a blessing through ChurPay. Every rand counts! 💜
      </div>
    </div>
  );
}