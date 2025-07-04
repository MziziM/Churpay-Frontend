import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChurch, FaHandsHelping, FaChild, FaUtensils, FaUserCircle, FaMedal, FaArrowUp } from "react-icons/fa";
import { MdStar, MdRepeat, MdTrendingUp } from "react-icons/md";

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

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    axios
      .get("https://churpay-backend.onrender.com/api/member/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setDonations(res.data.donations);
        setStats({
          ...res.data.stats,
          goal: res.data.stats.goal || 5000,
          recurring: res.data.stats.recurring || { enabled: false, type: "Tithe", amount: 500 },
          badges: res.data.stats.badges || {},
          monthlyTrend: res.data.stats.monthlyTrend || [],
          memberName: res.data.stats.memberName || "Your Name",
        });
        setNewGoal(res.data.stats.goal || 5000);
        setLoading(false);
      })
      .catch(() => {
        // Demo fallback
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
        });
        setLoading(false);
      });
  }, []);

  // Animation for goal bar
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    if (!loading) {
      const pct = Math.min((stats.totalGiven / stats.goal) * 100, 100);
      setTimeout(() => setBarWidth(pct), 300);
    }
  }, [loading, stats.totalGiven, stats.goal]);

  const handleGoalSave = () => {
    setStats(prev => ({ ...prev, goal: Number(newGoal) }));
    setEditingGoal(false);
    setTimeout(() => setBarWidth(Math.min((stats.totalGiven / newGoal) * 100, 100)), 200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-8 font-inter">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-6 mb-7 text-white overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-6xl drop-shadow-xl" />
          <div>
            <div className="text-lg font-semibold tracking-wide mb-1">Welcome back,</div>
            <div className="text-2xl font-bold leading-tight">{stats.memberName}</div>
            <div className="text-xs mt-2 text-purple-200">"Your giving is making an eternal impact."</div>
          </div>
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
              onChange={e => setStats(prev => ({ ...prev, recurring: { ...prev.recurring, enabled: e.target.checked } }))}
              className="accent-purple-500"
            />
            Auto-Give
          </label>
          <select
            value={stats.recurring.type}
            onChange={e => setStats(prev => ({ ...prev, recurring: { ...prev.recurring, type: e.target.value } }))}
            className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs"
          >
            <option>Tithe</option>
            <option>Offering</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            value={stats.recurring.amount}
            onChange={e => setStats(prev => ({ ...prev, recurring: { ...prev.recurring, amount: e.target.value } }))}
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
                />
                <button className="ml-2 text-green-600 text-xs font-semibold" onClick={handleGoalSave}>Save</button>
                <button className="ml-1 text-gray-500 text-xs" onClick={() => setEditingGoal(false)}>Cancel</button>
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
      <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
        <FaHandsHelping className="text-purple-400" /> Recent Donations
      </h2>
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
      <div className="text-center mt-4 mb-2">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl transition-all animate-bounce">
          Give Now
        </button>
        <div className="text-xs text-gray-400 mt-2">
          Thank you for being a blessing through ChurPay. Every rand counts! 💜
        </div>
      </div>
    </div>
  );
}