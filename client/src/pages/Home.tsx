import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useJobsQuery } from "../hooks/queries";
import { JobCard, JobCardSkeleton, EmptyState, Button } from "../components/common";

export const Home: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchExperience, setSearchExperience] = useState("");
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
    });

    return () => ctx.revert();
  }, []);

  // Declarative TanStack Query for public jobs
  const { data: jobs = [], isLoading: loading } = useJobsQuery();

  const filteredJobs = jobs.filter((job) => {
    const query = searchTitle.toLowerCase().trim();
    const locQuery = searchLocation.toLowerCase().trim();
    const expQuery = searchExperience.toLowerCase().trim();

    let matchesTitle = true;
    if (query) {
      matchesTitle =
        Boolean(job.title?.toLowerCase().includes(query)) ||
        Boolean(job.description?.toLowerCase().includes(query)) ||
        Boolean(job.jobType?.toLowerCase().includes(query)) ||
        Boolean(job.workMode?.toLowerCase().includes(query)) ||
        Boolean(job.category?.toLowerCase().includes(query)) ||
        Boolean(job.experienceLevel?.toLowerCase().includes(query)) ||
        Boolean(job.requirements?.some((r) => r.toLowerCase().includes(query))) ||
        (typeof job.recruiter === "object" &&
          Boolean(job.recruiter?.companyName?.toLowerCase().includes(query)));
    }

    let matchesLocation = true;
    if (locQuery) {
      matchesLocation =
        Boolean(job.location?.toLowerCase().includes(locQuery)) ||
        Boolean(job.workMode?.toLowerCase().includes(locQuery));
    }

    let matchesExperience = true;
    if (expQuery) {
      matchesExperience = Boolean(job.experienceLevel?.toLowerCase().includes(expQuery));
    }

    return matchesTitle && matchesLocation && matchesExperience;
  });

  const handlePopularSearch = (query: string) => {
    setSearchTitle(query);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const popularSearches = [
    {
      id: "freshers",
      rank: "TRENDING AT #1",
      title: "Jobs for Freshers",
      query: "Fresher",
      tagline: "Entry Level & Internships",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100/80",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      id: "wfh",
      rank: "TRENDING AT #2",
      title: "Work from home Jobs",
      query: "Remote",
      tagline: "Remote & Hybrid Work",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/80",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "part-time",
      rank: "TRENDING AT #3",
      title: "Part time Jobs",
      query: "Part-time",
      tagline: "Flexible Shifts & Timings",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/80",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "women",
      rank: "TRENDING AT #4",
      title: "Jobs for Women",
      query: "Women",
      tagline: "Equal Opportunity Roles",
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100/80",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: "full-time",
      rank: "TRENDING AT #5",
      title: "Full time Jobs",
      query: "Full Time",
      tagline: "Engineering & Corporate",
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100/80",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const marqueeCompanies = [
    {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      name: "Microsoft",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#F25022" d="M1 1h10v10H1z" />
          <path fill="#00A4EF" d="M1 13h10v10H1z" />
          <path fill="#7FBA00" d="M13 1h10v10H13z" />
          <path fill="#FFB900" d="M13 13h10v10H13z" />
        </svg>
      ),
    },
    {
      name: "Amazon",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M13.9 14.6c-2.3 1.7-5.7 2.6-8.6 2.6-4.1 0-7.7-1.5-10.5-4-.2-.2 0-.5.3-.4 3.1 1.8 6.9 2.8 10.8 2.8 2.6 0 5.4-.6 7.8-1.8.4-.2.7.2.2.8zm1.2-1.3c-.3-.4-1.9-.2-2.6-.1-.2 0-.3-.2-.1-.3 1.3-.9 3.5-.6 3.8-.3.3.4-.1 2.5-1.3 3.5-.2.1-.3 0-.3-.1.2-.8.8-2.3.5-2.7z" />
        </svg>
      ),
    },
    {
      name: "Meta",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0081FB">
          <path d="M12 5.5c-3.1 0-5.3 2-6.5 3.9C4.3 11 3.5 13 3.5 14.5c0 2 1.4 3.5 3.4 3.5 2 0 3.6-1.5 5.1-3.6 1.5 2.1 3.1 3.6 5.1 3.6 2 0 3.4-1.5 3.4-3.5 0-1.5-.8-3.5-2-5.1-1.2-1.9-3.4-3.9-6.5-3.9zm-3.6 9.8c-1.1 0-1.9-.8-1.9-1.8 0-.9.6-2.2 1.5-3.6.9-1.3 2.1-2.6 4-2.6.2 0 .4 0 .6.1-2.4 3.4-3.5 6.4-4.2 7.9zm7.2 0c-.7-1.5-1.8-4.5-4.2-7.9.2-.1.4-.1.6-.1 1.9 0 3.1 1.3 4 2.6.9 1.4 1.5 2.7 1.5 3.6 0 1-.8 1.8-1.9 1.8z" />
        </svg>
      ),
    },
    {
      name: "Spotify",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1ED760">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.5 9.722 1.113.294.18.386.564.207.857zm1.226-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.52-.973 3.632-1.102 8.147-.568 11.233 1.328.366.226.481.707.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.016-.129-1.166-.623-.149-.495.13-1.016.624-1.167 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.28.326z" />
        </svg>
      ),
    },
    {
      name: "Netflix",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E50914">
          <path d="M5.398 0v24c1.865-.36 3.73-.78 5.594-1.258V0H5.398zm7.604 0v18.777l5.6 1.488V0h-5.6zm-2.01 0l5.618 19.34L11 18.06V0z" />
        </svg>
      ),
    },
    {
      name: "Stripe",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#635BFF">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.355 12.64.355 7.416.355 3.882 3.09 3.882 7.476c0 5.768 7.787 4.887 7.787 7.405 0 .98-.812 1.409-2.072 1.409-2.308 0-5.163-.997-6.953-2.023l-.936 5.674c1.944.975 4.966 1.649 8.084 1.649 5.435 0 9.065-2.614 9.065-7.146 0-6.104-7.881-4.898-7.881-7.295z" />
        </svg>
      ),
    },
    {
      name: "Uber",
      icon: (
        <div className="font-black text-xs text-white tracking-tighter">
          UBER
        </div>
      ),
    },
    {
      name: "Airbnb",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF5A5F">
          <path d="M12 0c-4.1 0-7.3 3.1-7.3 7.1 0 4.9 5.8 12.3 6.6 13.3.4.5 1 .5 1.4 0 .8-1 6.6-8.4 6.6-13.3C19.3 3.1 16.1 0 12 0zm0 10.5c-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4 3.4 1.5 3.4 3.4-1.5 3.4-3.4 3.4z" />
        </svg>
      ),
    },
    {
      name: "Adobe",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FA0F00">
          <path d="M13.96 0H24v24L13.96 0zM0 0h10.04L0 24V0zm11.98 10.37L16.29 24h-4.22l-1.95-4.87H7.31l4.67-8.76z" />
        </svg>
      ),
    },
    {
      name: "Razorpay",
      icon: (
        <div className="font-extrabold text-xs text-sky-400">
          R⚡
        </div>
      ),
    },
    {
      name: "Swiggy",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC8019">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
        </svg>
      ),
    },
    {
      name: "TCS",
      icon: (
        <div className="font-black text-xs text-indigo-400">
          TCS
        </div>
      ),
    },
    {
      name: "Infosys",
      icon: (
        <div className="font-bold text-xs text-blue-400">
          Infy
        </div>
      ),
    },
    {
      name: "Atlassian",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0052CC">
          <path d="M11.53 2c0 2.4-1.2 4.5-3.1 5.8-3.1 2.1-5 5.5-5 9.4 0 2.6.9 5 2.5 6.8H.7C.3 22.4 0 20.4 0 18.2c0-5 2.6-9.5 6.6-12.2 2.7-1.8 4.4-4.7 4.9-8h0zm.94 13.8c0-2.4 1.2-4.5 3.1-5.8 3.1-2.1 5-5.5 5-9.4 0-2.6-.9-5-2.5-6.8h5.2c.4 1.6.7 3.6.7 5.8 0 5-2.6 9.5-6.6 12.2-2.7 1.8-4.4 4.7-4.9 8h0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Fullscreen Hero Viewport (100vh Landing Screen) */}
      <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
        {/* Ambient Glows & Grid Pattern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-16 right-10 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />

        {/* Fixed Floating Header - Always visible on scroll with Frosted Glass Acrylic */}
        <div
          ref={headerWrapperRef}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 sm:pt-5 pointer-events-none"
        >
          <header
            ref={headerRef}
            className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "w-[88%] max-w-4xl px-5 py-2.5 rounded-full bg-slate-950/45 backdrop-blur-xl backdrop-saturate-150 border border-white/15 shadow-2xl shadow-black/60 ring-1 ring-white/5 text-white"
                : "w-[92%] max-w-5xl px-6 py-3 bg-transparent border border-transparent text-white"
            }`}
          >
            {/* Logo Section */}
            <div ref={logoRef} className="flex items-center shrink-0">
              <Link to="/" className="flex items-center group">
                <span className="font-black tracking-tight text-xl sm:text-2xl text-white hover:opacity-90 transition-opacity">
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
        <section className="relative z-10 flex-1 flex flex-col justify-center items-center py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center w-full">

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Over 10,000+ Verified Job Opportunities</span>
          </div>

          {/* Main Hero Headline */}
          <h1
            ref={heroTitleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-white"
          >
            Find Your Dream Job or{" "}
            <span ref={heroBadgeRef} className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Hire Top Talent
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={heroSubtitleRef}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4 mb-8"
          >
            Connect directly with high-growth companies and exceptional talent. Fast, modern, and transparent career matching powered by JobMatrix.
          </p>

          {/* Apna-style Pill Search Bar */}
          <div
            ref={heroSearchRef}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-full shadow-2xl shadow-indigo-950/50 flex items-center overflow-hidden border border-white/60 pr-2">
              {/* Skills / Title Field */}
              <div className="flex-1 flex items-center gap-2.5 px-5 py-4 border-r border-gray-200/80 min-w-0">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Skills, Company or Job Title"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const el = document.getElementById("jobs");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium min-w-0"
                />
              </div>

              {/* Location Field */}
              <div className="flex-1 flex items-center gap-2.5 px-5 py-4 border-r border-gray-200/80 min-w-0">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const el = document.getElementById("jobs");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium min-w-0"
                />
              </div>

              {/* Experience Dropdown */}
              <div className="flex items-center gap-2 px-4 py-4 border-r border-gray-200/80 shrink-0">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <select
                  value={searchExperience}
                  onChange={(e) => setSearchExperience(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm text-gray-700 font-medium pr-1 cursor-pointer appearance-none"
                >
                  <option value="">Experience</option>
                  <option value="entry">Entry Level (Fresher)</option>
                  <option value="mid">Mid Level (1-5 yrs)</option>
                  <option value="senior">Senior Level (5+ yrs)</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 shrink-0 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  const el = document.getElementById("jobs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="ml-1 shrink-0 px-7 py-3.5 rounded-full text-white text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-md shadow-violet-500/30"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}
              >
                Search
              </button>
          </div>
        </section>

        {/* Bottom Companies Logo Marquee Strip */}
        <section className="relative overflow-hidden bg-slate-950/80 border-t border-slate-800/60 pt-4 pb-6 sm:pt-5 sm:pb-7 w-full z-10 shrink-0">
          {/* Left & Right Gradient Overlays for Smooth Edge Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 mb-3 sm:mb-4 text-center">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400/90 flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
              <span>Top Companies Hiring & Where Our Candidates Work</span>
              <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-indigo-500/50" />
            </p>
          </div>

          {/* Marquee Infinite Scrolling Track (Clean Unboxed Logos) */}
          <div className="flex overflow-hidden select-none">
            <div className="animate-marquee flex items-center gap-10 sm:gap-16 shrink-0">
              {marqueeCompanies.concat(marqueeCompanies).map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex items-center gap-3 opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 group select-none py-1"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {company.icon}
                  </div>
                  <span className="text-base sm:text-lg font-extrabold text-slate-200 group-hover:text-white tracking-tight transition-colors">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Popular Searches Section (Below Fold on Scroll, Clean Human-Made Apna Design) */}
      <section className="bg-white border-b border-gray-200/70 py-14 sm:py-18 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {/* 1st Position: Section Title & Subtitle */}
            <div className="flex flex-col justify-center p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Popular Searches on{" "}
                <span className="text-indigo-600">JobMatrix</span>
              </h2>
              <p className="text-sm text-gray-600 mt-3.5 leading-relaxed font-normal">
                Explore in-demand roles, flexible shifts, and direct verified job openings.
              </p>
            </div>

            {/* Trending Cards #1 to #5 (Apna style human design) */}
            {popularSearches.map((item) => (
              <div
                key={item.id}
                onClick={() => handlePopularSearch(item.query)}
                className="group relative bg-white hover:bg-slate-50/80 border border-gray-200 hover:border-indigo-400/80 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[165px]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {item.rank}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mt-2 tracking-tight">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {item.tagline}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl ${item.iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
                    {item.icon}
                  </div>
                </div>

                <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-700 mt-6 pt-3 border-t border-gray-100">
                  <span>View all</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Testimonials Section - 3 Row Infinite Scrolling Marquee */}
      <section className="bg-slate-950 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Others Are Saying
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Real stories from people who've experienced the journey firsthand — their wins, growth, and transformations speak louder than we ever could.
          </p>
        </div>

        {(() => {
          const testimonials = [
            {
              initials: "RK",
              bg: "bg-orange-500",
              name: "Rishi Kant",
              role: "BBA Student",
              text: "Found my first internship through JobMatrix within 2 weeks of signing up. The listings are genuinely fresh and the apply process is super clean. Highly recommend to anyone just starting out.",
            },
            {
              initials: "CA",
              bg: "bg-red-500",
              name: "Chirag Arora",
              role: "Software Engineer at Bosch",
              text: "Got placed at Bosch through a listing I found here. The job descriptions were honest and detailed — no misleading salary ranges. Exactly what job seekers need.",
            },
            {
              initials: "AN",
              bg: "bg-teal-500",
              name: "Anshika Aggarwal",
              role: "1.5 YOE as MTS",
              text: "JobMatrix helped me land my first full-time role after college. The remote filters are really useful. I found a hybrid role that perfectly matched my expectations.",
            },
            {
              initials: "AT",
              bg: "bg-indigo-600",
              name: "Anuj Thakur",
              role: "Data Analyst at Scaler",
              text: "I was skeptical but after applying through JobMatrix I got 3 interview calls in a single week. The search actually works — no irrelevant junk showing up.",
            },
            {
              initials: "RS",
              bg: "bg-blue-600",
              name: "Rohan Kumar Sah",
              role: "Software Engineer",
              text: "Clean, fast, and straightforward. I love how you can filter by work mode instantly. Found a remote backend role that fit my skills exactly within days.",
            },
            {
              initials: "BB",
              bg: "bg-emerald-600",
              name: "Bhavya Bhalla",
              role: "Student",
              text: "As a fresher I was worried no one would respond. But JobMatrix actually showed me entry-level listings and I landed an internship at a startup within 10 days!",
            },
            {
              initials: "NJ",
              bg: "bg-violet-600",
              name: "Nidhi Juneja",
              role: "SDE Intern",
              text: "The part-time section is gold. I found a remote content writing gig that fits perfectly with my college schedule. Didn't have to scroll endlessly like other sites.",
            },
            {
              initials: "RA",
              bg: "bg-amber-600",
              name: "Raj Shrivastava",
              role: "Assistant System Engineer at TCS",
              text: "JobMatrix made my job switch incredibly smooth. Filters by experience level and location saved me hours. I got an offer from TCS within 3 weeks of active searching.",
            },
            {
              initials: "RH",
              bg: "bg-pink-600",
              name: "Rahul Verma",
              role: "Web Developer",
              text: "I've been on Naukri and LinkedIn but JobMatrix gave me better quality matches for my skills. The UI is honestly the best I've seen among Indian job portals.",
            },
            {
              initials: "PS",
              bg: "bg-cyan-600",
              name: "Priya Sharma",
              role: "UX Designer",
              text: "Found a women-friendly startup through the 'Jobs for Women' section. The company was exactly as described. No bait-and-switch on salary either. 10/10 experience.",
            },
            {
              initials: "MK",
              bg: "bg-rose-600",
              name: "Mohit Kumar",
              role: "DevOps Engineer",
              text: "Got a cloud engineer role at a funded startup in Pune. The description was accurate and the recruiter responded within 24 hours. That never happens on other platforms.",
            },
            {
              initials: "SR",
              bg: "bg-lime-600",
              name: "Sneha Rawat",
              role: "HR at Infosys",
              text: "We use JobMatrix to post openings and the quality of candidates is noticeably better. The talent pool is serious about job hunting — not just browsing.",
            },
            {
              initials: "VB",
              bg: "bg-purple-600",
              name: "Vikram Bansal",
              role: "Full Stack Developer",
              text: "Switched from a service company to a product startup using JobMatrix. The remote filter and tech stack search is incredibly precise. Super happy with my move.",
            },
            {
              initials: "DM",
              bg: "bg-orange-600",
              name: "Divya Mehta",
              role: "Marketing Manager",
              text: "Found a marketing lead role through JobMatrix in my city. The salary range shown was accurate to what was offered. Transparent and reliable — rare in job portals.",
            },
            {
              initials: "AJ",
              bg: "bg-sky-600",
              name: "Arjun Joshi",
              role: "Backend Engineer",
              text: "Three months after graduating I was worried. But JobMatrix had freshers-specific listings that actually responded. Got placed as a backend trainee. Best decision ever.",
            },
            {
              initials: "KR",
              bg: "bg-fuchsia-600",
              name: "Kavita Rao",
              role: "QA Engineer at Wipro",
              text: "Part-time remote QA role — something I thought was impossible to find. JobMatrix had exactly that. Now I work 4 hours a day from home and it's changed my life.",
            },
            {
              initials: "SM",
              bg: "bg-green-600",
              name: "Suresh Mishra",
              role: "Product Manager",
              text: "Used JobMatrix to hire for two product roles at our startup. The quality of applications was far better than what we got on LinkedIn for the same JD.",
            },
            {
              initials: "LK",
              bg: "bg-red-600",
              name: "Lalit Kumawat",
              role: "SDE-2 at Paytm",
              text: "Switched jobs twice through JobMatrix in 2 years. Both times the hiring process was smooth and the job exactly as described. My go-to platform now.",
            },
          ];

          const row1 = testimonials.slice(0, 6);
          const row2 = testimonials.slice(6, 12);
          const row3 = testimonials.slice(12, 18);

          const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
            <div className="shrink-0 w-[300px] sm:w-[320px] bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 cursor-default select-none transition-colors duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${t.bg}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-300 text-[13px] leading-relaxed line-clamp-4">{t.text}</p>
            </div>
          );

          return (
            <div className="space-y-4">
              {/* Row 1 — Right to Left */}
              <div className="flex overflow-hidden">
                <div className="animate-marquee flex items-stretch gap-4">
                  {[...row1, ...row1].map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
                </div>
              </div>

              {/* Row 2 — Left to Right */}
              <div className="flex overflow-hidden">
                <div className="animate-marquee-reverse flex items-stretch gap-4">
                  {[...row2, ...row2].map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
                </div>
              </div>

              {/* Row 3 — Right to Left (slow) */}
              <div className="flex overflow-hidden">
                <div className="animate-marquee-slow flex items-stretch gap-4">
                  {[...row3, ...row3].map((t, i) => <TestimonialCard key={`r3-${i}`} t={t} />)}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Recruiter CTA Section — "Want to Hire?" */}
      <section className="bg-gray-50 py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-center min-h-[220px]">

            {/* Left — Decorative Abstract Illustration */}
            <div className="hidden md:flex items-end justify-center w-[260px] shrink-0 self-stretch pl-10 pt-6 relative">
              {/* Abstract hiring illustration using SVG shapes */}
              <svg viewBox="0 0 220 200" className="w-full h-auto max-h-[200px] mt-auto" xmlns="http://www.w3.org/2000/svg">
                {/* Person 1 — taller, standing back */}
                <ellipse cx="75" cy="196" rx="30" ry="6" fill="#d1fae5" opacity="0.7"/>
                <rect x="55" y="100" width="40" height="90" rx="6" fill="#6366f1" opacity="0.9"/>
                <circle cx="75" cy="88" r="22" fill="#e0e7ff"/>
                <rect x="60" y="88" width="30" height="18" rx="4" fill="#6366f1" opacity="0.9"/>
                {/* Face details */}
                <circle cx="69" cy="85" r="2.5" fill="#6366f1"/>
                <circle cx="81" cy="85" r="2.5" fill="#6366f1"/>
                <path d="M70 93 Q75 97 80 93" stroke="#6366f1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Arms */}
                <rect x="35" y="110" width="20" height="8" rx="4" fill="#a5b4fc" transform="rotate(-15 45 114)"/>
                <rect x="95" y="112" width="20" height="8" rx="4" fill="#a5b4fc" transform="rotate(15 115 116)"/>

                {/* Person 2 — shorter, in front */}
                <ellipse cx="145" cy="196" rx="28" ry="5" fill="#d1fae5" opacity="0.7"/>
                <rect x="126" y="115" width="38" height="80" rx="6" fill="#10b981" opacity="0.95"/>
                <circle cx="145" cy="103" r="20" fill="#ecfdf5"/>
                <rect x="132" y="103" width="26" height="16" rx="4" fill="#10b981" opacity="0.9"/>
                <circle cx="139" cy="100" r="2" fill="#10b981"/>
                <circle cx="151" cy="100" r="2" fill="#10b981"/>
                <path d="M140 107 Q145 111 150 107" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Arms */}
                <rect x="106" y="124" width="20" height="7" rx="4" fill="#6ee7b7" transform="rotate(-10 116 127)"/>
                <rect x="163" y="126" width="20" height="7" rx="4" fill="#6ee7b7" transform="rotate(10 173 129)"/>

                {/* Floating briefcase icon */}
                <rect x="165" y="50" width="32" height="26" rx="5" fill="#6366f1" opacity="0.15"/>
                <rect x="172" y="45" width="18" height="9" rx="3" fill="none" stroke="#6366f1" strokeWidth="2"/>
                <rect x="165" y="50" width="32" height="26" rx="5" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.6"/>
                <line x1="181" y1="50" x2="181" y2="76" stroke="#6366f1" strokeWidth="1.5" opacity="0.4"/>

                {/* Floating star sparkles */}
                <circle cx="30" cy="50" r="3" fill="#fbbf24" opacity="0.8"/>
                <circle cx="50" cy="30" r="2" fill="#6366f1" opacity="0.5"/>
                <circle cx="200" cy="80" r="2.5" fill="#10b981" opacity="0.7"/>
                <circle cx="190" cy="35" r="4" fill="#f59e0b" opacity="0.5"/>
              </svg>
            </div>

            {/* Right — Text & CTA */}
            <div className="flex-1 flex flex-col items-start justify-center py-10 px-8 sm:px-10">
              {/* Badge */}
              <span className="inline-block text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full mb-4">
                JobMatrix for Employers
              </span>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Want to hire?
              </h2>

              {/* Subtext */}
              <p className="text-gray-600 text-sm sm:text-base mt-3 mb-6 max-w-sm leading-relaxed">
                Find the best candidate from{" "}
                <span className="font-semibold text-indigo-700">10,000+ active job seekers</span>{" "}
                — post your first job in under 2 minutes.
              </p>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap gap-5 mb-7 text-sm">
                <div>
                  <span className="font-extrabold text-gray-900 text-lg">10k+</span>
                  <span className="text-gray-500 ml-1.5">Active Candidates</span>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <span className="font-extrabold text-gray-900 text-lg">24h</span>
                  <span className="text-gray-500 ml-1.5">Avg. First Response</span>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <span className="font-extrabold text-gray-900 text-lg">Free</span>
                  <span className="text-gray-500 ml-1.5">to Post a Job</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-900 text-gray-900 text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-200 group"
                >
                  Post a Job
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/25"
                  style={{ background: "linear-gradient(135deg, #4f46e5 0%, #059669 100%)" }}
                >
                  Create Recruiter Account
                </Link>
              </div>
            </div>

            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-indigo-100/60 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-tr from-emerald-100/50 to-transparent rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} JobMatrix. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
