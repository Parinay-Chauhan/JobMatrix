import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useJobsQuery } from "../hooks/queries";
import { JobCard, JobCardSkeleton, EmptyState, Button } from "../components/common";

export const Home: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navActionsRef = useRef<HTMLDivElement>(null);
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const heroTagsRef = useRef<HTMLDivElement>(null);

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
        y: -40,
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

      // Actions entrance
      if (navActionsRef.current) {
        gsap.from(navActionsRef.current, {
          scale: 0.85,
          opacity: 0,
          duration: 0.6,
          delay: 0.25,
          ease: "back.out(1.5)",
        });
      }

      // Hero Elements Staggered Timeline Animation
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroBadgeRef.current) {
        heroTl.from(heroBadgeRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.6,
          delay: 0.1,
        });
      }

      if (heroTitleRef.current) {
        heroTl.from(
          heroTitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        );
      }

      if (heroSubtitleRef.current) {
        heroTl.from(
          heroSubtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        );
      }

      if (heroSearchRef.current) {
        heroTl.from(
          heroSearchRef.current,
          {
            y: 25,
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
            ease: "back.out(1.3)",
          },
          "-=0.35"
        );
      }

      if (heroTagsRef.current) {
        heroTl.from(
          heroTagsRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Declarative TanStack Query for public jobs
  const { data: jobs = [], isLoading: loading } = useJobsQuery();

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesLocation = job.location
      ?.toLowerCase()
      .includes(searchLocation.toLowerCase());
    return matchesTitle && matchesLocation;
  });

  const popularTags = ["Remote", "Full Stack", "React", "Frontend", "Backend", "Product Manager", "Node.js"];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Fullscreen Hero Viewport (100vh Landing Screen) */}
      <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
        {/* Ambient Glows & Grid Pattern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-16 right-10 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />

        {/* Dynamic Floating Pill Header */}
        <div
          ref={headerWrapperRef}
          className="sticky top-0 z-50 flex justify-center w-full shrink-0 pt-5 sm:pt-6"
        >
          <header
            ref={headerRef}
            className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "w-[88%] max-w-4xl px-5 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 shadow-xl shadow-indigo-950/20 text-white"
                : "w-[92%] max-w-5xl px-6 py-3 bg-transparent border border-transparent text-white"
            }`}
          >
            {/* Logo Section */}
            <div ref={logoRef} className="flex items-center space-x-2 shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                </div>
                <span className="font-black tracking-tight text-xl sm:text-2xl text-white">
                  Job<span className="text-indigo-400">Matrix</span>
                </span>
              </Link>
            </div>

            {/* Navigation Center Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#jobs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Browse Jobs
              </a>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                For Candidates
              </Link>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                For Recruiters
              </Link>
            </nav>

            {/* Action Button: Get Started */}
            <div ref={navActionsRef} className="flex items-center shrink-0">
              <Link
                ref={getStartedButtonRef}
                to="/register"
                className="inline-flex items-center justify-center font-bold text-sm text-white px-5 py-2.5 rounded-full whitespace-nowrap active:scale-95 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  display: "inline-flex",
                }}
                onMouseEnter={() => {
                  gsap.to(getStartedButtonRef.current, {
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(124, 58, 237, 0.7)",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                  gsap.to(getStartedButtonRef.current, {
                    scale: 1.03,
                    yoyo: true,
                    repeat: 1,
                    duration: 0.15,
                    ease: "power1.inOut",
                    delay: 0.3,
                  });
                }}
                onMouseLeave={() => {
                  gsap.to(getStartedButtonRef.current, {
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
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

        {/* Center Hero Content Section */}
        <section className="relative z-10 flex-1 flex flex-col justify-center items-center py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 w-full">
          {/* Top Pill Badge */}
          <div ref={heroBadgeRef} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Over 10,000+ Verified Job Opportunities</span>
          </div>

          {/* Main Hero Headline */}
          <h1
            ref={heroTitleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-white"
          >
            Find Your Dream Job or{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Hire Top Talent
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={heroSubtitleRef}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Connect directly with high-growth companies and exceptional talent. Fast, modern, and transparent career matching powered by JobMatrix.
          </p>

          {/* Floating Glassmorphic Search Box */}
          <div
            ref={heroSearchRef}
            className="bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-indigo-950/60 flex flex-col md:flex-row items-center gap-2.5 text-gray-800 max-w-3xl w-full mx-auto border border-white/40"
          >
            <div className="flex-1 w-full flex items-center px-3.5 py-2.5 bg-gray-50/90 rounded-xl border border-gray-200/60 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <svg
                className="w-5 h-5 text-indigo-500 mr-2.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or role..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="flex-1 w-full flex items-center px-3.5 py-2.5 bg-gray-50/90 rounded-xl border border-gray-200/60 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <svg
                className="w-5 h-5 text-indigo-500 mr-2.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="City, State, or Remote..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {}}
              className="w-full md:w-auto shrink-0 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all px-6 py-2.5 font-bold"
            >
              Search Jobs
            </Button>
          </div>

          {/* Popular Search Tags */}
          <div ref={heroTagsRef} className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="font-semibold text-slate-300 mr-1">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTitle(tag)}
                className="px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-indigo-600/40 border border-slate-700/80 hover:border-indigo-400 text-slate-200 hover:text-white font-medium transition-all cursor-pointer backdrop-blur-sm shadow-xs active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Hero Bottom Spacing buffer */}
        <div className="h-8 sm:h-12 w-full shrink-0" />
      </div>

      {/* Main Content Area (Job Openings in clean light theme below fold) */}
      <div id="jobs" className="bg-gray-50 flex-1 w-full border-t border-gray-200/80">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Latest Job Openings
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Explore available opportunities posted by top companies
              </p>
            </div>

            <Link
              to="/register"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
            >
              Post a Job &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your search terms or location filters."
              actionText="Clear Search"
              onAction={() => {
                setSearchTitle("");
                setSearchLocation("");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  actionText="Apply Now"
                  onAction={() => navigate("/login")}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} JobMatrix. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
