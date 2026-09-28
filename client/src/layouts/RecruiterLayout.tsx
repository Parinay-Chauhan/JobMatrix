import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast } from "sonner";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRecruiterProfileQuery } from "../hooks/queries";
import { NotificationBell } from "../components/NotificationBell";

export const RecruiterLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile } = useRecruiterProfileQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);

  // Company logo or user avatar
  const avatarUrl = profile?.companyLogo || user?.avatar;

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
        y: -20,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // Logo entrance
      gsap.from(logoRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        delay: 0.05,
        ease: "power2.out",
      });

      // Nav entrance
      if (navLinksRef.current) {
        gsap.from(navLinksRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300"
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glow & grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Navbar Header - Floating Glassmorphic Pill */}
      <div
        ref={headerWrapperRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 sm:pt-5 pointer-events-none"
      >
        <header
          ref={headerRef}
          className={`pointer-events-auto flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? "w-[92%] max-w-5xl px-6 py-4 rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-black/80 ring-1 ring-emerald-500/10 text-white"
              : isScrolled
              ? "w-[88%] max-w-4xl px-5 py-2.5 rounded-full bg-slate-950/60 backdrop-blur-xl backdrop-saturate-150 border border-emerald-500/20 shadow-2xl shadow-black/60 ring-1 ring-emerald-500/10 text-white"
              : "w-[92%] max-w-5xl px-6 py-3 rounded-full bg-transparent border border-transparent text-white"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo Section */}
            <div ref={logoRef} className="flex items-center shrink-0">
              <Link to="/recruiter/dashboard" className="flex items-center group cursor-pointer">
                <span className="font-black tracking-tight text-xl sm:text-2xl text-white hover:opacity-90 transition-opacity">
                  Job<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Matrix</span>
                </span>
                <span className="ml-2 hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Employer
                </span>
              </Link>
            </div>

            {/* Navigation Center Links */}
            <nav
              ref={navLinksRef}
              className="hidden md:flex items-center space-x-7"
            >
              <NavLink
                to="/recruiter/dashboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-emerald-400 font-bold"
                      : "text-slate-300 hover:text-emerald-300"
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/recruiter/jobs/new"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-emerald-400 font-bold"
                      : "text-slate-300 hover:text-emerald-300"
                  }`
                }
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </NavLink>
              <NavLink
                to="/recruiter/jobs"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-emerald-400 font-bold"
                      : "text-slate-300 hover:text-emerald-300"
                  }`
                }
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Manage Jobs</span>
              </NavLink>
            </nav>

            {/* Right Side Actions: Notification Bell & Profile Avatar */}
            <div ref={userSectionRef} className="flex items-center space-x-3 shrink-0">
              <NotificationBell />

              {/* Recruiter Profile Avatar Link */}
              <Link
                to="/recruiter/profile"
                className="p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400/80 transition-all group cursor-pointer inline-block"
                title={`Profile: ${profile?.companyName || user?.fullName || "Employer"}`}
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-900 border border-slate-700/80 text-slate-100 flex items-center justify-center font-extrabold text-xs shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile?.companyName || user?.fullName || "Employer"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                      {userInitials}
                    </div>
                  )}
                </div>
              </Link>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800/80 mt-3 pt-3 pb-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile?.companyName || user?.fullName || "Employer"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                      {userInitials}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {profile?.companyName || user?.fullName || "Employer"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <NavLink
                to="/recruiter/dashboard"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/recruiter/jobs/new"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Post a Job</span>
              </NavLink>
              <NavLink
                to="/recruiter/jobs"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Manage Jobs</span>
              </NavLink>
              <NavLink
                to="/recruiter/profile"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Company Profile</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all flex items-center gap-2.5 cursor-pointer mt-2 border-t border-slate-800/80 pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;
