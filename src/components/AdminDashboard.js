
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminAuthNavbar from "./AdminAuthNavbar";
import {
  FaUsers,
  FaChurch,
  FaChartBar,
  FaEnvelope,
  FaMoneyBillWave,
  FaCrown,
  FaProjectDiagram,
  FaLightbulb,
} from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

// At the top of your component
<Toaster position="top-right" />


export default function AdminDashboard() {
  const navigate = useNavigate();
  // New states for dashboard counts
  const [churches, setChurches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [payoutLoading, setPayoutLoading] = useState(true);
  const [payoutError, setPayoutError] = useState(null);
  // Add state for action loading and error
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  // Section state for dashboard navigation
  const [section, setSection] = useState('dashboard');
  const [showDashboard, setShowDashboard] = useState(true);
  const [churchesLoading, setChurchesLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [churchesError, setChurchesError] = useState(null);
  const [membersError, setMembersError] = useState(null);
  const [projectsError, setProjectsError] = useState(null);

  // New state for viewing and editing churches
  const [viewChurch, setViewChurch] = useState(null);
  const [editChurch, setEditChurch] = useState(null);

  // Add state for edit/add church forms
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch dashboard data on mount (counts)
 useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const [
        churchesRes,
        projectsRes,
        membersRes,
        donationsRes
      ] = await Promise.all([
        axios.get("https://churpay-backend.onrender.com/api/churches"),
        axios.get("https://churpay-backend.onrender.com/api/projects"),
        axios.get("https://churpay-backend.onrender.com/api/members"),
        axios.get("https://churpay-backend.onrender.com/api/donations")
      ]);
      setChurches(Array.isArray(churchesRes.data) ? churchesRes.data : (Array.isArray(churchesRes.data.churches) ? churchesRes.data.churches : []));
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : (Array.isArray(projectsRes.data.projects) ? projectsRes.data.projects : []));
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : (Array.isArray(membersRes.data.members) ? membersRes.data.members : []));
      setDonations(Array.isArray(donationsRes.data) ? donationsRes.data : (Array.isArray(donationsRes.data.donations) ? donationsRes.data.donations : []));
      setLoading(false);
    } catch (err) {
      setError("Admin dashboard data fetch failed");
      setLoading(false);
      console.error("Admin dashboard data fetch failed:", err);
    }
  }
  fetchData();
  // ... keep the rest as is
}, []);

