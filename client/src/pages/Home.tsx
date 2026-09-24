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

      // Actions staggered entrance
      if (navActionsRef.current?.children) {
        gsap.from(navActionsRef.current.children, {
          y: -12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.25,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleButtonHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: enter ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Dynamic Floating Pill Header */}
      <div
        ref={headerWrapperRef}
        className="sticky top-0 z-50 flex justify-center w-full"
      >
        <header
          ref={headerRef}
          className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "mt-2.5 w-[88%] max-w-4xl px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-xl shadow-indigo-950/10"
              : "mt-3 w-[92%] max-w-5xl px-6 py-3.5 rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-md shadow-slate-900/5"
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
              <span className="font-black tracking-tight text-gray-900 text-xl sm:text-2xl">
                Job<span className="text-indigo-600">Matrix</span>
              </span>
            </Link>
          </div>

          {/* Navigation Center Links */}
          <nav className="hidden md:flex items-center space-x-7">
            <a href="#jobs" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Browse Jobs
            </a>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              For Candidates
            </Link>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              For Recruiters
            </Link>
          </nav>

          {/* Action Button: Get Started */}
          <div ref={navActionsRef} className="flex items-center shrink-0">
            <a
              href="/register"
              onMouseEnter={(e) => handleButtonHover(e as unknown as React.MouseEvent<HTMLElement>, true)}
              onMouseLeave={(e) => handleButtonHover(e as unknown as React.MouseEvent<HTMLElement>, false)}
              className="inline-flex items-center justify-center font-semibold text-sm text-white px-5 py-2.5 rounded-full whitespace-nowrap transition-opacity duration-200 hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.5)",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Get Started
            </a>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Find Your Dream Job or Hire Top Talent
          </h1>
          <p className="text-indigo-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover thousands of career opportunities across tech, design, and
            management, or post job listings to connect with top candidates.
          </p>

          {/* Search Box */}
          <div className="bg-white p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2.5 text-gray-800 max-w-3xl mx-auto border border-white/20">
            <div className="flex-1 w-full flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
              <svg
                className="w-5 h-5 text-gray-400 mr-2 shrink-0"
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
                placeholder="Job title, keywords, or role"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="flex-1 w-full flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
              <svg
                className="w-5 h-5 text-gray-400 mr-2 shrink-0"
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
                placeholder="City, State, or Remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {}}
              className="w-full md:w-auto shrink-0"
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} JobMatrix. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
