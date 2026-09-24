import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const RecruiterLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.from(headerRef.current, {
        y: -35,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Logo bounce entrance
      gsap.from(logoRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: "back.out(1.7)",
      });

      // Nav Links stagger
      if (navLinksRef.current?.children) {
        gsap.from(navLinksRef.current.children, {
          y: -12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.25,
          ease: "power2.out",
        });
      }

      // User Section pop-in
      gsap.from(userSectionRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 0.35,
        ease: "back.out(1.5)",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNavHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: enter ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all inline-block ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-2xs"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100/60"
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
      {/* Recruiter Top Navigation Bar - Transparent Glassmorphism */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-gray-200/60 shadow-2xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left Brand Logo */}
            <div ref={logoRef} className="flex items-center">
              <Link
                to="/recruiter/dashboard"
                className="text-xl font-extrabold text-indigo-600 flex items-center gap-2 tracking-tight hover:opacity-90 transition-opacity"
              >
                JobMatrix{" "}
                <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100">
                  Employer
                </span>
              </Link>
            </div>

            {/* Right Side Nav Links & User Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Desktop Nav */}
              <nav ref={navLinksRef} className="hidden md:flex items-center space-x-1">
                <NavLink
                  to="/recruiter/dashboard"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/recruiter/jobs/new"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  Post a Job
                </NavLink>
                <NavLink
                  to="/recruiter/jobs"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  Manage Jobs
                </NavLink>
              </nav>

              {/* Notification Bell & Profile Avatar */}
              <div
                ref={userSectionRef}
                className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-3 border-gray-200"
              >
                <NotificationBell />

                {/* Recruiter Profile Avatar Link */}
                <Link
                  to="/recruiter/profile"
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/40 hover:ring-offset-2 transition-all group cursor-pointer inline-block"
                  title={`Recruiter Profile: ${user?.fullName || "Employer"}`}
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors">
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
