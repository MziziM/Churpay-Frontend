import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = !!localStorage.getItem("churpay_token");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const avatarButtonRef = useRef(null);

  function handleLogout() {
    localStorage.removeItem("churpay_token");
    localStorage.removeItem("churpay_church_name");
    navigate("/login");
  }

  // Helper to highlight the current page
  function navClass(path) {
    return `hover:text-yellow-400 transition${location.pathname === path ? " underline" : ""}`;
  }

  // Close profile menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Close profile menu on selecting an option
  function handleProfileOptionClick() {
    setShowProfileMenu(false);
  }

  return (
    <nav className="bg-purple-800 px-4 sm:px-6 py-4 flex justify-between items-center shadow-lg z-40 relative">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide">ChurPay</Link>
      {/* Main Nav */}
      <div className="flex gap-2 sm:gap-6 items-center">
        <Link to="/transactions" className={`text-white ${navClass("/transactions")}`}>Transactions</Link>
        <Link to="/demo-login" className={`text-white ${navClass("/demo-login")}`}>Demo Login</Link>
        {loggedIn && (
          <Link to="/dashboard" className={`text-white ${navClass("/dashboard")}`}>Dashboard</Link>
        )}

        {/* ADMIN DROPDOWN */}
        <div className="relative">
          <button
            className="text-white font-semibold flex items-center gap-1 px-3 py-2 hover:text-yellow-400 rounded transition"
            onClick={() => setShowAdminMenu(v => !v)}
            type="button"
            aria-haspopup="true"
            aria-expanded={showAdminMenu}
          >
            Admin
            <svg width="16" height="16" className="inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 7l4.5 4.5L14.5 7" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          {showAdminMenu && (
  <div
    className="absolute right-0 mt-2 bg-white/95 rounded-xl shadow-lg py-2 w-52 z-[2147483647] border border-purple-100"
    tabIndex={0}
    onMouseEnter={() => setShowAdminMenu(true)}
    onMouseLeave={() => setShowAdminMenu(false)}
    style={{pointerEvents: "auto"}}
  >
    <Link to="/admin" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Admin Home</Link>
    <Link to="/all-users" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">All Users</Link>
    <Link to="/pending-churches" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Pending Churches</Link>
    <Link to="/admin-analytics" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Analytics</Link>
    <Link to="/admin-church-management" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Manage Churches</Link>
    <Link to="/bulk-message" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Bulk Message</Link>
    <Link to="/activity-log" onClick={() => setShowAdminMenu(false)} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Activity Log</Link>
  </div>
)}
        </div>
      </div>

      {/* Profile & Auth */}
      <div className="flex items-center gap-3 relative">
        {loggedIn ? (
          <>
            <button
              ref={avatarButtonRef}
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu(v => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowProfileMenu(false);
                  avatarButtonRef.current?.focus();
                }
              }}
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-yellow-300 text-purple-800 font-bold text-2xl border-2 border-yellow-400 shadow hover:bg-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              title="View Profile"
              type="button"
            >
              {(localStorage.getItem("churpay_church_name") || "U")[0].toUpperCase()}
              <span className="absolute inset-0 rounded-full pointer-events-none transition-shadow duration-300 ease-in-out hover:shadow-[0_0_8px_2px_rgba(139,92,246,0.7)] focus:shadow-[0_0_8px_2px_rgba(139,92,246,0.7)]"></span>
            </button>
            {showProfileMenu && (
              <div
                ref={profileMenuRef}
                role="menu"
                aria-orientation="vertical"
                aria-label="Profile options"
                tabIndex={-1}
                className="absolute right-0 mt-3 w-48 bg-white/80 backdrop-blur rounded-xl border border-purple-300 shadow-lg py-3 z-50 origin-top-right animate-fade-slide-down"
                style={{animationFillMode: 'forwards'}}
              >
                <div className="px-5 py-2 text-purple-800 font-semibold border-b border-purple-200">
                  {localStorage.getItem("churpay_church_name") || "User"}
                </div>
                <Link
                  to="/profile"
                  onClick={handleProfileOptionClick}
                  className="block px-5 py-3 text-purple-800 hover:bg-yellow-100 hover:text-yellow-700 text-lg font-medium transition rounded"
                  role="menuitem"
                  tabIndex={0}
                >
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={handleProfileOptionClick}
                  className="block px-5 py-3 text-purple-800 hover:bg-yellow-100 hover:text-yellow-700 text-lg font-medium transition rounded"
                  role="menuitem"
                  tabIndex={0}
                >
                  Settings
                </Link>
                <button
                  onClick={() => { handleLogout(); handleProfileOptionClick(); }}
                  className="w-full text-left px-5 py-3 text-purple-800 hover:bg-yellow-100 hover:text-yellow-700 text-lg font-medium transition rounded"
                  role="menuitem"
                  tabIndex={0}
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            className="bg-yellow-400 text-purple-800 font-semibold px-5 py-3 rounded-xl shadow hover:bg-yellow-300 transition ml-2 text-lg"
            to="/signup"
          >
            Sign Up
          </Link>
        )}
      </div>

      <style>{`
@keyframes fade-slide-down {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-slide-down {
  animation: fade-slide-down 200ms ease forwards;
}
`}</style>
    </nav>
  );
}