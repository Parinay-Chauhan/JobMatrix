import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Main Nav Links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/candidate/dashboard"
                className="text-xl font-bold text-indigo-600"
              >
                JobPortal
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/candidate/applications"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  My Applications
                </Link>
                <Link
                  to="/candidate/dashboard"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            {/* Right Action Icons & User Info */}
            <div className="flex items-center space-x-4">
              {/* Real-time Notification Bell */}
              <NotificationBell />

              {/* User Greeting & Logout */}
              <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
