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
    `px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all inline-block ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25"
        : "text-slate-300 hover:text-emerald-300 hover:bg-slate-800/80"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
      isActive
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300"
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glow & grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Navbar Header - Dynamic Floating Glassmorphic Pill */}
      <div
        ref={headerWrapperRef}
        className="sticky top-0 z-50 pointer-events-none flex justify-center w-full px-3 sm:px-6 pt-3 sm:pt-4"
      >
        <header
          ref={headerRef}
          className={`pointer-events-auto flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? "rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl px-5 py-3" : "rounded-full"
          } ${
            isScrolled
              ? "w-[88%] max-w-4xl bg-slate-950/90 backdrop-blur-xl backdrop-saturate-150 border border-emerald-500/30 shadow-2xl shadow-black/80 px-4 sm:px-6 py-2 sm:py-2.5 ring-1 ring-emerald-500/10"
              : !mobileMenuOpen
              ? "w-[92%] max-w-5xl bg-transparent border border-transparent shadow-none ring-0 px-5 sm:px-7 py-2.5 sm:py-3"
              : "w-[92%] max-w-5xl"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Left Brand Logo */}
            <div ref={logoRef} className="flex items-center space-x-2 shrink-0">
              <Link
                to="/candidate/dashboard"
                className="flex items-center space-x-2.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                </div>
                <span
                  className={`font-black tracking-tight text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isScrolled ? "text-lg" : "text-xl sm:text-2xl"
                  }`}
                >
                  Job<span className="text-emerald-400">Matrix</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Candidate
                </span>
              </Link>
            </div>

            {/* Right Side Nav Links & User Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                  Explore Jobs
                </NavLink>
                <NavLink
                  to="/candidate/applications"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  My Applications
                </NavLink>
                <NavLink
                  to="/candidate/profile"
                  className={navLinkClass}
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  My Profile
                </NavLink>
              </nav>

              {/* Notification Bell & User Avatar */}
              <div
                ref={userSectionRef}
                className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-3 border-slate-800"
              >
                {/* Real-time Notification Bell */}
                <NotificationBell />

                {/* User Profile Avatar Link */}
                <Link
                  to="/candidate/profile"
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400/80 transition-all group cursor-pointer inline-block"
                  title={`Profile: ${user?.fullName || "Candidate"}`}
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    {userInitials}
                  </div>
                </Link>
              </div>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
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
            <div className="md:hidden border-t border-slate-800/80 mt-3 pt-3 pb-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <NavLink
                to="/candidate/find-jobs"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Jobs
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
                Profile & Resume
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-2 cursor-pointer"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Footer subtle branding */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 JobMatrix. Next-Gen Tech Talent & Career Platform.</p>
      </footer>
    </div>
  );
};

export default CandidateLayout;

