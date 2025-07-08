import React, { useState, useEffect } from "react";
import { FaChurch, FaHandsHelping, FaChild, FaUtensils, FaUserCircle, FaMedal, FaArrowUp, FaSpinner } from "react-icons/fa";
import { MdStar, MdRepeat, MdTrendingUp } from "react-icons/md";
import jsPDF from "jspdf";
import { memberAPI, getUserData, getDonationStats, getProjects } from "../api";

const BADGE_LIST = [
  { key: "firstGift", label: "First Gift", icon: <MdStar className="inline mb-1 text-yellow-400" /> },
  { key: "r1000Club", label: "R1000 Club", icon: <FaMedal className="inline mb-1 text-yellow-400" /> },
  { key: "r5000Club", label: "R5000 Club", icon: <FaMedal className="inline mb-1 text-yellow-600" /> },
  { key: "consistentGiver", label: "Consistent Giver", icon: <MdRepeat className="inline mb-1 text-green-400" /> },
  { key: "bigGift", label: "Big Gift", icon: <MdTrendingUp className="inline mb-1 text-purple-400" /> },
];

export default function MemberDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
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
    memberName: "Your Name",
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(stats.goal);

  const [atTop, setAtTop] = useState(true);
  const [givingType, setGivingType] = useState("Tithe");
  const [showGiveOptions, setShowGiveOptions] = useState(false);
  const [giveAmount, setGiveAmount] = useState(100);

  useEffect(() => {
    function handleScroll() {
      setAtTop(window.scrollY < 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [error, setError] = useState(null);
  
  // Fetch member dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await memberAPI.getDashboard();
        const { data } = response;
        
        setDonations(data.donations || []);
        setStats({
          ...data.stats,
          goal: data.stats?.goal || 5000,
          recurring: data.stats?.recurring || { enabled: false, type: "Tithe", amount: 500 },
          badges: data.stats?.badges || {},
          monthlyTrend: data.stats?.monthlyTrend || [],
          memberName: data.stats?.memberName || "Your Name",
          churchName: data.stats?.churchName || "Your Church",
          memberAccountNumber: 1000000,
        });
        setNewGoal(data.stats?.goal || 5000);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Could not load your dashboard. Please try again later.");
        
        // Demo fallback data for development/testing purposes
        /*
        if (process.env.NODE_ENV === 'development') {
          setDonations([
            { id: 1, date: new Date(), project: "Youth Ministry", amount: 1000 },
            { id: 2, date: new Date(), project: "Food Drive", amount: 250 },
            { id: 3, date: new Date(), project: "Mission Sunday", amount: 500 },
          ]);
          setStats({
            totalGiven: 6250,
            transactions: 5,
            activeGivers: 3,
            churchesHelped: 4,
            projectsFunded: 6,
            kidsSponsored: 15,
            mealsProvided: 72,
            badges: {
              firstGift: true,
              r1000Club: true,
              r5000Club: true,
              consistentGiver: true,
              bigGift: false,
            },
            goal: 5000,
            recurring: { enabled: true, type: "Tithe", amount: 500 },
            monthlyTrend: [200, 500, 1000, 0, 2000, 1550, 800],
            memberName: "Mzizi Mzwakhe",
            churchName: "Grace Community Church",
            memberAccountNumber: 1000000,
          });
        }
        */
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Animation for goal bar
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    if (!loading) {
      const pct = Math.min((stats.totalGiven / stats.goal) * 100, 100);
      setTimeout(() => setBarWidth(pct), 300);
    }
  }, [loading, stats.totalGiven, stats.goal]);

  // Add API endpoint for updating member goals
  const [updatingGoal, setUpdatingGoal] = useState(false);
  
  const handleGoalSave = async () => {
    if (newGoal <= 0) {
      alert("Please enter a valid goal amount greater than zero");
      return;
    }
    
    setUpdatingGoal(true);
    try {
      // We need to add this endpoint to our API
      await memberAPI.updateGoal(Number(newGoal));
      
      // Update local state after successful API call
      setStats(prev => ({ ...prev, goal: Number(newGoal) }));
      setEditingGoal(false);
      setTimeout(() => setBarWidth(Math.min((stats.totalGiven / newGoal) * 100, 100)), 200);
    } catch (err) {
      console.error("Error updating goal:", err);
      alert("Failed to update your giving goal. Please try again.");
    } finally {
      setUpdatingGoal(false);
    }
  };

  // CSV Download
  function downloadCSV() {
    const headers = ["Date", "Project", "Amount"];
    const rows = donations.map(d =>
      [new Date(d.date).toLocaleString(), d.project, d.amount].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `churpay_donations_${stats.memberName.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // PDF Statement Download
  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#7c3aed");
    doc.text("ChurPay Giving Statement", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text(`Name: ${stats.memberName || "-"}`, 20, 35);
    doc.text(`Church: ${stats.churchName || "-"}`, 20, 43);
    doc.text(`Total Given: R${stats.totalGiven}`, 20, 51);
    doc.text("Recent Donations:", 20, 61);
    let y = 70;
    doc.setFontSize(10);
    doc.text("Date", 20, y);
    doc.text("Project", 70, y);
    doc.text("Amount", 150, y);
    y += 6;
    donations.slice(0, 20).forEach(d => {
      doc.text(new Date(d.date).toLocaleString(), 20, y);
      doc.text(d.project, 70, y);
      doc.text("R" + d.amount, 150, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`churpay_statement_${stats.memberName.replace(/\s+/g, "_")}.pdf`);
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-8 font-inter">
      {/* Loading and Error State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
        {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 rounded-3xl shadow-xl p-10 mb-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
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
                onSubmit={e => {
                  e.preventDefault();
                  setShowGiveOptions(false);
                  const payfastUrl = `https://sandbox.payfast.co.za/eng/process?amount=${giveAmount}&item_name=${givingType}`;
                  window.location.href = payfastUrl;
                }}
              >
                <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Giving Type</label>
                <select
                  value={givingType}
                  onChange={e => setGivingType(e.target.value)}
                  className="mb-3 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-purple-800 dark:text-yellow-100 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="Tithe">Offerings</option>
                  <option value="Tithe">Tithe</option>
                </select>
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
      {/* Dashboard Main */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center hover:shadow-lg transition-all duration-200">
          <div className="text-2xl font-extrabold text-purple-700 mb-1 animate-pulse">R{stats.totalGiven}</div>
          <div className="text-xs text-gray-500 font-semibold tracking-wide">Total Given</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center hover:shadow-lg transition-all duration-200">
          <div className="text-2xl font-extrabold text-indigo-600 mb-1">{stats.transactions}</div>
          <div className="text-xs text-gray-500 font-semibold tracking-wide">Transactions</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center hover:shadow-lg transition-all duration-200">
          <div className="text-2xl font-extrabold text-green-600 mb-1">{stats.activeGivers}</div>
          <div className="text-xs text-gray-500 font-semibold tracking-wide">Active Givers</div>
        </div>
      </div>
      {/* Impact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center text-sm font-semibold">
        <div className="bg-purple-50 py-5 rounded-2xl shadow flex flex-col items-center">
          <FaChurch className="text-2xl text-purple-400 mb-1" />{stats.churchesHelped}
          <div className="text-xs text-gray-500 font-normal mt-1">Churches</div>
        </div>
        <div className="bg-purple-50 py-5 rounded-2xl shadow flex flex-col items-center">
          <FaHandsHelping className="text-2xl text-indigo-400 mb-1" />{stats.projectsFunded}
          <div className="text-xs text-gray-500 font-normal mt-1">Projects</div>
        </div>
        <div className="bg-purple-50 py-5 rounded-2xl shadow flex flex-col items-center">
          <FaChild className="text-2xl text-yellow-400 mb-1" />{stats.kidsSponsored}
          <div className="text-xs text-gray-500 font-normal mt-1">Kids</div>
        </div>
        <div className="bg-purple-50 py-5 rounded-2xl shadow flex flex-col items-center">
          <FaUtensils className="text-2xl text-green-400 mb-1" />{stats.mealsProvided}
          <div className="text-xs text-gray-500 font-normal mt-1">Meals</div>
        </div>
      </div>
      {/* Badges */}
      <div className="mb-6">
        <div className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
          <MdStar className="text-yellow-400" /> Your Giving Badges
        </div>
        <div className="flex flex-wrap gap-2">
          {BADGE_LIST.map(badge =>
            stats.badges[badge.key] ? (
              <span key={badge.key} className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm animate-fade-in">
                {badge.icon}{badge.label}
              </span>
            ) : (
              <span key={badge.key} className="flex items-center gap-1 bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold shadow-sm opacity-60">
                {badge.icon}{badge.label}
              </span>
            )
          )}
        </div>
      </div>
      {/* Recurring Giving */}
      <div className="mb-6 bg-white rounded-2xl p-5 shadow flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-purple-300">
        <div>
          <div className="font-semibold text-purple-700 mb-1 flex items-center gap-2">
            <MdRepeat className="text-green-400" /> Recurring Giving
          </div>
          <div className="text-xs text-gray-500 mb-2">Automatic monthly giving for peace of mind</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs font-medium">
            <input
              type="checkbox"
              checked={stats.recurring.enabled}
              onChange={async (e) => {
                const newValue = e.target.checked;
                try {
                  await memberAPI.updateRecurring({
                    ...stats.recurring,
                    enabled: newValue
                  });
                  setStats(prev => ({ 
                    ...prev, 
                    recurring: { ...prev.recurring, enabled: newValue } 
                  }));
                } catch (err) {
                  console.error("Error updating recurring settings:", err);
                  alert("Failed to update your recurring giving settings. Please try again.");
                }
              }}
              className="accent-purple-500"
            />
            Auto-Give
          </label>
          <select
            value={stats.recurring.type}
            onChange={async (e) => {
              const newType = e.target.value;
              try {
                await memberAPI.updateRecurring({
                  ...stats.recurring,
                  type: newType
                });
                setStats(prev => ({ 
                  ...prev, 
                  recurring: { ...prev.recurring, type: newType } 
                }));
              } catch (err) {
                console.error("Error updating recurring settings:", err);
                alert("Failed to update your recurring giving settings. Please try again.");
              }
            }}
            className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs"
          >
            <option>Tithe</option>
            <option>Offering</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            value={stats.recurring.amount}
            onChange={(e) => {
              const value = e.target.value;
              setStats(prev => ({ 
                ...prev, 
                recurring: { ...prev.recurring, amount: value } 
              }));
            }}
            onBlur={async (e) => {
              const amount = Number(e.target.value);
              if (amount > 0) {
                try {
                  await memberAPI.updateRecurring({
                    ...stats.recurring,
                    amount: amount
                  });
                } catch (err) {
                  console.error("Error updating recurring settings:", err);
                  alert("Failed to update your recurring giving settings. Please try again.");
                }
              }
            }}
            min={1}
            className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs w-20"
          />
          <span className="ml-1 text-xs text-gray-500">Monthly</span>
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
          <div className="text-xs text-gray-500">{Math.min((stats.totalGiven / stats.goal) * 100, 100).toFixed(0)}% of goal</div>
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
                  height: `${amt / Math.max(...stats.monthlyTrend, 1) * 80}px`,
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
      </>
      )}
    </div>
  );
}