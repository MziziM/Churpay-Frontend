import React, { useState, useEffect } from "react";
import axios from "axios";

function downloadCSV(transactions) {
  const headers = ["Date", "Project", "Church", "Amount", "Reference"];
  const rows = transactions.map(tx =>
    [tx.date, tx.project, tx.church, tx.amount, tx.ref]
      .map(field => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `churpay_transactions_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("churpay_token");
    if (!token) {
      alert("Please login first");
      setLoading(false);
      return;
    }
    axios.get("https://churpay-backend.onrender.com/api/transactions", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load transactions");
        setLoading(false);
      });
  }, []);

  const handleRefund = async (txId) => {
    if (!window.confirm("Are you sure you want to refund this transaction?")) return;

    setProcessingId(txId);
    try {
      const token = localStorage.getItem("churpay_token");
      await axios.post("https://churpay-backend.onrender.com/api/admin/refund-transaction", { token, transaction_id: txId });
      alert("Transaction refunded successfully.");
      // Refresh transactions list
      const res = await axios.get("https://churpay-backend.onrender.com/api/transactions", { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(res.data);
    } catch (error) {
      alert("Failed to refund transaction.");
    }
    setProcessingId(null);
  };

  // Filter transactions based on search
  const filtered = transactions.filter(tx => {
    const s = search.toLowerCase();
    return (
      tx.project.toLowerCase().includes(s) ||
      tx.church.toLowerCase().includes(s) ||
      tx.date.toLowerCase().includes(s) ||
      tx.ref.toLowerCase().includes(s) ||
      String(tx.amount).includes(s)
    );
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 py-8 px-2">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-6 text-center drop-shadow-lg">Transaction History</h1>
        <div className="text-yellow-100 text-lg text-center">Loading transactions...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 py-8 px-2">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-6 text-center drop-shadow-lg">Transaction History</h1>
        {/* Download CSV & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 w-full">
          <button
            onClick={() => downloadCSV(filtered)}
            className="bg-purple-700 text-yellow-300 font-bold px-5 py-2 rounded-xl shadow hover:bg-purple-800 transition"
          >
            Download CSV
          </button>
          <input
            type="text"
            className="border border-purple-200 dark:border-purple-700 rounded px-4 py-2 w-full md:w-72 text-gray-800 dark:bg-gray-800 dark:text-yellow-100"
            placeholder="Search project, church, date, ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-purple-200 dark:divide-purple-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Project</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Church</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Reference</th>
                <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 dark:text-yellow-200 uppercase">Refund</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 dark:text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-purple-50 dark:hover:bg-purple-900 transition">
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-yellow-100">{tx.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-yellow-100">{tx.project}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-yellow-100">{tx.church}</td>
                  <td className="px-4 py-2 text-sm text-right font-bold text-purple-800 dark:text-yellow-200">R{tx.amount}</td>
                  <td className="px-4 py-2 text-xs text-gray-400 dark:text-yellow-200 font-mono">{tx.ref}</td>
                  <td className="px-4 py-2 text-center">
                    {tx.status !== "Refunded" ? (
                      <button
                        disabled={processingId === tx.id}
                        onClick={() => handleRefund(tx.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        {processingId === tx.id ? "Processing..." : "Refund"}
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Refunded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
          Showing {filtered.length} transaction{filtered.length !== 1 && "s"}.
        </div>
      </div>
    </div>
  );
}