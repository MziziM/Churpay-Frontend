import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChurch, FaUserEdit, FaEye, FaPlus } from "react-icons/fa";

function ChurchList() {
  const [search, setSearch] = useState("");
  const [churches, setChurches] = useState([]);

  const filteredChurches = churches.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.lead_pastor || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.contact_person || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.address || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    axios.get("http://localhost:5000/api/churches")
      .then(res => setChurches(res.data))
      .catch(() => setChurches([]));
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 font-inter">
      {/* Modern header with church icon */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaChurch className="text-3xl text-purple-600" />
          <div>
            <div className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-1">
              Church Directory
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Browse, search, and manage all registered churches.
            </div>
          </div>
        </div>
        <Link
          to="/admin/churches/new"
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl shadow transition"
        >
          <FaPlus className="mr-2" /> Add Church
        </Link>
      </div>
      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          className="w-full max-w-2xl px-5 py-3 rounded-xl border border-purple-200 text-lg shadow"
          placeholder="Search by name, pastor, contact, address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Church Cards */}
      <div className="w-full max-w-5xl mx-auto">
        {filteredChurches.length === 0 && (
          <div className="text-gray-400 text-lg text-center py-8">
            No churches yet.
          </div>
        )}
        {filteredChurches.map(church => (
          <div
            key={church.id}
            className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-900 rounded-3xl border border-purple-100 shadow-2xl mb-10 p-8 hover:shadow-purple-300 transition-shadow"
          >
            {church.logo_url ? (
              <img
                src={`http://localhost:5000${church.logo_url}`}
                alt="Church Logo"
                className="w-20 h-20 object-cover rounded-2xl ring-2 ring-purple-300 shadow-lg mb-4 sm:mb-0 sm:mr-6 bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-400 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                <FaChurch />
              </div>
            )}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-200 mb-1">{church.name}</div>
              <span className="inline-block bg-purple-200 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {church.status || 'Active'}
              </span>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">{church.email}</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Phone: {church.phone || 'N/A'}</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Address: {church.address || 'N/A'}</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Lead Pastor: {church.lead_pastor || 'N/A'}</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Established: {church.established ? new Date(church.established).toLocaleDateString() : 'N/A'}</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Contact Person: {church.contact_person || 'N/A'}</div>
              <hr className="my-3 border-purple-100" />
              <div className="mt-3 flex justify-center sm:justify-start gap-3">
                <Link
                  to={`/churches/${church.id}/edit`}
                  className="bg-yellow-300 text-purple-800 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition flex items-center"
                >
                  <FaUserEdit className="mr-2" />
                  Edit
                </Link>
                <Link
                  to={`/churches/${church.id}`}
                  className="bg-purple-700 text-yellow-300 font-bold px-6 py-3 rounded-lg shadow hover:bg-purple-800 transition flex items-center"
                >
                  <FaEye className="mr-2" />
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChurchList;