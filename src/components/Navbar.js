import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaHandHoldingUsd, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("churpay_role");
  const loggedIn = !!localStorage.getItem("churpay_token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGiveOptions, setShowGiveOptions] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // For pro: Get user's name, fallback = Profile
  const userName = localStorage.getItem("churpay_name") || "Profile";

  // Responsive menu toggle
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; }
  }, [menuOpen]);

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-indigo-700 px-4 py-3 flex items-center justify-between shadow-xl relative z-50 border-b-2 border-yellow-300/30">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200 tracking-wide">ChurPay</span>
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="sm:hidden text-yellow-300 p-1 hover:bg-purple-700 hover:text-yellow-200 rounded-lg transition-all"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          {menuOpen ? (
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          )}
        </svg>
      </button>

      {/* Navigation Links */}
      <div className={`flex-col sm:flex-row sm:flex items-center gap-3 md:gap-6 absolute sm:static bg-gradient-to-r from-purple-900 to-indigo-800 sm:bg-transparent left-0 w-full sm:w-auto px-4 py-6 sm:p-0 top-full sm:top-auto transition-all duration-300 shadow-xl sm:shadow-none z-40 ${menuOpen ? "flex" : "hidden sm:flex"}`}>
        <Link to="/features" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/features') ? 'text-yellow-300 font-semibold' : ''}`}>Features</Link>
        <Link to="/pricing" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/pricing') ? 'text-yellow-300 font-semibold' : ''}`}>Pricing</Link>
        <Link to="/about" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/about') ? 'text-yellow-300 font-semibold' : ''}`}>About</Link>
        <Link to="/faq" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/faq') ? 'text-yellow-300 font-semibold' : ''}`}>FAQ</Link>
        {/* Dashboards */}
        {role === "member" && <Link to="/memberdashboard" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/memberdashboard') ? 'text-yellow-300 font-semibold' : ''}`}>Member Dashboard</Link>}
        {role === "church" && <Link to="/church_dashboard" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/church_dashboard') ? 'text-yellow-300 font-semibold' : ''}`}>Church Dashboard</Link>}
        {role === "admin" && <Link to="/admin" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 rounded-lg transition-all ${isActive('/admin') ? 'text-yellow-300 font-semibold' : ''}`}>Admin Dashboard</Link>}

        {/* Only when logged OUT */}
        {!loggedIn && (
          <>
            <Link to="/login" className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-purple-900 font-bold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5">
              <FaSignInAlt className="text-sm" /> Login
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-yellow-300 font-bold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5">
              <FaUserPlus className="text-sm" /> Sign Up
            </Link>
            {/* Give Now only for NOT logged in */}
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-purple-900 font-bold px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl ml-2 flex items-center gap-1.5 border-2 border-yellow-200"
              onClick={() => setShowGiveOptions(prev => !prev)}
            >
              <FaHandHoldingUsd className="text-lg" /> Give Now
            </button>
          </>
        )}

        {/* Profile dropdown - only for logged IN */}
        {loggedIn && (
          <div className="relative ml-2 mt-2 sm:mt-0">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-xl text-yellow-200 font-bold hover:bg-yellow-300 hover:text-purple-900 transition-all shadow border border-yellow-300/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              onClick={() => setProfileDropdown((open) => !open)}
              style={{ minWidth: 0 }}
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden sm:inline">{userName}</span>
              <svg className={`w-4 h-4 ml-1 transition-transform ${profileDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-purple-200 rounded-lg shadow-xl z-40">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-purple-700 hover:bg-purple-50 font-medium transition"
                  onClick={() => setProfileDropdown(false)}
                >
                  My Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium border-t border-purple-50 transition"
                  onClick={() => { setProfileDropdown(false); handleLogout(); }}
                >
                  <FaSignOutAlt className="inline-block mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}