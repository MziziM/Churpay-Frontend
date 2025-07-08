import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminAuthNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Check auth status
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("adminToken"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    navigate("/admin-login");
  };

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
        }
        
        @keyframes slide-in-fade {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .dropdown-anim {
          transform: translateY(-15px);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.3s ease, max-height 0.4s ease;
          pointer-events: none;
          max-height: 0;
          overflow: hidden;
        }
        
        .dropdown-anim.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
          max-height: 500px; /* Increased to ensure all content fits */
          overflow: visible;
        }
        
        .dropdown-anim:hover,
        .dropdown-anim:focus-within {
          box-shadow: 0 8px 30px rgba(79, 70, 229, 0.3), 0 2px 8px rgba(79, 70, 229, 0.2), 
                      0 0 0 1px rgba(139, 92, 246, 0.3);
        }
        
        .btn-glow:focus, .btn-glow:active {
          outline: none;
          box-shadow: 0 0 0 2px rgba(165, 180, 252, 0.5), 0 0 15px rgba(99, 102, 241, 0.4);
        }
        
        /* Animated gold shimmer effect for the border */
        @keyframes border-shimmer {
          0% {
            background-position: -200px;
          }
          100% {
            background-position: 200px;
          }
        }
        
        /* Floating animation for interactive elements */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        /* Enhance status indicator */
        .status-indicator {
          position: relative;
        }
        
        .status-indicator::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2px solid #4C1D95;
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse-glow 2s infinite;
        }
      `}</style>
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900 to-indigo-800 shadow-xl py-3 flex justify-between items-center px-6 z-50 border-b-4 border-yellow-500">
        {/* Logo & Brand */}
        <Link to="/admin" className="flex items-center group">
          <div className="mr-3 relative">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="absolute -right-1 -top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-2xl tracking-tight">ChurPay</span>
            <span className="text-yellow-400 text-xs font-semibold -mt-1">ADMIN PORTAL</span>
          </div>
        </Link>
        
        {/* Right Side Elements */}
        <div className="flex items-center gap-5">
          {/* Date & Time Display */}
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-yellow-300 text-sm font-medium">
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span className="text-indigo-200 text-xs">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {/* Admin Profile Dropdown */}
          <div className="relative flex items-center" style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none flex items-center gap-2 p-2 rounded-lg btn-glow group"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              tabIndex={0}
              type="button"
            >
              {/* Admin Avatar with Animation */}
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-indigo-300 transform group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full p-0.5">
                  <span className="block w-full h-full bg-green-500 rounded-full animate-pulse"></span>
                </span>
              </div>
              
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold">Admin Portal</div>
                <div className="text-xs opacity-75">{isLoggedIn ? 'Signed In' : 'Signed Out'}</div>
              </div>
              
              <svg
                className={`ml-1 w-4 h-4 fill-current dropdown-arrow transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            
            {/* Enhanced Dropdown Menu */}
            <div
              className={`absolute right-0 mt-6 w-64 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-2xl ring-1 ring-purple-400 ring-opacity-50 z-[100] dropdown-anim ${dropdownOpen ? "open" : ""}`}
              style={{ minWidth: "280px", top: "100%" }}
              tabIndex={-1}
              aria-hidden={!dropdownOpen}
            >
              {/* Admin Header */}
              <div className="px-4 py-3 border-b border-indigo-700">
                <div className="text-yellow-300 font-medium">Admin Control Panel</div>
                <div className="text-xs text-indigo-200">{isLoggedIn ? 'Welcome back, Administrator' : 'Please sign in'}</div>
              </div>
              
              {/* Quick Links */}
              <Link to="/admin" className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-700 focus:outline-none btn-glow flex items-center gap-3 transition-colors duration-200">
                <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Control Panel</div>
                  <div className="text-xs text-indigo-300">Manage your platform</div>
                </div>
              </Link>
              
              <Link to="/admin/settings" className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-700 focus:outline-none btn-glow flex items-center gap-3 transition-colors duration-200">
                <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-indigo-300">Configure system options</div>
                </div>
              </Link>
              
              <hr className="border-t border-indigo-700 my-1 opacity-50" />
              
              {/* Logout Button */}
              {isLoggedIn ? (
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-white hover:bg-red-700 rounded-b-xl focus:outline-none btn-glow flex items-center gap-3 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Sign Out</div>
                    <div className="text-xs text-red-300">End your session</div>
                  </div>
                </button>
              ) : (
                <button onClick={() => navigate('/admin-login')} className="block w-full text-left px-4 py-3 text-white hover:bg-green-700 rounded-b-xl focus:outline-none btn-glow flex items-center gap-3 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Sign In</div>
                    <div className="text-xs text-green-300">Access admin portal</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}