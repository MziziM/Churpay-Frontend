import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChurch, FaUserEdit, FaEnvelope, FaCalendarAlt, FaSpinner } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get token if you use JWT auth
        // const token = localStorage.getItem("churpay_token");

        // Axios call - update the URL to match your real API endpoint!
        const res = await axios.get("/api/profile", {
          // If your API requires Auth headers:
          // headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        setErr(
          error.response?.data?.message ||
          error.message ||
          "Failed to load profile."
        );
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <FaSpinner className="animate-spin text-purple-700 text-4xl" />{" "}
        <span className="ml-4 text-purple-700 text-xl font-bold">Loading profile...</span>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-500 text-xl font-bold">
        {err}
      </div>
    );
  }

  // Fallbacks if your API is not returning everything yet
  const name = profile?.name || profile?.church_name || "User";
  const email = profile?.email || "Not set";
  const joined = profile?.joined || profile?.created_at || "N/A";

  return (
    <section className="max-w-xl mx-auto my-16 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl shadow-2xl p-0">
      <div className="flex flex-col items-center py-12">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-yellow-200 shadow-lg flex items-center justify-center text-5xl font-extrabold text-purple-700 mb-4 border-4 border-yellow-400">
          <FaChurch className="text-5xl" />
        </div>
        {/* Church/User Name */}
        <div className="text-3xl font-extrabold text-yellow-300 mb-2 tracking-wide drop-shadow-lg">
          {name}
        </div>
        {/* Email */}
        <div className="flex items-center text-lg text-purple-200 mb-1">
          <FaEnvelope className="mr-2 text-yellow-400" /> {email}
        </div>
        {/* Join Date */}
        <div className="flex items-center text-md text-purple-300 mb-8">
          <FaCalendarAlt className="mr-2 text-yellow-400" /> Joined: {joined}
        </div>
        {/* Edit Profile Button (future use) */}
        <button
          className="mt-3 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-purple-800 font-bold rounded-lg shadow transition flex items-center gap-2"
          disabled
        >
          <FaUserEdit />
          Edit Profile
        </button>
      </div>
    </section>
  );
}