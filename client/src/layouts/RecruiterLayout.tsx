import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const RecruiterLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Recruiter Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo & Recruiter Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/recruiter/dashboard"
                className="text-xl font-bold text-indigo-600 flex items-center gap-2"
              >
                JobPortal{" "}
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  Employer
                </span>
              </Link>

              {/* Navigation Links (Visible on all screens) */}
              <nav className="flex space-x-2 sm:space-x-4">
                <Link
                  to="/recruiter/dashboard"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/recruiter/jobs/new"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-2 text-sm font-medium"
                >
                  Post a Job
                </Link>
                <Link
                  to="/recruiter/jobs"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-2 text-sm font-medium"
                >
                  Manage Jobs
                </Link>
              </nav>
            </div>

            {/* Right Action Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <NotificationBell />

              <div className="flex items-center space-x-3 border-l pl-3 border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
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

      {/* Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
