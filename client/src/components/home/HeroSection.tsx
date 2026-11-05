import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";
import { useJobContext } from "../../context/JobContext";

const TRENDING_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Node.js",
  "Go",
  "PostgreSQL",
  "Tailwind CSS",
  "AWS",
  "AI / ML",
];

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
  const heroSkillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (heroBadgeRef.current) {
        heroTl.from(heroBadgeRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.3,
        });
      }

      if (heroTitleRef.current) {
        heroTl.from(
          heroTitleRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.35,
          },
          "-=0.2"
        );
      }

      if (heroSubtitleRef.current) {
        heroTl.from(
          heroSubtitleRef.current,
          {
            y: 10,
            opacity: 0,
            duration: 0.3,
          },
          "-=0.2"
        );
      }

      if (heroSearchRef.current) {
        heroTl.from(
          heroSearchRef.current,
          {
            y: 15,
            opacity: 0,
            scale: 0.98,
            duration: 0.35,
          },
          "-=0.2"
        );
      }

      if (heroSkillsRef.current) {
        heroTl.from(
          heroSkillsRef.current,
          {
            y: 10,
            opacity: 0,
            duration: 0.3,
          },
          "-=0.15"
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

  const handleSkillClick = (skill: string) => {
    setSearchTitle(skill);
    handleSearchSubmit();
  };

  return (
    <div className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 flex flex-col justify-between overflow-hidden bg-slate-950 font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[340px] bg-blue-500/15 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Center Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center py-6 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto text-center w-full">
        {/* Top Pill Badge */}
        <div
          ref={heroBadgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Verified tech hiring network with real-time roles</span>
        </div>

        {/* Main Hero Headline */}
        <h1
          ref={heroTitleRef}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] max-w-3xl"
        >
          Find your next role or hire{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            exceptional talent
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={heroSubtitleRef}
          className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed"
        >
          Direct connection between ambitious engineers, designers, and high-growth teams. Transparent compensation, deterministic ATS matching, and verified openings.
        </p>

        {/* Responsive Search Bar: Linear / Vercel Dark Glass */}
        <div ref={heroSearchRef} className="w-full max-w-4xl mt-8 sm:mt-12">
          <div className="bg-slate-900/90 rounded-2xl p-2 sm:p-2.5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 transition-all duration-300 hover:border-white/20">
            {/* Input 1: Job Title / Skills */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 border-b sm:border-b-0 sm:border-r border-white/10 min-w-0">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Role, skill, or company..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm sm:text-base font-normal focus:outline-none"
              />
            </div>

            {/* Input 2: Location */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 border-b sm:border-b-0 sm:border-r border-white/10 min-w-0">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, Bengaluru)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm sm:text-base font-normal focus:outline-none"
              />
            </div>

            {/* Dropdown 3: Experience */}
            <div className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 min-w-0 sm:min-w-[190px] relative border-b sm:border-b-0 border-white/10">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
              <div className="relative flex-1">
                <select
                  value={searchExperience}
                  onChange={(e) => setSearchExperience(e.target.value)}
                  className="w-full bg-transparent text-white text-sm sm:text-base font-normal focus:outline-none appearance-none cursor-pointer pr-6 [&>option]:bg-slate-950 [&>option]:text-white"
                >
                  <option value="">All experience</option>
                  <option value="entry-level">Entry-level (0–2 yrs)</option>
                  <option value="mid-level">Mid-level (2–5 yrs)</option>
                  <option value="senior-level">Senior-level (5+ yrs)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="w-full sm:w-auto sm:ml-1 shrink-0 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] active:scale-95 cursor-pointer"
            >
              Search jobs
            </button>
          </div>
        </div>

        {/* Modern Skill Tags Row */}
        <div
          ref={heroSkillsRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl"
        >
          <span className="text-xs sm:text-sm font-medium text-slate-400 mr-1.5">Trending skills:</span>
          {TRENDING_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillClick(skill)}
              className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-200 hover:text-white hover:bg-white/[0.08] hover:border-blue-400/40 transition-all duration-150 cursor-pointer"
            >
              {skill}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
