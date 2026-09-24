import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/NotificationBell";

export const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all inline-block ${
      isActive
        ? "bg-indigo-600 text-white shadow-xs"
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
    : "C";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Header - Dynamic Floating Glassmorphic Pill */}
      <div
        ref={headerWrapperRef}
        className="sticky top-0 z-50 pointer-events-none flex justify-center w-full px-3 sm:px-6"
      >
        <header
          ref={headerRef}
          className={`pointer-events-auto flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "mt-3 w-[92%] max-w-4xl rounded-full bg-white/85 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-indigo-950/5 ring-1 ring-black/5 px-4 sm:px-6 py-2"
              : "mt-0 w-full max-w-7xl rounded-none bg-white border-b border-gray-200/80 shadow-2xs px-4 sm:px-8 py-3.5"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Left Brand Logo */}
            <div ref={logoRef} className="flex items-center space-x-2 shrink-0">
              <Link
                to="/candidate/dashboard"
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                </div>
                <span
                  className={`font-black tracking-tight text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isScrolled ? "text-lg" : "text-xl sm:text-2xl"
                  }`}
                >
                  Job<span className="text-indigo-600">Matrix</span>
                </span>
              </Link>
            </div>

            {/* Right Side Nav Links & User Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop Nav Links */}
              <nav
                ref={navLinksRef}
                className={`hidden md:flex items-center transition-all ${
                  isScrolled ? "space-x-1" : "space-x-2"
                }`}
              >
                <NavLink
                  to="/candidate/find-jobs"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  Find Jobs
                </NavLink>
                <NavLink
                  to="/candidate/applications"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  My Applications
                </NavLink>
              </nav>

              {/* Notification Bell & User Avatar */}
              <div
                ref={userSectionRef}
                className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-3 border-gray-200"
              >
                {/* Real-time Notification Bell */}
                <NotificationBell />

                {/* User Profile Avatar Link */}
                <Link
                  to="/candidate/profile"
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/40 hover:ring-offset-2 transition-all group cursor-pointer inline-block"
                  title={`Profile: ${user?.fullName || "Candidate"}`}
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:opacity-90 transition-opacity">
                    {userInitials}
                  </div>
                </Link>
              </div>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
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

          {/* Collapsible Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/80 mt-2 pt-3 pb-2 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
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
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </header>
      </div>

      {/* Dynamic Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;
