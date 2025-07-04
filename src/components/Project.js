import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastAmount, setLastAmount] = useState(null);
  const [lastRef, setLastRef] = useState("");
  const { width, height } = useWindowSize();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`https://churpay-backend.onrender.com/api/projects/${id}`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Project not found");
        setLoading(false);
      });
  }, [id]);

  // Toast utility
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Show Thank You after PayFast redirect (?paid=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("Query paid param:", params.get("paid")); // DEBUG
    if (params.get("paid") === "1") {
      setShowThankYou(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Social sharing
  const shareUrl = window.location.href;
  const handleWhatsApp = () =>
    window.open(`https://wa.me/?text=Support this project on ChurPay: ${shareUrl}`, "_blank");
  const handleFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast("Project link copied!");
  };

  // PDF receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();
    const now = new Date();
    const ref = lastRef || Math.random().toString(36).substr(2, 9).toUpperCase();

    doc.setFontSize(22);
    doc.text("ChurPay Giving Receipt", 20, 20);
    doc.setFontSize(14);
    doc.text(`Project: ${project.title}`, 20, 40);
    doc.text(`Church: ${project.church}`, 20, 50);
    doc.text(`Amount: R${lastAmount || "[Your Amount]"}`, 20, 60);
    doc.text(`Date: ${now.toLocaleString()}`, 20, 70);
    doc.text(`Reference: ${ref}`, 20, 80);
    doc.text("Thank you for your generosity!", 20, 100);
    doc.save(`ChurPay_Receipt_${ref}.pdf`);
  };

  // Donation submit
  const handleGiveSubmit = (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    if (!amount || amount < 1) {
      showToast("Enter a valid amount.", "error");
      return;
    }

    // PayFast URL
    const params = new URLSearchParams({
      merchant_id: "10000100",
      merchant_key: "46f0cd694581a",
      amount: amount.toFixed(2),
      item_name: project.title,
      item_description: `Giving to ${project.church}`,
      return_url: window.location.href + "?paid=1",
      cancel_url: window.location.href,
      email_confirmation: "1",
      confirmation_address: "your@email.com",
    });
    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${params.toString()}`;
    const ref = Math.random().toString(36).substr(2, 9).toUpperCase();

    setLastAmount(amount);
    setLastRef(ref);
    setShowForm(false);

    // Do not set ThankYou here, will be shown after redirect!
    // setShowThankYou(true);
    // setShowConfetti(true);
    // setTimeout(() => setShowConfetti(false), 4000);

    window.open(payfastUrl, "_blank");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-purple-700">Loading...</div>;
  }
  if (error || !project) {
    return (
      <div className="flex flex-col items-center py-16">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          {error || "Project not found"}
        </h2>
        <Link to="/projects" className="text-purple-700 underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-2">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold z-50
          ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
        `}>
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl flex flex-col items-center">
        {/* Confetti */}
        {showConfetti && (
          <Confetti width={width} height={height} numberOfPieces={300} />
        )}

        {/* Thank You popup */}
        {showThankYou && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-sm mx-auto">
              <div className="text-3xl font-bold text-green-700 mb-3">Thank You! 🙏</div>
              <div className="text-lg text-purple-700 mb-5">Your giving makes a difference.</div>
              <div className="mb-4 text-gray-700">
                {lastAmount && <>Amount: <b>R{lastAmount}</b></>}
                <br />
                Reference: <span className="font-mono">{lastRef || "------"}</span>
              </div>
              <button
                onClick={downloadReceipt}
                className="bg-yellow-400 text-purple-800 font-bold px-5 py-2 rounded shadow hover:bg-yellow-300 mr-3"
              >
                Download PDF Receipt
              </button>
              <button
                onClick={() => { setShowThankYou(false); setShowConfetti(false); }}
                className="mt-4 bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="rounded-xl mb-6 h-56 w-full object-cover"
        />
        {/* Project Info */}
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-purple-800">{project.title}</h1>
          {/* Status Badge */}
          <span
            className={`px-2 py-1 rounded text-xs font-bold
              ${
                project.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-700"
              }
            `}
            style={{ marginTop: "2px" }}
          >
            {project.status}
          </span>
        </div>
        <div className="mb-2 text-lg text-purple-500">{project.church}</div>
        <p className="mb-3 text-gray-700 text-center">{project.description}</p>
        {/* Progress Bar */}
        <div className="mb-4 w-full">
          <div className="w-full bg-gray-200 rounded h-3 mb-1">
            <div
              className="bg-yellow-400 h-3 rounded"
              style={{
                width: `${Math.min(100, Math.round((project.raised / project.goal) * 100))}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-800">
            <span>Raised: R{project.raised}</span>
            <span>Goal: R{project.goal}</span>
          </div>
        </div>
        {/* Social Sharing Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 shadow"
            title="Share on WhatsApp"
          >
            {/* WhatsApp Logo */}
            <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path fill="#fff" d="M22.84 18.32c-.34-.17-2.02-.99-2.33-1.11-.31-.11-.54-.17-.77.17-.23.34-.89 1.11-1.09 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.73-1.7-1.01-.89-1.7-1.99-1.9-2.32-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43 0-.6-.06-.17-.77-1.85-1.06-2.53-.28-.68-.56-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.53.17.23 2.43 3.7 5.9 4.83.82.26 1.46.41 1.96.53.82.17 1.57.15 2.16.09.66-.07 2.02-.82 2.3-1.62.29-.8.29-1.5.2-1.64-.08-.13-.31-.2-.65-.37z"/>
            </svg>
            WhatsApp
          </button>
          <button
            onClick={handleFacebook}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 shadow"
            title="Share on Facebook"
          >
            {/* Facebook Logo */}
            <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="16" cy="16" r="16" fill="#1877F3"/>
              <path fill="#fff" d="M20.61 17l.45-2.94h-2.82v-1.9c0-.8.39-1.58 1.64-1.58h1.27V8.01S20.06 8 19.21 8c-2.36 0-3.49 1.42-3.49 4.03v2.03H13v2.94h2.72v7.12c.55.09 1.12.14 1.7.14s1.15-.05 1.7-.14V17h2.49z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-purple-700 rounded-full px-4 py-2 shadow"
            title="Copy Link"
          >
            {/* Link Icon */}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10.59 13.41a1 1 0 0 1 0-1.41l3-3a1 1 0 1 1 1.41 1.41l-3 3a1 1 0 0 1-1.41 0Z"/>
              <path fill="currentColor" d="M13 10.59a1 1 0 0 1 1.41 0l3 3a1 1 0 1 1-1.41 1.41l-3-3a1 1 0 0 1 0-1.41Z"/>
              <path fill="currentColor" d="M5 13a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"/>
            </svg>
            Copy Link
          </button>
        </div>

        {/* Give Now + Back */}
        <div className="flex gap-4 mb-2">
          {project.status === "Active" && (
            <button
              className="bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded-xl shadow hover:bg-purple-800 transition"
              onClick={() => setShowForm(true)}
            >
              Give Now
            </button>
          )}
          <Link
            to="/projects"
            className="bg-gray-200 text-purple-700 font-bold px-6 py-2 rounded-xl shadow hover:bg-gray-300 transition"
          >
            Back to Projects
          </Link>
        </div>

        {/* Status Warnings */}
        {project.status === "Rejected" && (
          <div className="text-red-600 font-semibold my-4">
            This project has been rejected and cannot accept giving.
          </div>
        )}
        {project.status === "Pending" && (
          <div className="text-yellow-700 bg-yellow-100 font-semibold my-4 px-3 py-2 rounded">
            This project is awaiting approval. Giving is not available yet.
          </div>
        )}

        {/* Donation Form (Active only) */}
        {project.status === "Active" && showForm && (
          <form
            className="mt-6 bg-purple-50 p-6 rounded-xl shadow max-w-md w-full"
            onSubmit={handleGiveSubmit}
          >
            <label className="block mb-2 font-semibold text-purple-800">
              Amount (ZAR)
            </label>
            <input
              type="number"
              name="amount"
              min="1"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Enter amount"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-700 text-yellow-300 font-bold px-6 py-2 rounded shadow hover:bg-purple-800"
              >
                Confirm Give
              </button>
              <button
                type="button"
                className="bg-gray-300 text-purple-700 px-6 py-2 rounded shadow"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}