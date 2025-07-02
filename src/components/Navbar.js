import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("churpay_role");
  const loggedIn = !!localStorage.getItem("churpay_token");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  // Responsive menu toggle
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; }
  }, [menuOpen]);

  return (
    <nav className="bg-purple-800 px-4 py-3 flex items-center justify-between shadow-lg relative z-50">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide">ChurPay</Link>
      <button className="sm:hidden text-white text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <div className={`flex-col sm:flex-row sm:flex items-center gap-6 absolute sm:static bg-purple-900 sm:bg-transparent left-0 w-full sm:w-auto px-4 py-6 sm:p-0 top-full sm:top-auto transition-all duration-200 ${menuOpen ? "flex" : "hidden sm:flex"}`}>
        <Link to="/projects" className="text-white text-lg">Projects</Link>
        <Link to="/transactions" className="text-white text-lg">Transactions</Link>
        {role === "member" && <Link to="/memberdashboard" className="text-white text-lg">Member Dashboard</Link>}
        {role === "church" && <Link to="/church_dashboard" className="text-white text-lg">Church Dashboard</Link>}
        {role === "admin" && <Link to="/admin" className="text-white text-lg">Admin Dashboard</Link>}
        {!loggedIn && <Link to="/login" className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-xl font-bold ml-2">Login</Link>}
        {!loggedIn && <Link to="/signup" className="bg-yellow-300 text-purple-900 px-4 py-2 rounded-xl font-bold">Sign Up</Link>}
        {loggedIn && (
          <button
            className="bg-white/80 text-purple-800 px-4 py-2 rounded-xl font-bold mt-2 sm:mt-0"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}