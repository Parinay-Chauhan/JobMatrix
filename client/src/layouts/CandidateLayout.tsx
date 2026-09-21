import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-2xs"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    }`;

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "C";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Main Nav Links */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Link
                to="/candidate/dashboard"
                className="text-xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2"
              >
                JobPortal
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink to="/candidate/find-jobs" className={navLinkClass}>
                  Find Jobs
                </NavLink>
                <NavLink to="/candidate/applications" className={navLinkClass}>
                  My Applications
                </NavLink>
                <NavLink to="/candidate/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </nav>
            </div>

            {/* Right Action Icons & User Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Real-time Notification Bell */}
              <NotificationBell />

              {/* User Greeting & Logout */}
              <div className="flex items-center space-x-3 border-l pl-3 sm:pl-4 border-gray-200">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {userInitials}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[120px]">
                    {user?.fullName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:shadow-2xs cursor-pointer"
                >
                  Logout
                </button>
              </div>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/80 bg-white px-4 pt-3 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/candidate/find-jobs"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </NavLink>
            <NavLink
              to="/candidate/applications"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Applications
            </NavLink>
            <NavLink
              to="/candidate/profile"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </NavLink>
          </div>
        )}
      </header>

      {/* Dynamic Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;
