import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaChurch, FaFileCsv, FaUsersCog } from "react-icons/fa";

function exportCSV(rows, headers, filename) {
  const csvRows = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","))
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AllUsers() {
  const [churches, setChurches] = useState([]);
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("churches");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) return setMsg("Please log in as admin.");
    // Churches
    axios.post("https://churpay-backend.onrender.com/api/admin/churches", { token })
      .then(res => setChurches(res.data))
      .catch(() => setMsg("Error loading churches."));
    // Members
    axios.post("https://churpay-backend.onrender.com/api/admin/members", { token })
      .then(res => setMembers(res.data))
      .catch(() => setMsg("Error loading members."));
  }, []);

  const filteredChurches = churches.filter(
    c =>
      c.church_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMembers = members.filter(
    m =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 font-inter">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 rounded-3xl shadow-xl p-10 mb-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">👥</div>
        <div className="flex items-center gap-6 flex-1">
          <FaUsersCog className="text-7xl drop-shadow-xl" />
          <div>
            <div className="text-lg font-semibold tracking-wide mb-1">Admin Panel</div>
            <div className="text-3xl font-bold leading-tight">All Users</div>
            <div className="text-base font-medium text-white mt-0.5">Browse, search, and export all churches and members.</div>
            <div className="text-xs mt-2 text-purple-200">"Manage your ChurPay community with ease."</div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
         


        </div>
      </div>
      {msg && <div className="mb-6 text-red-600 font-semibold text-center">{msg}</div>}

      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <button
          onClick={() => setTab("churches")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${tab === "churches"
            ? "bg-purple-700 text-yellow-300"
            : "bg-gray-200 text-purple-800 dark:bg-gray-800 dark:text-purple-200"}`}
        >
          <FaChurch /> Churches
        </button>
        <button
          onClick={() => setTab("members")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${tab === "members"
            ? "bg-purple-700 text-yellow-300"
            : "bg-gray-200 text-purple-800 dark:bg-gray-800 dark:text-purple-200"}`}
        >
          <FaUsers /> Members
        </button>
        <input
          type="text"
          placeholder={`Search ${tab}...`}
          className="border border-yellow-400 rounded-lg p-2 ml-6 w-72"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(tab === "churches" ? filteredChurches.length : filteredMembers.length) > 0 && (
          <button
            onClick={() =>
              exportCSV(
                tab === "churches" ? filteredChurches : filteredMembers,
                tab === "churches"
                  ? ["church_name", "email", "id"]
                  : ["name", "email", "id"],
                `churpay_${tab}.csv`
              )
            }
            className="ml-4 bg-purple-700 text-yellow-300 font-bold px-5 py-2 rounded-xl shadow hover:bg-purple-800 transition flex items-center gap-2"
          >
            <FaFileCsv /> Export CSV
          </button>
        )}
      </div>

      {/* TABLES */}
      {tab === "churches" && (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-xl">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Church Name</th>
                <th className="py-3 px-6 text-left font-semibold">Email</th>
                <th className="py-3 px-6 text-left font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredChurches.map((c, i) => (
                <tr
                  key={i}
                  className="border-b border-purple-100 dark:border-purple-900 hover:bg-yellow-50 dark:hover:bg-purple-950 transition-colors duration-200"
                >
                  <td className="py-3 px-6">{c.church_name}</td>
                  <td className="py-3 px-6">{c.email}</td>
                  <td className="py-3 px-6">{c.id}</td>
                </tr>
              ))}
              {filteredChurches.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-purple-600 dark:text-purple-300 font-semibold">
                    No churches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "members" && (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-xl">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Name</th>
                <th className="py-3 px-6 text-left font-semibold">Email</th>
                <th className="py-3 px-6 text-left font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, i) => (
                <tr
                  key={i}
                  className="border-b border-purple-100 dark:border-purple-900 hover:bg-yellow-50 dark:hover:bg-purple-950 transition-colors duration-200"
                >
                  <td className="py-3 px-6">{m.name}</td>
                  <td className="py-3 px-6">{m.email}</td>
                  <td className="py-3 px-6">{m.id}</td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-purple-600 dark:text-purple-300 font-semibold">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}