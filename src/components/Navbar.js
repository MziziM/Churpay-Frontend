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
  const [givingType, setGivingType] = useState("Tithe");
  const [giveAmount, setGiveAmount] = useState(100);
  const [churches, setChurches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedChurch, setSelectedChurch] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const userName = localStorage.getItem("churpay_name") || "Profile";

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

  // Fetch churches and projects for giving options
  useEffect(() => {
    if (showGiveOptions) {
      axios.get("/api/churches").then(res => setChurches(res.data)).catch(() => setChurches([]));
      axios.get("/api/projects").then(res => setProjects(res.data)).catch(() => setProjects([]));
    }
  }, [showGiveOptions]);

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-indigo-700 px-4 py-3 flex items-center justify-between shadow-xl relative z-50 border-b-2 border-yellow-300/30">
      <Link to="/" className="flex items-center">
        <div className="relative">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200 tracking-wide">ChurPay</span>
          {isActive('/') && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </div>
      </Link>
      <button className="sm:hidden text-yellow-300 p-1 hover:bg-purple-700 hover:text-yellow-200 rounded-lg transition-all" onClick={() => setMenuOpen(!menuOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          {menuOpen ? (
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          )}
        </svg>
      </button>
      <div className={`flex-col sm:flex-row sm:flex items-center gap-3 md:gap-6 absolute sm:static bg-gradient-to-r from-purple-900 to-indigo-800 sm:bg-transparent left-0 w-full sm:w-auto px-4 py-6 sm:p-0 top-full sm:top-auto transition-all duration-300 shadow-xl sm:shadow-none z-40 ${menuOpen ? "flex" : "hidden sm:flex"}`}>
        <Link to="/features" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/features') ? 'text-yellow-300 font-semibold' : ''}`}>
          Features
          {isActive('/features') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>
        <Link to="/pricing" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/pricing') ? 'text-yellow-300 font-semibold' : ''}`}>
          Pricing
          {isActive('/pricing') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>
        <Link to="/about" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/about') ? 'text-yellow-300 font-semibold' : ''}`}>
          About
          {isActive('/about') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>
        <Link to="/faq" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/faq') ? 'text-yellow-300 font-semibold' : ''}`}>
          FAQ
          {isActive('/faq') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>
        {role === "member" && <Link to="/memberdashboard" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/memberdashboard') ? 'text-yellow-300 font-semibold' : ''}`}>
          Member Dashboard
          {isActive('/memberdashboard') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>}
        {role === "church" && <Link to="/church_dashboard" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/church_dashboard') ? 'text-yellow-300 font-semibold' : ''}`}>
          Church Dashboard
          {isActive('/church_dashboard') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>}
        {role === "admin" && <Link to="/admin" className={`relative text-yellow-100 hover:text-yellow-300 text-lg font-medium px-2 py-1 hover:bg-purple-700/30 rounded-lg transition-all ${isActive('/admin') ? 'text-yellow-300 font-semibold' : ''}`}>
          Admin Dashboard
          {isActive('/admin') && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></div>}
        </Link>}
        {!loggedIn && (
          <>
            <Link to="/login" className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-purple-900 font-bold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5">
              <FaSignInAlt className="text-sm" /> Login
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-yellow-300 font-bold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5">
              <FaUserPlus className="text-sm" /> Sign Up
            </Link>
          </>
        )}
        {/* Give Now Button and Modal - only when not logged in */}
        {!loggedIn && (
          <div className="flex flex-col items-end relative">
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-purple-900 font-bold px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl ml-2 flex items-center gap-1.5 border-2 border-yellow-200"
              onClick={() => setShowGiveOptions(prev => !prev)}
            >
              <FaHandHoldingUsd className="text-lg" /> Give Now
            </button>
            {showGiveOptions && (
              <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowGiveOptions(false)}>
                <form
                  className="flex flex-col bg-white dark:bg-gray-900 border-t-4 border-yellow-300 rounded-3xl shadow-2xl p-8 w-80 sm:w-96 z-40 relative max-h-[90vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                  onSubmit={e => {
                    e.preventDefault();
                    setShowGiveOptions(false);
                    // Generate PDF receipt
                    import('jspdf').then(jsPDFModule => {
                      const jsPDF = jsPDFModule.default;
                      const doc = new jsPDF();
                      doc.setFontSize(18);
                      doc.text("ChurPay Giving Receipt", 20, 20);
                      doc.setFontSize(12);
                      doc.text(`Name: ${name || 'John'}`, 20, 40);
                      doc.text(`Surname: ${surname || 'Doe'}`, 20, 50);
                      doc.text(`Type of Giving: ${givingType}`, 20, 60);
                      doc.text(`Reference: ${reference || 'CHURPAY-12345'}`, 20, 70);
                      doc.text(`Amount: R${giveAmount}`, 20, 80);
                      doc.text(`Date: ${new Date().toLocaleString()}`, 20, 90);
                      doc.save('ChurPay-Receipt.pdf');
                    });
                    // Build PayFast sandbox URL
                    let itemName = givingType;
                    if (givingType === "Church" && selectedChurch) itemName = `Church: ${selectedChurch}`;
                    if (givingType === "Project" && selectedProject) itemName = `Project: ${selectedProject}`;
                    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?amount=${giveAmount}&item_name=${encodeURIComponent(itemName)}&custom_str1=${reference || 'CHURPAY-12345'}&name_first=${name || 'John'}&name_last=${surname || 'Doe'}`;
                    window.location.href = payfastUrl;
                  }}
                >
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-yellow-300 mb-5 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-yellow-300 dark:to-yellow-400">
                      Make a Donation
                    </span>
                  </h3>
                  <div className="relative mb-4">
                    <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. John"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-3 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Surname</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Doe"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-3 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Reference</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. CHURPAY-12345"
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                        className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-3 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Give To</label>
                    <div className="relative">
                      <select
                        value={givingType}
                        onChange={e => setGivingType(e.target.value)}
                        className="w-full appearance-none border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-10 py-3 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
                      >
                        <option value="Tithe">Tithe (General)</option>
                        <option value="Church">Specific Church</option>
                        <option value="Project">Specific Project</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {givingType === "Church" && (
                    <div className="bg-purple-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-purple-100 dark:border-purple-700 mb-4">
                      <div className="relative mb-3">
                        <input
                          type="text"
                          placeholder="Search churches..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-purple-800 dark:text-yellow-100 font-medium text-base shadow focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedChurch}
                          onChange={e => setSelectedChurch(e.target.value)}
                          className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-purple-800 dark:text-yellow-100 font-medium text-base shadow focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                        >
                          <option value="">Select a church</option>
                          {churches.filter(c => (c.name || "").toLowerCase().includes(search.toLowerCase())).map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {givingType === "Project" && (
                    <div className="bg-purple-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-purple-100 dark:border-purple-700 mb-4">
                      <div className="relative">
                        <select
                          value={selectedProject}
                          onChange={e => setSelectedProject(e.target.value)}
                          className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-purple-800 dark:text-yellow-100 font-medium text-base shadow focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                        >
                          <option value="">Select a project</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.title}>{p.title}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="relative mb-6">
                    <label className="mb-2 text-purple-700 dark:text-yellow-200 font-semibold">Amount (R)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        value={giveAmount}
                        onChange={e => setGiveAmount(e.target.value)}
                        className="w-full border-2 border-purple-100 dark:border-purple-700 rounded-xl pl-10 pr-5 py-3 text-lg focus:border-purple-500 outline-none transition-all dark:bg-gray-800 dark:text-yellow-100 shadow-sm hover:shadow-md focus:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-300 font-medium py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                    onClick={() => setShowGiveOptions(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
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
    </nav>
  );
}