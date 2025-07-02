import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
    <div className="flex flex-col items-center pt-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Church Directory</h1>
      <input
        className="mb-8 w-full max-w-2xl px-5 py-3 rounded-xl border border-purple-200 text-lg"
        placeholder="Search by name, pastor, contact, address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="w-full max-w-2xl">
        {filteredChurches.length === 0 && (
          <div className="text-gray-400 text-lg text-center py-8">
            No churches yet.
          </div>
        )}
        {filteredChurches.map(church => (
          <div
            key={church.id}
            className="flex flex-col sm:flex-row items-center bg-white rounded-3xl border border-purple-100 shadow-2xl mb-10 p-8 hover:shadow-purple-200 transition-shadow"
          >
            {church.logo_url ? (
              <img
                src={`http://localhost:5000${church.logo_url}`}
                alt="Church Logo"
                className="w-20 h-20 object-cover rounded-2xl ring-2 ring-purple-300 shadow-lg mb-4 sm:mb-0 sm:mr-6 bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-400 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                {church.name ? church.name[0] : "C"}
              </div>
            )}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="text-2xl font-extrabold text-purple-800 mb-1">{church.name}</div>
              <span className="inline-block bg-purple-200 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{church.status || 'Active'}</span>
              <div className="text-lg text-gray-700 mb-2">{church.email}</div>
              <div className="text-lg text-gray-700 mb-2">Phone: {church.phone || 'N/A'}</div>
              <div className="text-lg text-gray-700 mb-2">Address: {church.address || 'N/A'}</div>
              <div className="text-lg text-gray-700 mb-2">Lead Pastor: {church.lead_pastor || 'N/A'}</div>
              <div className="text-lg text-gray-700 mb-2">Established: {church.established ? new Date(church.established).toLocaleDateString() : 'N/A'}</div>
              <div className="text-lg text-gray-700 mb-2">Contact Person: {church.contact_person || 'N/A'}</div>
              <hr className="my-3 border-purple-100" />
              <div className="mt-3 flex justify-center sm:justify-start">
                <Link
                  to={`/churches/${church.id}/edit`}
                  className="bg-yellow-300 text-purple-800 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition flex items-center drop-shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                  </svg>
                  Edit
                </Link>
                <Link
                  to={`/churches/${church.id}`}
                  className="bg-purple-700 text-yellow-300 font-bold px-6 py-3 rounded-lg shadow hover:bg-purple-800 transition ml-3 flex items-center drop-shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
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