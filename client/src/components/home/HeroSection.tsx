import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useJobContext } from "../../context/JobContext";

export const HeroSection: React.FC = () => {
  const {
    searchTitle,
    setSearchTitle,
    searchLocation,
    setSearchLocation,
    searchExperience,
    setSearchExperience,
  } = useJobContext();

  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  const handleSearchSubmit = () => {
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-16 right-10 w-96 h-96 bg-teal-500/10 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      {/* Center Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto text-center w-full">
        {/* Top Pill Badge */}
        <div
          ref={heroBadgeRef}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm mb-5"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Over 10,000+ Verified Job Opportunities</span>
        </div>

        {/* Main Hero Headline */}
        <h1
          ref={heroTitleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl"
        >
          Find Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Dream Job
          </span>{" "}
          or Hire Top Talent
        </h1>

        {/* Subtitle */}
        <p
          ref={heroSubtitleRef}
          className="mt-6 text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed"
        >
          Connect directly with high-growth companies and exceptional talent. Fast, modern, and transparent career matching powered by JobMatrix.
        </p>

        {/* Apna-Style Pill Search Bar */}
        <div ref={heroSearchRef} className="w-full max-w-4xl mt-10">
          <div className="bg-white rounded-full p-2 pl-3 shadow-2xl shadow-black/40 border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 transition-all duration-300 hover:shadow-emerald-500/15">
            {/* Input 1: Job Title / Skills */}
            <div className="flex-1 flex items-center gap-3 px-5 py-4 border-r border-gray-200/80 min-w-0">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Job title, skills, or company"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Input 2: Location */}
            <div className="flex-1 flex items-center gap-3 px-5 py-4 border-r border-gray-200/80 min-w-0">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Location (e.g. Remote, Bengaluru)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Dropdown 3: Experience */}
            <div className="flex items-center gap-2 px-4 py-4 min-w-[170px] relative">
              <svg className="w-5 h-5 text-gray-400 shrink-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="relative flex-1">
                <select
                  value={searchExperience}
                  onChange={(e) => setSearchExperience(e.target.value)}
                  className="w-full bg-transparent text-gray-800 text-sm font-medium focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="" className="text-gray-500">Experience</option>
                  <option value="entry-level">Fresher</option>
                  <option value="mid-level">Mid (1-5 yrs)</option>
                  <option value="senior-level">Senior (5+ yrs)</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Button with Emerald/Teal Gradient */}
            <button
              onClick={handleSearchSubmit}
              className="ml-1 shrink-0 px-8 py-3.5 rounded-full text-white text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-500/30"
              style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}
            >
              Search
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
