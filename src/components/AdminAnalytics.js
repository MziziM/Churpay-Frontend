import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) return setMsg("Please log in as admin.");

    axios.post("http://localhost:5000/api/admin/analytics", { token })
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        // fallback dummy data if api fails
        setStats({
          monthlyDonations: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            data: [5000, 7000, 4000, 9000, 11000]
          },
          topChurches: {
            labels: ["GCC Faith Center", "Bethel Life", "New Hope"],
            data: [35000, 27000, 23000]
          },
          projects: {
            total: 120,
            completed: 95
          }
        });
        setLoading(false);
      });
  }, []);

  if (msg) {
    return <div className="text-center text-red-600 font-bold mt-12">{msg}</div>;
  }

  if (loading) {
    return <div className="text-center text-purple-700 font-semibold mt-12">Loading analytics...</div>;
  }

  return (
    <section className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-900 mb-6">Admin Analytics Dashboard</h2>

      {/* Monthly Donations Line Chart */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-purple-800 mb-3">Monthly Donations (ZAR)</h3>
        <Line
          data={{
            labels: stats.monthlyDonations.labels,
            datasets: [{
              label: "Donations",
              data: stats.monthlyDonations.data,
              borderColor: "rgba(107, 33, 168, 1)",
              backgroundColor: "rgba(107, 33, 168, 0.2)",
              fill: true,
              tension: 0.3,
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      </div>

      {/* Top Churches Bar Chart */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-purple-800 mb-3">Top Churches by Donations</h3>
        <Bar
          data={{
            labels: stats.topChurches.labels,
            datasets: [{
              label: "Donations",
              data: stats.topChurches.data,
              backgroundColor: "rgba(234, 179, 8, 0.8)",
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      </div>

      {/* Project Completion */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-purple-800 mb-3">Projects Status</h3>
        <p>Total Projects: <b>{stats.projects.total}</b></p>
        <p>Completed Projects: <b>{stats.projects.completed}</b></p>
        <p>Completion Rate: <b>{((stats.projects.completed / stats.projects.total) * 100).toFixed(1)}%</b></p>
      </div>
    </section>
  );
}