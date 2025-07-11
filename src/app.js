import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminAuthNavbar from "./components/AdminAuthNavbar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MemberDashboard from "./components/MemberDashboard";
import About from "./components/About";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import AdminDashboard from "./components/AdminDashboard";
import ChurchDashboard from "./components/ChurchDashboard";
import Project from "./components/Project";
import ProjectList from "./components/ProjectList";
import TransactionHistory from "./components/TransactionHistory";
import DemoLogin from "./components/DemoLogin";
import AllUsers from "./components/AllUsers";
import PendingChurches from "./components/PendingChurches";
import AdminAnalytics from "./components/AdminAnalytics";
import AdminChurchManagement from "./components/AdminChurchManagement";
import BulkMessage from "./components/BulkMessage";
import ActivityLog from "./components/ActivityLog";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ChurchLogoUpload from "./components/ChurchLogoUpload";
import ChurchList from "./components/ChurchList";
import ChurchProfile from "./components/ChurchProfile";
import ChurchEditForm from "./components/ChurchEditForm";
import AddChurchForm from "./components/AddChurchForm";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminAuthPage = location.pathname === "/admin-login" || location.pathname === "/admin-signup";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbars */}
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && <AdminAuthNavbar />}
      <main className="flex-grow flex items-center justify-center px-2 sm:px-0">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<Project />} />
          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          {/* Dashboards */}
          <Route path="/memberdashboard" element={<MemberDashboard />} />
          <Route path="/church_dashboard" element={<ChurchDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          {/* Transactions */}
          <Route path="/transactions" element={<TransactionHistory />} />
          {/* Demo */}
          <Route path="/demo-login" element={<DemoLogin />} />
          {/* Admin tools */}
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/pending-churches" element={<PendingChurches />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin-church-management" element={<AdminChurchManagement />} />
          <Route path="/bulk-message" element={<BulkMessage />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          {/* Profile, church, settings */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload-logo" element={<ChurchLogoUpload />} />
          <Route path="/churches" element={<ChurchList />} />
          <Route path="/churches/:id" element={<ChurchProfile />} />
          <Route path="/churches/:id/edit" element={<ChurchEditForm />} />
          <Route path="/add-church" element={<AddChurchForm />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="p-8 text-2xl text-red-500 text-center">
                404 Not Found – That page doesn’t exist, poi!<br />
                <a href="/" className="text-purple-700 underline block mt-3">Go home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;