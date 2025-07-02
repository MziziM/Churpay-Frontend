import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MemberDashboard from "./components/MemberDashboard";
import About from "./components/About";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import AdminDashboard from "./components/AdminDashboard";
import Projects from "./components/Projects";
import ChurchDashboard from "./components/ChurchDashboard";
import ProjectsPublic from "./components/ProjectsPublic";
import ProjectPublic from "./components/Project";
import ProjectList from "./components/ProjectList";
import TransactionHistory from "./components/TransactionHistory";
import DemoLogin from "./components/DemoLogin";
import AllUsers from "./components/AllUsers";
import PendingChurches from "./components/PendingChurches";
import AdminAnalytics from "./components/AdminAnalytics";
import AdminChurchManagement from "./components/AdminChurchManagement";
import BulkMessage from "./components/BulkMessage";
import ActivityLog from "./components/ActivityLog";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Project from "./components/Project";
import ChurchLogoUpload from "./components/ChurchLogoUpload";
import ChurchList from "./components/ChurchList";
import ChurchProfile from "./components/ChurchProfile";
import ChurchEditForm from "./components/ChurchEditForm";
import AddChurchForm from "./components/AddChurchForm";

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<Project />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/memberdashboard" element={<MemberDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/church_dashboard" element={<ChurchDashboard />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/demo-login" element={<DemoLogin />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/pending-churches" element={<PendingChurches />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
            <Route path="/admin-church-management" element={<AdminChurchManagement />} />
            <Route path="/bulk-message" element={<BulkMessage />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload-logo" element={<ChurchLogoUpload />} /> 
            <Route path="*" element={<div className="p-8 text-2xl text-red-500">404 Not Found – That page doesn’t exist, poi!</div>} />
            <Route path="/churches" element={<ChurchList />} />
            <Route path="/churches/:id" element={<ChurchProfile />} />
            <Route path="/churches/:id/edit" element={<ChurchEditForm />} />
            <Route path="/add-church" element={<AddChurchForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;