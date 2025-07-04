import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

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
      axios.get("https://churpay-backend.onrender.com/api/churches").then(res => setChurches(res.data)).catch(() => setChurches([]));
      axios.get("https://churpay-backend.onrender.com/api/projects").then(res => setProjects(res.data)).catch(() => setProjects([]));
    }
  }, [showGiveOptions]);

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
        {/* Give Now Button for anyone */}
        <div className="flex flex-col items-end relative">
          <button
            className="bg-gradient-to-r from-yellow-400 to-purple-500 hover:from-purple-500 hover:to-yellow-400 text-white px-6 py-2 rounded-full text-base font-bold shadow-xl transition-all border-2 border-white"
            onClick={() => setShowGiveOptions(prev => !prev)}
          >
            Give Now
          </button>
          {showGiveOptions && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowGiveOptions(false)}>
              <form
                className="flex flex-col bg-white border border-purple-200 rounded-xl shadow-2xl p-6 w-80 z-40 relative"
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
                <label className="mb-2 text-purple-700 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mb-2 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                  required
                />
                <label className="mb-2 text-purple-700 font-semibold">Surname</label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  className="mb-2 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                  required
                />
                <label className="mb-2 text-purple-700 font-semibold">Reference</label>
                <input
                  type="text"
                  placeholder="e.g. CHURPAY-12345"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  className="mb-2 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                />
                <label className="mb-2 text-purple-700 font-semibold">Give To</label>
                <select
                  value={givingType}
                  onChange={e => setGivingType(e.target.value)}
                  className="mb-3 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="Tithe">Tithe (General)</option>
                  <option value="Church">Specific Church</option>
                  <option value="Project">Specific Project</option>
                </select>
                {givingType === "Church" && (
                  <>
                    <input
                      type="text"
                      placeholder="Search churches..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="mb-2 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                    />
                    <select
                      value={selectedChurch}
                      onChange={e => setSelectedChurch(e.target.value)}
                      className="mb-3 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                    >
                      <option value="">Select a church</option>
                      {churches.filter(c => (c.name || "").toLowerCase().includes(search.toLowerCase())).map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </>
                )}
                {givingType === "Project" && (
                  <select
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    className="mb-3 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                  >
                    <option value="">Select a project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                )}
                <label className="mb-2 text-purple-700 font-semibold">Amount (R)</label>
                <input
                  type="number"
                  min={1}
                  value={giveAmount}
                  onChange={e => setGiveAmount(e.target.value)}
                  className="mb-3 px-3 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 font-semibold text-base shadow focus:outline-none focus:border-purple-400 transition"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-6 py-2 rounded-full text-base font-bold shadow-xl transition-all mb-2"
                >
                  Give Now
                </button>
                <button
                  type="button"
                  className="text-gray-500 font-medium py-1 rounded hover:bg-purple-50 transition text-xs"
                  onClick={() => setShowGiveOptions(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}