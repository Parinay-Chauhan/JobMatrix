import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useJobContext } from "../../context/JobContext";

export const FloatingHeader: React.FC = () => {
  const { isScrolled } = useJobContext();
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navActionsRef = useRef<HTMLDivElement>(null);
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null);

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

      // Actions entrance
      if (navActionsRef.current) {
        gsap.from(navActionsRef.current, {
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

  return (
    <div
      ref={headerWrapperRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 sm:pt-5 pointer-events-none"
    >
      <header
        ref={headerRef}
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "w-[88%] max-w-4xl px-5 py-2.5 rounded-full bg-slate-950/60 backdrop-blur-xl backdrop-saturate-150 border border-emerald-500/20 shadow-2xl shadow-black/60 ring-1 ring-emerald-500/10 text-white"
            : "w-[92%] max-w-5xl px-6 py-3 bg-transparent border border-transparent text-white"
        }`}
      >
        {/* Logo Section */}
        <div ref={logoRef} className="flex items-center shrink-0">
          <Link to="/" className="flex items-center group">
            <span className="font-black tracking-tight text-xl sm:text-2xl text-white hover:opacity-90 transition-opacity">
              Job<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Matrix</span>
            </span>
          </Link>
        </div>

        {/* Navigation Center Links */}
        <nav className="hidden md:flex items-center space-x-7">
          <a
            href="#jobs"
            className="text-sm font-medium text-slate-300 hover:text-emerald-300 transition-colors relative py-1"
          >
            Explore Jobs
          </a>
          <a
            href="#companies"
            className="text-sm font-medium text-slate-300 hover:text-emerald-300 transition-colors relative py-1"
          >
            Top Companies
          </a>
          <a
            href="#hire"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 flex items-center gap-1.5 group"
          >
            <span className="group-hover:text-emerald-300 transition-colors">Hire Talent</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 group-hover:bg-emerald-500/25 transition-colors">
              Hiring
            </span>
          </a>
        </nav>

        {/* Action Button: Get Started */}
        <div ref={navActionsRef} className="flex items-center shrink-0">
          <Link
            ref={getStartedButtonRef}
            to="/register"
            className="inline-flex items-center justify-center font-bold text-sm text-white px-5 py-2.5 rounded-full whitespace-nowrap active:scale-95 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
              color: "#ffffff",
              display: "inline-flex",
            }}
            onMouseEnter={() => {
              gsap.to(getStartedButtonRef.current, {
                scale: 1.05,
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.6)",
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={() => {
              gsap.to(getStartedButtonRef.current, {
                scale: 1,
                boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
                duration: 0.2,
                ease: "power2.out",
              });
            }}
          >
            Get Started
          </Link>
        </div>
      </header>
    </div>
  );
};
