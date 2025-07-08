<<<<<<< HEAD
import Dashboard from './components/Dashboard';
import PaymentForm from './components/PaymentForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// ...etc
=======

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminAuthNavbar from "./components/AdminAuthNavbar";
// Main pages
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
// Admin tools
import AllUsers from "./components/AllUsers";
import PendingChurches from "./components/PendingChurches";
import AdminAnalytics from "./components/AdminAnalytics";
import AdminChurchManagement from "./components/AdminChurchManagement";
import BulkMessage from "./components/BulkMessage";
import ActivityLog from "./components/ActivityLog";
// Profile & church management
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ChurchLogoUpload from "./components/ChurchLogoUpload";
import ChurchList from "./components/ChurchList";
import ChurchProfile from "./components/ChurchProfile";
import ChurchEditForm from "./components/ChurchEditForm";
import AddChurchForm from "./components/AddChurchForm";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
>>>>>>> c429ac8 (Add axios to frontend dependencies)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ...other routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}
<<<<<<< HEAD
export default App;
=======

export default AppWithRouter;
>>>>>>> c429ac8 (Add axios to frontend dependencies)