// Separate useEffect for payouts and stats
useEffect(() => {
  const token = localStorage.getItem("adminToken");
  axios.get("https://churpay-backend.onrender.com/api/admin/stats", {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => {
      setStats(res.data);
    })
    .catch(() => {
      // Do not overwrite error if already set
    });
  setPayoutLoading(true);
  axios.get("https://churpay-backend.onrender.com/api/admin/payout-requests", {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => {
      setPayoutRequests(res.data);
      setPayoutLoading(false);
    })
    .catch(() => {
      setPayoutError("Could not load payout requests");
      setPayoutLoading(false);
    });
}, []);

  // Approve/Deny payout request handler
  const handlePayoutAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: null }));
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `https://churpay-backend.onrender.com/api/admin/payout-requests/${id}/action`,
        { action },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      // Update payoutRequests state
      setPayoutRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'denied' } : req)
      );
    } catch (err) {
      setActionError(prev => ({ ...prev, [id]: err?.response?.data?.error || 'Action failed' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Handler for summary card clicks
  const handleSection = (sectionName) => {
    setSection(sectionName);
    setShowDashboard(false);
  };
  const handleBack = () => setShowDashboard(true);

  // Fetch churches, members, and projects when their section is selected
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (section === 'churches') {
      setChurchesLoading(true);
      setChurchesError(null);
      axios.get("https://churpay-backend.onrender.com/api/admin/churches", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          setChurches(Array.isArray(res.data) ? res.data : (Array.isArray(res.data.churches) ? res.data.churches : []));
          setChurchesLoading(false);
        })
        .catch(() => {
          setChurchesError("Could not load churches");
          setChurchesLoading(false);
        });
    }
    if (section === 'members') {
      setMembersLoading(true);
      setMembersError(null);
      axios.get("https://churpay-backend.onrender.com/api/admin/members", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          setMembers(Array.isArray(res.data) ? res.data : (Array.isArray(res.data.members) ? res.data.members : []));
          setMembersLoading(false);
        })
        .catch(() => {
          setMembersError("Could not load members");
          setMembersLoading(false);
        });
    }
    if (section === 'projects') {
      setProjectsLoading(true);
      setProjectsError(null);
      axios.get("https://churpay-backend.onrender.com/api/admin/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          setProjects(Array.isArray(res.data) ? res.data : (Array.isArray(res.data.projects) ? res.data.projects : []));
          setProjectsLoading(false);
        })
        .catch(() => {
          setProjectsError("Could not load projects");
          setProjectsLoading(false);
        });
    }
  }, [section]);

  // Handle form input changes
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle edit church submit
  const handleEditSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const token = localStorage.getItem("adminToken");
      const formEl = e.target;
      const data = {
        church_name: formData.name,
        email: formData.email,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
        address: formData.address
      };
      // Only include password if changed
      if (formData.password) data.password = formData.password;
      // Handle required PDF uploads for edit
      const bankConfirmation = formEl.bankConfirmation.files[0];
      const cor14 = formEl.cor14.files[0];
      if (!bankConfirmation || !cor14) {
        setFormError('Both required documents must be uploaded.');
        setSubmitting(false);
        return;
      }
      data.bankConfirmation = await toBase64(bankConfirmation);
      data.cor14 = await toBase64(cor14);
      await axios.put(
        `https://churpay-backend.onrender.com/api/admin/churches/${editChurch.id}`,
        data,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setFormSuccess('Church updated successfully!');
      toast.success('Church updated successfully!');
      setEditChurch(null);
      // Refresh churches list
      const res = await axios.get("https://churpay-backend.onrender.com/api/admin/churches", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setChurches(res.data);
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to update church');
      toast.error(err?.response?.data?.message || 'Failed to update church');
    } finally {
      setSubmitting(false);
    }
  };

  // When opening edit modal, prefill formData
  useEffect(() => {
    if (editChurch) {
      setFormData({
        name: editChurch.church_name || '',
        email: editChurch.email || '',
        password: '',
        bankName: editChurch.bankName || '',
        accountNumber: editChurch.accountNumber || '',
        accountHolder: editChurch.accountHolder || '',
        address: editChurch.address || ''
      });
      setFormError(null);
      setFormSuccess(null);
    }
  }, [editChurch]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-purple-700">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="pt-24 md:pt-28 bg-gray-50 min-h-screen w-full">
      <AdminAuthNavbar />
      <div className="w-full max-w-7xl mx-auto px-6 py-12 font-inter">
        {showDashboard ? (
          <>
            {/* Hero Card */}
            <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-12 mb-12 text-white overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
              <div className="flex items-center gap-8 flex-1">
                <MdOutlineDashboard className="text-8xl drop-shadow-xl" />
                <div>
                  <div className="text-xl font-semibold tracking-wide mb-1">Welcome,</div>
                  <div className="text-4xl font-bold leading-tight">Admin</div>
                  <div className="text-lg font-medium text-white mt-0.5">Platform Admin</div>
                  <div className="text-sm mt-2 text-purple-200">"Manage churches, projects, users and more."</div>
                </div>
              </div>
            </div>
            {/* Dashboard Counts (Styled like AdminCard grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <AdminCard
                icon={<FaChurch className="text-2xl text-purple-500" />}
                label={
                  <div className="flex flex-col">
                    <span className="font-extrabold text-3xl text-gray-900 dark:text-white mb-1">{churches.length}</span>
                    <span className="font-bold text-base text-gray-700 dark:text-gray-200">Churches</span>
                  </div>
                }
                desc={<span className="text-xs text-gray-500 dark:text-gray-400">Total churches</span>}
              />
              <AdminCard
                icon={<FaUsers className="text-2xl text-green-500" />}
                label={
                  <div className="flex flex-col">
                    <span className="font-extrabold text-3xl text-gray-900 dark:text-white mb-1">{members.length}</span>
                    <span className="font-bold text-base text-gray-700 dark:text-gray-200">Members</span>
                  </div>
                }
                desc={<span className="text-xs text-gray-500 dark:text-gray-400">Total members</span>}
              />
              <AdminCard
                icon={<FaProjectDiagram className="text-2xl text-blue-500" />}
                label={
                  <div className="flex flex-col">
                    <span className="font-extrabold text-3xl text-gray-900 dark:text-white mb-1">{projects.length}</span>
                    <span className="font-bold text-base text-gray-700 dark:text-gray-200">Projects</span>
                  </div>
                }
                desc={<span className="text-xs text-gray-500 dark:text-gray-400">Total projects</span>}
              />
              <AdminCard
                icon={<FaMoneyBillWave className="text-2xl text-yellow-500" />}
                label={
                  <div className="flex flex-col">
                    <span className="font-extrabold text-3xl text-gray-900 dark:text-white mb-1">{donations.length}</span>
                    <span className="font-bold text-base text-gray-700 dark:text-gray-200">Donations</span>
                  </div>
                }
                desc={<span className="text-xs text-gray-500 dark:text-gray-400">Total donations</span>}
              />
            </div>
            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 mt-10">
              <AdminCard
                icon={<FaChurch className="text-2xl text-purple-500" />}
                label="Manage Churches"
                desc="View, add, or update churches."
                onClick={() => handleSection('churches')}
              />
              <AdminCard
                icon={<FaUsers className="text-2xl text-green-500" />}
                label="Manage Members"
                desc="Control members & admins."
                onClick={() => handleSection('members')}
              />
              <AdminCard
                icon={<FaProjectDiagram className="text-2xl text-blue-500" />}
                label="Manage Projects"
                desc="Create & view all projects."
                onClick={() => handleSection('projects')}
              />
              <AdminCard
                icon={<FaChartBar className="text-2xl text-pink-500" />}
                label="Analytics"
                desc="See platform analytics."
                onClick={() => handleSection('analytics')}
              />
              <AdminCard
                icon={<MdOutlineMessage className="text-2xl text-blue-500" />}
                label="Messages"
                desc="Send or review messages."
                onClick={() => handleSection('messages')}
              />
              <AdminCard
                icon={<FaLightbulb className="text-2xl text-yellow-400" />}
                label="Ideas"
                desc="View and manage new ideas."
                onClick={() => handleSection('ideas')}
              />
              <AdminCard
                icon={<FaMoneyBillWave className="text-2xl text-yellow-500" />}
                label="Payout Requests"
                desc="Review and manage payout requests."
                onClick={() => handleSection('payouts')}
              />
            </div>
          </>
        ) : (
          <>
            <button onClick={handleBack} className="mb-6 px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">&larr; Back to Dashboard</button>
            {section === 'churches' && (
              <ChurchesSection
                churches={churches}
                loading={churchesLoading}
                error={churchesError}
                setChurches={setChurches}
                // Pass view and edit handlers
                handleViewDetails={setViewChurch}
                handleEditChurch={setEditChurch}
                viewChurch={viewChurch}
                editChurch={editChurch}
                handleEditSubmit={handleEditSubmit}
                form={formData}
                handleChange={handleChange}
                submitting={submitting}
                formError={formError}
                formSuccess={formSuccess}
                setEditChurch={setEditChurch}
                setViewChurch={setViewChurch}
              />
            )}
            {section === 'members' && (
              <MembersSection
                members={members}
                loading={membersLoading}
                error={membersError}
              />
            )}
            {section === 'analytics' && (
              <AnalyticsSection stats={stats} />
            )}
            {section === 'payouts' && (
             <PayoutsSection
  payoutRequests={Array.isArray(payoutRequests) ? payoutRequests : []}
  loading={payoutLoading}
  error={payoutError}
  actionLoading={actionLoading}
  actionError={actionError}
  handlePayoutAction={handlePayoutAction}
/> 
            )}
            {section === 'projects' && (
              <ProjectsSection 
                projects={projects}
                loading={projectsLoading}
                error={projectsError}
                setProjects={setProjects}
                actionLoading={actionLoading}
                setActionLoading={setActionLoading}
                actionError={actionError}
                setActionError={setActionError}
              />
            )}
            {section === 'messages' && (
              <MessagesSection />
            )}
            {section === 'ideas' && (
              <IdeasSection />
            )}
          </>
        )}
        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-10">
          ChurPay Admin &copy; {new Date().getFullYear()} — For the Kingdom 💜
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, value, label, borderColor, valueClass, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col items-start border-l-4 ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-400 hover:shadow-lg transition-all cursor-pointer w-full`}
      style={{ minHeight: 110 }}
    >
      {icon}
      <div className={`text-2xl font-extrabold mb-1 ${valueClass}`}>{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{label}</div>
    </button>
  );
}

// Reusable card component for admin sections
function AdminCard({ icon, label, desc, onClick }) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      type={onClick ? "button" : undefined}
      role={onClick ? "button" : undefined}
      className={`bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg p-6 flex flex-col gap-3 items-start transition-all border border-gray-50 dark:border-gray-800 ${onClick ? "cursor-pointer" : ""} group`}
    >
      <div className="mb-2">{icon}</div>
      <div className="font-semibold text-gray-800 dark:text-gray-100 text-lg group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-all">{label}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
    </Component>
  );
}

// Full-page Churches section with add form
function ChurchesSection({ churches, loading, error, setChurches, handleViewDetails, handleEditChurch, viewChurch, editChurch, handleEditSubmit, form, handleChange, submitting: parentSubmitting, formError: parentFormError, formSuccess: parentFormSuccess, setEditChurch, setViewChurch }) {
  // --- New state and handlers for manual add/approve/decline ---
  const API_BASE = "https://churpay-backend.onrender.com/api";
  const [newChurch, setNewChurch] = React.useState({ name: '', email: '' });
  const [addChurchLoading, setAddChurchLoading] = React.useState(false);
  const [addChurchError, setAddChurchError] = React.useState(null);
  const [addChurchSuccess, setAddChurchSuccess] = React.useState(null);
  // For search/filter
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false); // Local state for add modal
  const [formError, setFormError] = useState(null);    // Local state for add modal
  const [formSuccess, setFormSuccess] = useState(null); // Local state for add modal
  const filteredChurches = churches.filter(church =>
    (church.church_name || church.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Handler to fetch churches (for manual add reload)
  const fetchChurches = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/admin/churches`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setChurches(res.data);
    } catch (err) {
      // ignore
    }
  };

  // Manual add handler
  const handleAddChurch = async (e) => {
    e.preventDefault();
    setAddChurchLoading(true);
    setAddChurchError(null);
    setAddChurchSuccess(null);
    try {
      await axios.post(`${API_BASE}/admin/churches`, newChurch);
      await fetchChurches();
      setNewChurch({ name: '', email: '' });
      setAddChurchSuccess("Church added successfully!");
    } catch (err) {
      setAddChurchError('Error adding church');
      // Optionally: setAddChurchError(err?.response?.data?.message || 'Error adding church');
    } finally {
      setAddChurchLoading(false);
    }
  };

  // Approve/Decline handler
  const updateChurchStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/admin/churches/${id}/status`, { status });
      await fetchChurches();
    } catch (err) {
      // Could show error, but keeping simple
      // Optionally: toast.error(...)
    }
  };

  // --- END NEW LOGIC ---

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const formData = new FormData(e.target);
      const data = {
        role: 'church',
        church_name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        bankName: formData.get('bankName'),
        accountNumber: formData.get('accountNumber'),
        accountHolder: formData.get('accountHolder'),
        address: formData.get('address'),
      };
      // For demo, encode PDFs as base64 (replace with real upload in production)
      const bankConfirmation = formData.get('bankConfirmation');
      const cor14 = formData.get('cor14');
      if (bankConfirmation) {
        data.bankConfirmation = await toBase64(bankConfirmation);
      }
      if (cor14) {
        data.cor14 = await toBase64(cor14);
      }
      const token = localStorage.getItem("adminToken");
      await axios.post("https://churpay-backend.onrender.com/api/register", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      toast.success('Church added successfully!');
      setFormSuccess('Church added successfully!');
      setFormError(null);
      setShowAddModal(false);
      // Refresh the list after adding
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("https://churpay-backend.onrender.com/api/admin/churches", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setChurches(res.data);
      } catch (fetchErr) {
        toast.error('Failed to refresh church list');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add church');
      setFormError(err?.response?.data?.message || 'Failed to add church');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-yellow-200 flex items-center gap-2">
        <FaChurch className="text-purple-500" /> Churches
      </h2>
      {/* --- Manual Add Church Form --- */}
      <form onSubmit={handleAddChurch} className="mb-4 p-4 border rounded bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Add New Church</h2>
        <input
          type="text"
          placeholder="Church Name"
          value={newChurch.name}
          onChange={(e) => setNewChurch({ ...newChurch, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Church Email"
          value={newChurch.email}
          onChange={(e) => setNewChurch({ ...newChurch, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={addChurchLoading}>
          {addChurchLoading ? "Adding..." : "Add"}
        </button>
        {addChurchError && <div className="text-red-500 mt-2">{addChurchError}</div>}
        {addChurchSuccess && <div className="text-green-600 mt-2">{addChurchSuccess}</div>}
      </form>
      {/* --- END Manual Add --- */}
      <button
        className="mb-6 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl shadow disabled:opacity-60"
        onClick={() => setShowAddModal(true)}
      >
        + Add Church
      </button>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <form
            className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-800 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold text-purple-700 dark:text-yellow-200 mb-2">Register New Church</h3>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Church Name" className="border rounded px-3 py-2 w-full" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Church Email" className="border rounded px-3 py-2 w-full" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border rounded px-3 py-2 w-full" required />
            <input type="text" name="bankName" value={form.bankName || ''} onChange={handleChange} placeholder="Bank Name" className="border rounded px-3 py-2 w-full" required />
            <input type="text" name="accountNumber" value={form.accountNumber || ''} onChange={handleChange} placeholder="Bank Account Number" className="border rounded px-3 py-2 w-full" required />
            <input type="text" name="accountHolder" value={form.accountHolder || ''} onChange={handleChange} placeholder="Account Holder" className="border rounded px-3 py-2 w-full" required />
            <input type="text" name="address" value={form.address || ''} onChange={handleChange} placeholder="Church Address" className="border rounded px-3 py-2 w-full" required />
            <label className="block text-xs font-semibold text-purple-700 mt-2">Bank Confirmation Letter (PDF)</label>
            <input type="file" name="bankConfirmation" accept="application/pdf" className="border rounded px-3 py-2 w-full" required />
            <label className="block text-xs font-semibold text-purple-700 mt-2">COR14 (Company Registration PDF)</label>
            <input type="file" name="cor14" accept="application/pdf" className="border rounded px-3 py-2 w-full" required />
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Church'}
              </button>
              <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-purple-700 dark:text-purple-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            {formSuccess && <div className="text-green-600 mb-2">{formSuccess}</div>}
          </form>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search churches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading churches...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-6">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChurches.map(church => (
            <div key={church.id || church._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
              <div className="text-lg font-semibold text-purple-800 dark:text-yellow-200 mb-2">{church.church_name || church.name}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div>Email: {church.email}</div>
                  <div>Members: {church.member_count}</div>
                  <div>Projects: {church.project_count}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all"
                    onClick={() => handleViewDetails(church)}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-purple-700 dark:text-purple-200 px-4 py-2 rounded-lg font-semibold shadow transition-all"
                    onClick={() => handleEditChurch(church)}
                  >
                    Edit
                  </button>
                </div>
                {/* Approve/Decline buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateChurchStatus(church._id || church.id, 'approved')}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateChurchStatus(church._id || church.id, 'declined')}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* View Church Modal */}
      {viewChurch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setViewChurch(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-purple-700 dark:text-yellow-200 mb-4">{viewChurch.church_name}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div>Email: {viewChurch.email}</div>
              <div>Members: {viewChurch.member_count}</div>
              <div>Projects: {viewChurch.project_count}</div>
            </div>
            <button
              onClick={() => {
                handleEditChurch(viewChurch);
                setViewChurch(null);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all"
            >
              Edit Church
            </button>
            <button
              onClick={() => setViewChurch(null)}
              className="w-full mt-2 bg-gray-200 dark:bg-gray-700 text-purple-700 dark:text-purple-200 px-4 py-2 rounded-lg font-semibold shadow transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Church Modal */}
      {editChurch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setEditChurch(null)}>
          <form
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-lg w-full"
            onClick={e => e.stopPropagation()}
            onSubmit={handleEditSubmit}
          >
            <h3 className="text-xl font-bold text-purple-700 dark:text-yellow-200 mb-4">Edit Church</h3>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Church Name" className="border rounded px-3 py-2 w-full mb-4" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Church Email" className="border rounded px-3 py-2 w-full mb-4" required />
            <input type="text" name="bankName" value={form.bankName || ''} onChange={handleChange} placeholder="Bank Name" className="border rounded px-3 py-2 w-full mb-4" required />
            <input type="text" name="accountNumber" value={form.accountNumber || ''} onChange={handleChange} placeholder="Bank Account Number" className="border rounded px-3 py-2 w-full mb-4" required />
            <input type="text" name="accountHolder" value={form.accountHolder || ''} onChange={handleChange} placeholder="Account Holder" className="border rounded px-3 py-2 w-full mb-4" required />
            <input type="text" name="address" value={form.address || ''} onChange={handleChange} placeholder="Church Address" className="border rounded px-3 py-2 w-full mb-4" required />
            <label className="block text-xs font-semibold text-purple-700 mt-2">Bank Confirmation Letter (PDF)</label>
            <input type="file" name="bankConfirmation" accept="application/pdf" className="border rounded px-3 py-2 w-full mb-4" required />
            <label className="block text-xs font-semibold text-purple-700 mt-2">COR14 (Company Registration PDF)</label>
            <input type="file" name="cor14" accept="application/pdf" className="border rounded px-3 py-2 w-full mb-4" required />
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" disabled={parentSubmitting}>
                {parentSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-purple-700 dark:text-purple-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" onClick={() => setEditChurch(null)}>Cancel</button>
            </div>
            {parentFormError && <div className="text-red-600 mb-2">{parentFormError}</div>}
            {parentFormSuccess && <div className="text-green-600 mb-2">{parentFormSuccess}</div>}
          </form>
        </div>
      )}
    </div>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

// MembersSection with add-member functionality (calls /api/admin/add-member)
function MembersSection({ members, loading, error }) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', password: '', role: 'member' });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState(null);
  const [formSuccess, setFormSuccess] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      // Use the new /api/admin/add-member endpoint
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "/api/admin/add-member",
        {
          name: form.name,
          email: form.email,
          password: form.password
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setFormSuccess('Member added successfully!');
      setShowAddModal(false);
      setForm({ name: '', email: '', password: '', role: 'member' });
      // Optionally refresh members list (parent should refetch on section change)
      window.location.reload();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading members...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200 flex items-center gap-2">
        <FaUsers className="text-green-500" /> Members
      </h2>
      <button
        className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-xl shadow disabled:opacity-60"
        onClick={() => setShowAddModal(true)}
      >
        + Add Member
      </button>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <form
            className="w-full max-w-lg mx-auto bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-gray-900 dark:via-green-950 dark:to-gray-900 border-2 border-green-200 dark:border-green-800 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold text-green-700 dark:text-green-200 mb-2">Add New Member</h3>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="border rounded px-3 py-2 w-full" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border rounded px-3 py-2 w-full" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border rounded px-3 py-2 w-full" required />
            {/* Role selection omitted, as /add-member only accepts member creation */}
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Member'}
              </button>
              <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-green-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            {formSuccess && <div className="text-green-600 mb-2">{formSuccess}</div>}
          </form>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">{member.name}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div>Email: {member.email}</div>
                <div>Role: {member.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder for AnalyticsSection
function AnalyticsSection({ stats }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-pink-800 dark:text-pink-200 flex items-center gap-2">
        <FaChartBar className="text-pink-500" /> Analytics
      </h2>
      <div className="text-gray-600 dark:text-gray-300">Analytics coming soon.</div>
    </div>
  );
}

// Placeholder for PayoutsSection
function PayoutsSection({ payoutRequests, loading, error, actionLoading, actionError, handlePayoutAction }) {
  if (loading) return <div className="text-center py-8 text-gray-500">Loading payout requests...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!payoutRequests || payoutRequests.length === 0) return <div className="text-center py-8 text-gray-400">No payout requests found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-indigo-100 dark:bg-indigo-900">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Church</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {payoutRequests.map(req => (
            <tr key={req.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-2 whitespace-nowrap">{req.date ? new Date(req.date).toLocaleString() : '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap">{req.church_name || req.church_id || '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap font-bold text-green-700 dark:text-green-300">R{req.amount}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : req.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{req.status}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-60"
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handlePayoutAction(req.id, 'approve')}
                    >
                      {actionLoading[req.id] ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold disabled:opacity-60"
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handlePayoutAction(req.id, 'deny')}
                    >
                      {actionLoading[req.id] ? 'Denying...' : 'Deny'}
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
                {actionError[req.id] && (
                  <div className="text-xs text-red-600 mt-1">{actionError[req.id]}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Projects Section with add, approve and reject functionality
function ProjectsSection({ projects: parentProjects, loading: parentLoading, error: parentError, setProjects, actionLoading: parentActionLoading, setActionLoading }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [churches, setChurches] = useState([]);
  const [churchesLoading, setChurchesLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    church_id: '',
    target_amount: '',
    image: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch churches on component mount
  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    setChurchesLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("https://churpay-backend.onrender.com/api/admin/churches", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setChurches(res.data);
    } catch (err) {
      toast.error("Failed to load churches");
    } finally {
      setChurchesLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, files, type } = e.target;
    if (files && files[0]) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) : value 
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // Validate form
      if (!form.title || !form.description || !form.church_id || !form.target_amount || !form.image) {
        throw new Error("Please fill in all required fields");
      }

      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('church_id', form.church_id);
      formData.append('target_amount', form.target_amount);
      formData.append('status', 'active'); // Auto-approve projects created by admin
      
      // Convert image to base64 for API
      const imageBase64 = await toBase64(form.image);
      formData.append('image', imageBase64);

      await axios.post(
        "https://churpay-backend.onrender.com/api/admin/projects",
        { 
          title: form.title,
          description: form.description,
          church_id: form.church_id,
          target_amount: form.target_amount,
          status: 'active',
          image: imageBase64
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Project added successfully!");
      setFormSuccess("Project added successfully!");
      setShowAddModal(false);
      setForm({
        title: '',
        description: '',
        church_id: '',
        target_amount: '',
        image: null
      });
      
      // Refresh projects list
      refreshProjects();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message;
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const refreshProjects = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("https://churpay-backend.onrender.com/api/admin/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to refresh projects");
    }
  };

  const handleProjectAction = async (projectId, action) => {
    setActionLoading(prev => ({ ...prev, [projectId]: true }));
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `https://churpay-backend.onrender.com/api/admin/projects/${projectId}/action`,
        { action },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      // Update projects list with new status
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, status: action === 'approve' ? 'active' : 'rejected' }
            : project
        )
      );
      
      toast.success(`Project ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      toast.error(`Failed to ${action} project: ${err?.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Filter projects by search term
  const filteredProjects = parentProjects?.filter(project =>
    project.title?.toLowerCase().includes(search.toLowerCase()) ||
    project.description?.toLowerCase().includes(search.toLowerCase()) ||
    project.church_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200 flex items-center gap-2">
        <FaProjectDiagram className="text-blue-500" /> Projects
      </h2>
      
      {/* Add Project Button */}
      <button
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow disabled:opacity-60"
        onClick={() => setShowAddModal(true)}
      >
        + Add Project
      </button>
      
      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      
      {/* Projects List */}
      {parentLoading ? (
        <div className="text-center py-8 text-gray-500">Loading projects...</div>
      ) : parentError ? (
        <div className="text-center py-8 text-red-500">{parentError}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No projects found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900">
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Church</th>
                <th className="px-4 py-2 text-left">Target Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {project.image && (
                        <img 
                          src={`data:image/jpeg;base64,${project.image}`} 
                          alt={project.title} 
                          className="h-10 w-10 rounded object-cover mr-3" 
                        />
                      )}
                      <div>
                        <div className="font-bold text-blue-800 dark:text-blue-200">{project.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate" style={{maxWidth: '200px'}}>
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{project.church_name || project.church_id || '-'}</td>
                  <td className="px-4 py-2 font-bold text-green-700 dark:text-green-300">R{project.target_amount}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                      project.status === 'active' ? 'bg-green-200 text-green-800' : 
                      'bg-red-200 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {project.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-60"
                          disabled={!!parentActionLoading?.[project.id]}
                          onClick={() => handleProjectAction(project.id, 'approve')}
                        >
                          {parentActionLoading?.[project.id] ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold disabled:opacity-60"
                          disabled={!!parentActionLoading?.[project.id]}
                          onClick={() => handleProjectAction(project.id, 'reject')}
                        >
                          {parentActionLoading?.[project.id] ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <form
            className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-200 mb-2">Add New Project</h3>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Select Church</label>
              <select 
                name="church_id" 
                value={form.church_id} 
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                disabled={churchesLoading}
                required
              >
                <option value="">Select a church...</option>
                {churches.map(church => (
                  <option key={church.id} value={church.id}>{church.church_name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Project Title</label>
              <input 
                type="text" 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Project Title" 
                className="border rounded px-3 py-2 w-full" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Project Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Project Description" 
                className="border rounded px-3 py-2 w-full min-h-[100px]" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Target Amount (ZAR)</label>
              <input 
                type="number" 
                name="target_amount" 
                value={form.target_amount} 
                onChange={handleChange} 
                placeholder="0.00" 
                step="0.01"
                min="0"
                className="border rounded px-3 py-2 w-full" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Project Image</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleChange} 
                className="border rounded px-3 py-2 w-full" 
                required 
              />
            </div>
            
            <div className="flex gap-3 mt-2">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" 
                disabled={submitting || churchesLoading}
              >
                {submitting ? 'Adding...' : 'Add Project'}
              </button>
              <button 
                type="button" 
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-200 px-6 py-3 rounded-full font-bold shadow-lg text-lg transition-all" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
            
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            {formSuccess && <div className="text-green-600 mb-2">{formSuccess}</div>}
          </form>
        </div>
      )}
    </div>
  );
}

// Placeholder for MessagesSection
function MessagesSection() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200 flex items-center gap-2">
        <MdOutlineMessage className="text-blue-500" /> Messages
      </h2>
      <div className="text-gray-600 dark:text-gray-300">Messages coming soon.</div>
    </div>
  );
}

// Placeholder for IdeasSection
function IdeasSection() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
        <FaLightbulb className="text-yellow-400" /> Ideas
      </h2>
      <div className="text-gray-600 dark:text-gray-300">Ideas coming soon.</div>
    </div>
  );
}