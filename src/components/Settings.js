import React from "react";
import axios from "axios";
export default function Settings() {
  const [settings, setSettings] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios.get("https://churpay-backend.onrender.com/api/settings", { headers: { Authorization: `Bearer ${localStorage.getItem("churpay_token")}` } })
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load settings");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-purple-700">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error}</div>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 py-8 px-2">
      <section className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-6 text-center drop-shadow-lg">
          Settings
        </h2>
        <div className="text-yellow-100 text-lg text-center">
          {settings ? JSON.stringify(settings) : "No settings found."}
        </div>
      </section>
    </div>
  );
}