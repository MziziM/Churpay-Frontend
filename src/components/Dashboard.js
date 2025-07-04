import { useState } from "react";
import PaymentForm from "./PaymentForm";

export default function Dashboard() {
  const churchName = localStorage.getItem("churpay_church_name");
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-06-30', name: 'Tithe', amount: 'R500.00', status: 'Success' },
    { id: 2, date: '2024-06-29', name: 'Offering', amount: 'R150.00', status: 'Success' },
    { id: 3, date: '2024-06-28', name: 'Youth Event', amount: 'R200.00', status: 'Pending' },
  ]);

  // Calculate total received
  const total = transactions
    .filter(tx => tx.status === "Success")
    .reduce((sum, tx) => sum + Number(tx.amount.replace(/[^\d.]/g, "")), 0);

  // Add new payment
  function addPayment(tx) {
    setTransactions([{ ...tx, id: Date.now() }, ...transactions]);
  }

  return (
    <section className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-2">Welcome, {churchName || 'Church'}!</h2>
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Church Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">R{total.toFixed(2)}</p>
          <p className="text-gray-700 mt-2">Total Received</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">{transactions.length}</p>
          <p className="text-gray-700 mt-2">Transactions</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-800">3</p>
          <p className="text-gray-700 mt-2">Active Givers</p>
        </div>
      </div>

      <PaymentForm onSubmit={addPayment} />

      <h3 className="text-xl font-semibold text-purple-700 mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="py-2 px-4 border-b">{tx.date}</td>
                <td className="py-2 px-4 border-b">{tx.name}</td>
                <td className="py-2 px-4 border-b">{tx.amount}</td>
                <td className={`py-2 px-4 border-b font-bold ${tx.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {tx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}