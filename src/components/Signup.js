import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("member"); // default to member for screenshot
  // Church fields
  const [church_name, setChurchName] = useState("");
  const [church_email, setChurchEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lead_pastor, setLeadPastor] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [bank_name, setBankName] = useState("");
  const [bank_account, setBankAccount] = useState("");
  const [account_holder, setAccountHolder] = useState("");
  const [church_address, setChurchAddress] = useState("");
  const [bank_letter, setBankLetter] = useState(null);
  const [cor14, setCor14] = useState(null);

  // Member fields
  const [member_name, setMemberName] = useState("");
  const [member_email, setMemberEmail] = useState("");
  const [member_password, setMemberPassword] = useState("");

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      if (role === "church") {
        const formData = new FormData();
        formData.append("church_name", church_name);
        formData.append("email", church_email);
        formData.append("password", password);
        formData.append("lead_pastor", lead_pastor);
        formData.append("contact_person", contact_person);
        formData.append("bank_name", bank_name);
        formData.append("bank_account", bank_account);
        formData.append("account_holder", account_holder);
        formData.append("church_address", church_address);
        if (bank_letter) formData.append("bank_letter", bank_letter);
        if (cor14) formData.append("cor14", cor14);

        await axios.post("/api/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/member/register", {
          member_name,
          email: member_email,
          password: member_password,
        });
      }
      setMsg("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-t-4 border-yellow-400 p-12">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ChurPay Logo" className="h-10 mb-2" />
          <div className="h-1 w-12 bg-yellow-400 rounded-full mb-4"></div>
        </div>
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-2">Create your account</h2>
        <p className="text-center text-lg text-purple-500 mb-8">
          Sign up to give, support projects, or manage your church.
        </p>
        {/* Role Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("member")}
            className={`flex-1 px-8 py-5 rounded-xl text-lg font-bold transition shadow-sm border-2 ${
              role === "member"
                ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-yellow-300 border-transparent relative"
                : "bg-white text-purple-700 border-purple-200"
            }`}
            style={role === "member" ? { boxShadow: "0 4px 16px 0 #a78bfa22" } : {}}
          >
            Member
            <div className="text-xs font-normal text-purple-200 mt-1">
              Give, track donations, support projects
            </div>
            {role === "member" && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-yellow-400 rounded-full"></div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setRole("church")}
            className={`flex-1 px-8 py-5 rounded-xl text-lg font-bold transition shadow-sm border-2 ${
              role === "church"
                ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-yellow-300 border-transparent relative"
                : "bg-white text-purple-700 border-purple-200"
            }`}
            style={role === "church" ? { boxShadow: "0 4px 16px 0 #a78bfa22" } : {}}
          >
            Church
            <div className="text-xs font-normal text-purple-200 mt-1">
              Create projects, receive support, manage your profile
            </div>
            {role === "church" && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-yellow-400 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Member Form */}
        {role === "member" && (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="text"
                placeholder="Full Name"
                value={member_name}
                onChange={e => setMemberName(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">
                {/* User icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="email"
                placeholder="Email Address"
                value={member_email}
                onChange={e => setMemberEmail(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {/* Filled email icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.511l8.25 5.5 8.25-5.5V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm17.25 1.489-7.728 5.156a1.25 1.25 0 0 1-1.444 0L3.75 8.239v9.011c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.239z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="password"
                placeholder="Password"
                value={member_password}
                onChange={e => setMemberPassword(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {/* Filled lock icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-yellow-300 font-bold py-4 rounded-xl shadow-md transition text-xl">
              Create Account
            </button>
          </form>
        )}

        {/* Church Form */}
        {role === "church" && (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="text"
                placeholder="Church Name"
                value={church_name}
                onChange={e => setChurchName(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {/* Church icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M12 2L2 7v2h2v11h6v-6h4v6h6V9h2V7L12 2zm0 2.18L19.5 7H17v11h-3v-6H10v6H7V7H4.5L12 4.18z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="email"
                placeholder="Church Email"
                value={church_email}
                onChange={e => setChurchEmail(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {/* Filled email icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.511l8.25 5.5 8.25-5.5V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm17.25 1.489-7.728 5.156a1.25 1.25 0 0 1-1.444 0L3.75 8.239v9.011c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.239z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full border border-purple-200 rounded-lg px-12 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {/* Filled lock icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a78bfa">
                  <rect width="24" height="24" rx="4" fill="#a78bfa" opacity="0.12"/>
                  <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z" fill="#a78bfa"/>
                </svg>
              </span>
            </div>
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Lead Pastor Name" value={lead_pastor} onChange={e => setLeadPastor(e.target.value)} required />
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Contact Person" value={contact_person} onChange={e => setContactPerson(e.target.value)} required />
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Bank Name" value={bank_name} onChange={e => setBankName(e.target.value)} required />
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Bank Account Number" value={bank_account} onChange={e => setBankAccount(e.target.value)} required />
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Account Holder" value={account_holder} onChange={e => setAccountHolder(e.target.value)} required />
            <input className="border border-purple-200 rounded-lg px-4 py-3 text-lg" type="text" placeholder="Church Address" value={church_address} onChange={e => setChurchAddress(e.target.value)} required />
            <div>
              <label className="block text-purple-700 text-sm font-semibold mb-1">
                Bank Confirmation Letter (PDF)
              </label>
              <input type="file" accept="application/pdf" onChange={e => setBankLetter(e.target.files[0])} className="block w-full text-sm text-gray-700" required />
            </div>
            <div>
              <label className="block text-purple-700 text-sm font-semibold mb-1">
                COR14 (Company Registration PDF)
              </label>
              <input type="file" accept="application/pdf" onChange={e => setCor14(e.target.files[0])} className="block w-full text-sm text-gray-700" required />
            </div>
            <button className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-yellow-300 font-bold py-4 rounded-xl shadow-md transition text-xl">
              Create Account
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-md text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-700 font-semibold hover:underline">
            Log in
          </a>
        </div>
        {msg && (
          <div className="mt-6 text-center text-md text-purple-800 font-semibold">{msg}</div>
        )}
      </div>
    </div>
  );
}
