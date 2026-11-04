import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { useJobContext } from "../../context/JobContext";
import { useAuth } from "../../context/AuthContext";

export const FloatingHeader: React.FC = () => {
  const { isScrolled } = useJobContext();
  const { user } = useAuth();
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.from(headerRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // Logo entrance
      gsap.from(logoRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.05,
        ease: "power2.out",
      });

      // Actions entrance
      if (navActionsRef.current) {
        gsap.from(navActionsRef.current, {
          opacity: 0,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const dashboardRoute =
    user?.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";

  return (
    <div
      ref={headerWrapperRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 sm:pt-5 pointer-events-none"
    >
      <header
        ref={headerRef}
        className={`pointer-events-auto flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "w-[92%] max-w-5xl px-5 py-2.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white"
            : "w-[94%] max-w-6xl px-6 py-3.5 bg-transparent border border-transparent text-white"
        }`}
      >
        {/* Logo Section */}
        <div ref={logoRef} className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
            <span className="font-semibold tracking-tight text-lg sm:text-xl text-white">
              Job<span className="text-blue-400">Matrix</span>
            </span>
          </Link>
        </div>

        {/* Navigation Center Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-normal text-slate-300">
          <a
            href="#jobs"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            Explore jobs
          </a>
          <a
            href="#companies"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            Top companies
          </a>
          <a
            href="#pathways"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            Career pathways
          </a>
          <a
            href="#hire"
            className="hover:text-white transition-colors duration-150 py-1 flex items-center gap-2 group"
          >
            <span>For employers</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Hiring
            </span>
          </a>
        </nav>

        {/* Action Buttons: Logged In vs Logged Out */}
        <div ref={navActionsRef} className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              to={dashboardRoute}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] px-4 py-2 rounded-lg transition-all duration-200"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center text-xs sm:text-sm font-normal text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-950 bg-white hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default FloatingHeader;
