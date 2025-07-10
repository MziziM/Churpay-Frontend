import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaHandHoldingUsd, FaUserCircle, FaBars, FaTimes, FaProjectDiagram } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("churpay_role");
  const loggedIn = !!localStorage.getItem("churpay_token");
  const userName = localStorage.getItem("churpay_name") || "Profile";
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [giveAmount, setGiveAmount] = useState("");
  const [selectedChurch, setSelectedChurch] = useState("");
  const [giverName, setGiverName] = useState("");
  const [giverSurname, setGiverSurname] = useState("");
  const [reference, setReference] = useState("");
  const giveInputRef = useRef();

  // Focus amount input when modal opens
  useEffect(() => {
    if (showGiveModal && giveInputRef.current) {
      giveInputRef.current.focus();
    }
  }, [showGiveModal]);

  function handleGiveSubmit(e) {
    e.preventDefault();
    if (!giveAmount || !giverName || !giverSurname || !selectedChurch) {
      alert("Please fill in all required fields!");
      return;
    }
    alert(
      `Giving R${giveAmount} to ${selectedChurch}!\nName: ${giverName} ${giverSurname}\nReference: ${reference || 'N/A'}`
    );
    setShowGiveModal(false);
    setGiveAmount("");
    setSelectedChurch("");
    setGiverName("");
    setGiverSurname("");
    setReference("");
  }

  const dashboards = {
    member: { to: "/memberdashboard", label: "Member Dashboard" },
    church: { to: "/church_dashboard", label: "Church Dashboard" },
    admin: { to: "/admin", label: "Admin Dashboard" },
  };

  const navLinks = [
    { to: "/features", label: "Features" },
    { to: "/projects", label: "Projects", icon: <FaProjectDiagram className="inline mr-1" /> },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-700 to-indigo-600 shadow-lg flex items-center justify-between px-8 py-4">
      <div className="flex items-center">
        <Link to="/" className="text-4xl font-black tracking-tight drop-shadow select-none">
          <span className="text-white">ChurP</span>
          <span className="text-yellow-400">a</span>
          <span className="text-white">y</span>
        </Link>
      </div>
      <div className="flex items-center ml-6 flex-1 justify-end gap-6">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `transition text-base font-semibold px-3 py-2 rounded-lg ${
                isActive
                  ? "text-yellow-300 bg-yellow-900"
                  : "text-white hover:text-yellow-300 hover:bg-purple-600"
              }`
            }
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
        {role && dashboards[role] && (
          <NavLink
            to={dashboards[role].to}
            className={({ isActive }) =>
              `transition text-base font-bold px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-yellow-400 text-purple-900 shadow"
                  : "bg-yellow-300 text-purple-900 hover:bg-yellow-200 hover:text-purple-800"
              }`
            }
          >
            {dashboards[role].label}
          </NavLink>
        )}
        <button
          className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold px-5 py-2 rounded-full shadow border-2 border-yellow-300 hover:scale-105 transition-all flex items-center gap-2"
          onClick={() => setShowGiveModal(true)}
        >
          <FaHandHoldingUsd /> Give Now
        </button>
        {!loggedIn && (
          <>
            <Link to="/login" className="flex items-center gap-2 bg-purple-800 border border-yellow-300 hover:bg-yellow-300 hover:bg-opacity-20 text-white px-4 py-2 rounded-xl font-bold transition shadow">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/signup" className="flex items-center gap-2 bg-yellow-300 text-purple-900 hover:bg-yellow-400 px-4 py-2 rounded-xl font-bold transition shadow">
              <FaUserPlus /> Sign Up
            </Link>
          </>
        )}
        {loggedIn && (
          <div className="relative">
            <button
              onClick={() => setProfileDropdown((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-800 hover:bg-yellow-300 hover:bg-opacity-20 border border-yellow-300 rounded-xl font-bold text-white shadow transition"
            >
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
              <svg className={`w-4 h-4 ml-1 transition-transform ${profileDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-purple-800 border border-yellow-300 rounded-lg shadow-xl z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-yellow-300 hover:bg-opacity-20 font-medium transition"
                  onClick={() => setProfileDropdown(false)}
                >
                  My Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-300 hover:bg-opacity-20 font-medium border-t border-yellow-200 transition"
                  onClick={() => { setProfileDropdown(false); localStorage.clear(); navigate("/login"); }}
                >
                  <FaSignOutAlt className="inline-block mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center text-3xl text-white hover:text-yellow-300 transition ml-auto"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      <div className={`fixed md:hidden inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${menuOpen ? "block" : "hidden"}`} onClick={() => setMenuOpen(false)}>
        <div className="absolute top-0 right-0 w-72 h-full bg-purple-700 shadow-lg px-6 py-8 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
          <Link to="/" className="text-4xl font-black tracking-tight drop-shadow select-none mb-6">
            <span className="text-white">Churp</span><span className="text-yellow-400">a</span><span className="text-white">y</span>
          </Link>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block text-lg px-3 py-2 rounded ${
                  isActive
                    ? "bg-yellow-300 text-purple-900 font-bold"
                    : "text-white hover:bg-yellow-300 hover:bg-opacity-20"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
          {role && dashboards[role] && (
            <NavLink
              to={dashboards[role].to}
              className="block text-lg px-3 py-2 rounded bg-yellow-300 text-purple-900 font-bold mt-3"
              onClick={() => setMenuOpen(false)}
            >
              {dashboards[role].label}
            </NavLink>
          )}
          <button
            className="block bg-gradient-to-r from-yellow-400 to-yellow-300 text-white font-bold px-3 py-2 rounded-full shadow mt-3"
            onClick={() => { setMenuOpen(false); setShowGiveModal(true); }}
          >
            <FaHandHoldingUsd className="inline mr-2" /> Give Now
          </button>
          {!loggedIn && (
            <>
              <Link to="/login" className="block mt-3 bg-purple-800 border border-yellow-300 text-white px-3 py-2 rounded-xl font-bold hover:bg-yellow-300 hover:bg-opacity-20" onClick={() => setMenuOpen(false)}>
                <FaSignInAlt className="inline mr-2" /> Login
              </Link>
              <Link to="/signup" className="block mt-2 bg-yellow-300 text-purple-900 px-3 py-2 rounded-xl font-bold hover:bg-yellow-400" onClick={() => setMenuOpen(false)}>
                <FaUserPlus className="inline mr-2" /> Sign Up
              </Link>
            </>
          )}
          {loggedIn && (
            <button className="block mt-4 bg-red-500 text-white px-3 py-2 rounded font-bold" onClick={() => { setMenuOpen(false); localStorage.clear(); navigate("/login"); }}>
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          )}
        </div>
      </div>

      {/* Give Now Modal */}
      {showGiveModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowGiveModal(false)}>
          <form
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
            onSubmit={handleGiveSubmit}
          >
            <button type="button" className="absolute top-2 right-3 text-xl text-gray-400 hover:text-red-600" onClick={() => setShowGiveModal(false)}>
              <FaTimes />
            </button>
            <div className="text-2xl font-bold text-purple-700 mb-2">Give Now</div>
            <label className="font-semibold text-sm text-purple-700">Amount (R)*</label>
            <input
              type="number"
              ref={giveInputRef}
              className="border rounded px-4 py-2 mb-2 text-lg font-bold focus:border-purple-400"
              min={1}
              value={giveAmount}
              onChange={e => setGiveAmount(e.target.value)}
              required
            />
            <label className="font-semibold text-sm text-purple-700">Name*</label>
            <input
              type="text"
              className="border rounded px-4 py-2 mb-2"
              value={giverName}
              onChange={e => setGiverName(e.target.value)}
              required
            />
            <label className="font-semibold text-sm text-purple-700">Surname*</label>
            <input
              type="text"
              className="border rounded px-4 py-2 mb-2"
              value={giverSurname}
              onChange={e => setGiverSurname(e.target.value)}
              required
            />
            <label className="font-semibold text-sm text-purple-700">Reference (optional)</label>
            <input
              type="text"
              className="border rounded px-4 py-2 mb-2"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. Thanksgiving, Project Name"
            />
            <label className="font-semibold text-sm text-purple-700">Select Church*</label>
            <select
              className="border rounded px-4 py-2 mb-3"
              value={selectedChurch}
              onChange={e => setSelectedChurch(e.target.value)}
              required
            >
              <option value="">-- Choose Church --</option>
              <option value="GCC">GCC</option>
              <option value="Hope Chapel">Hope Chapel</option>
              {/* Add more dynamically */}
            </select>
            <button type="submit" className="bg-yellow-400 text-purple-900 px-6 py-2 rounded font-bold text-lg hover:bg-yellow-300">Proceed to Pay</button>
          </form>
        </div>
      )}
    </nav>
  );
}