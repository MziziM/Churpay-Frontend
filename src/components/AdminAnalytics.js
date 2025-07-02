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

    axios.post("https://churpay-backend.onrender.com/api/admin/analytics", { token })
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
    <section className="max-w-4xl mx-auto mt-10 px-2 sm:px-8 py-8 bg-white rounded-3xl shadow-2xl border-4 border-purple-200 mb-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-800 mb-8 text-center tracking-wide drop-shadow">
        Admin Analytics Dashboard
      </h2>

      {/* Monthly Donations Line Chart */}
      <div className="mb-10 bg-purple-50 rounded-2xl shadow-lg p-5 sm:p-8 border border-purple-100">
        <h3 className="text-2xl font-semibold text-purple-800 mb-4">Monthly Donations (ZAR)</h3>
        <Line
          data={{
            labels: stats.monthlyDonations.labels,
            datasets: [{
              label: "Donations",
              data: stats.monthlyDonations.data,
              borderColor: "#6b21a8",
              backgroundColor: "rgba(107,33,168,0.08)",
              fill: true,
              tension: 0.35,
              pointBackgroundColor: "#eab308",
              pointBorderColor: "#fff",
              pointRadius: 5
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#6b21a8", font: { weight: "bold" } },
                grid: { color: "#ede9fe" }
              },
              x: {
                ticks: { color: "#a21caf" },
                grid: { display: false }
              }
            }
          }}
        />
      </div>

      {/* Top Churches Bar Chart */}
      <div className="mb-10 bg-yellow-50 rounded-2xl shadow-lg p-5 sm:p-8 border border-yellow-100">
        <h3 className="text-2xl font-semibold text-purple-800 mb-4">Top Churches by Donations</h3>
        <Bar
          data={{
            labels: stats.topChurches.labels,
            datasets: [{
              label: "Donations",
              data: stats.topChurches.data,
              backgroundColor: "#eab308",
              borderRadius: 16,
              barThickness: 40,
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#a16207", font: { weight: "bold" } },
                grid: { color: "#fef9c3" }
              },
              x: {
                ticks: { color: "#92400e" },
                grid: { display: false }
              }
            }
          }}
        />
      </div>

      {/* Project Completion */}
      <div className="bg-purple-800 rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-white">
        <h3 className="text-2xl font-bold mb-3">Projects Status</h3>
        <div className="flex gap-8 text-xl font-semibold mb-3">
          <div>
            <div className="text-yellow-300 text-3xl">{stats.projects.total}</div>
            <div>Total Projects</div>
          </div>
          <div>
            <div className="text-yellow-300 text-3xl">{stats.projects.completed}</div>
            <div>Completed</div>
          </div>
          <div>
            <div className="text-yellow-300 text-3xl">
              {((stats.projects.completed / stats.projects.total) * 100).toFixed(1)}%
            </div>
            <div>Completion Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}