import React, { useState } from "react";

export default function BulkMessage() {
  const [recipientType, setRecipientType] = useState("churches");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in both subject and message.");
      return;
    }

    setSending(true);
    setStatusMsg("");

    // Simulate sending delay
    setTimeout(() => {
      setSending(false);
      setStatusMsg(`Message sent to all ${recipientType}! 🎉`);
      // Reset form
      setSubject("");
      setMessage("");
    }, 1500);

    // TODO: Replace above with actual API call to send bulk email/SMS
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-900 mb-6">Bulk Message</h2>

      <div className="mb-4">
        <label className="block font-semibold text-purple-700 mb-1">Send To:</label>
        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="churches">All Churches</option>
          <option value="members">All Members</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-purple-700 mb-1">Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Message subject"
          disabled={sending}
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-purple-700 mb-1">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded px-3 py-2 h-32"
          placeholder="Write your message here..."
          disabled={sending}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={sending}
        className={`w-full py-3 rounded-xl font-bold text-yellow-300 ${
          sending ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
        }`}
      >
        {sending ? "Sending..." : "Send Message"}
      </button>

      {statusMsg && (
        <div className="mt-6 text-center text-green-600 font-semibold">
          {statusMsg}
        </div>
      )}
    </section>
  );
}