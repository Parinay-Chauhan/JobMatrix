import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const RecruiterLayout: React.FC = () => {
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
    : "R";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Recruiter Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo & Recruiter Links */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Link
                to="/recruiter/dashboard"
                className="text-xl font-extrabold text-indigo-600 flex items-center gap-2 tracking-tight"
              >
                JobPortal{" "}
                <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100">
                  Employer
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink to="/recruiter/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/recruiter/jobs/new" className={navLinkClass}>
                  Post a Job
                </NavLink>
                <NavLink to="/recruiter/jobs" className={navLinkClass}>
                  Manage Jobs
                </NavLink>
              </nav>
            </div>

            {/* Right Action Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <NotificationBell />

              {/* Recruiter Profile Avatar Link */}
              <div className="flex items-center border-l pl-2 sm:pl-3 border-gray-200">
                <Link
                  to="/recruiter/profile"
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/40 hover:ring-offset-2 transition-all group cursor-pointer"
                  title={`Recruiter Profile: ${user?.fullName || "Employer"}`}
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-indigo-700 group-hover:scale-105 transition-all">
                    {userInitials}
                  </div>
                </Link>
              </div>

              {/* Mobile Hamburger Toggle */}
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
              to="/recruiter/dashboard"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/recruiter/jobs/new"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Post a Job
            </NavLink>
            <NavLink
              to="/recruiter/jobs"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Manage Jobs
            </NavLink>
            <NavLink
              to="/recruiter/profile"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Company Profile
            </NavLink>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;
