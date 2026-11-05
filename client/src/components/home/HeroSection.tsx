import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { Search, MapPin, Briefcase, ChevronDown, Sparkles, Building2, X, ArrowUpRight } from "lucide-react";
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

const CURATED_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "DevOps Engineer",
  "Cloud Architect",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "QA Automation Engineer",
  "System Architect",
];

const CURATED_SKILLS = [
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
  "Docker",
  "Kubernetes",
  "GraphQL",
  "MongoDB",
  "Redis",
  "Java",
  "Rust",
  "C++",
  "Figma",
  "System Design",
  "SQL",
  "Git",
];

interface SuggestionItem {
  id: string;
  label: string;
  type: "role" | "skill" | "company";
}

export const HeroSection: React.FC = React.memo(() => {
  const {
    searchTitle,
    setSearchTitle,
    searchLocation,
    setSearchLocation,
    searchExperience,
    setSearchExperience,
    jobs,
  } = useJobContext();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const heroSkillsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP Entrance Animations
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

  // Aggregated suggestions pool from curated lists and real backend jobs
  const allSuggestions = useMemo<SuggestionItem[]>(() => {
    const roleSet = new Set<string>(CURATED_ROLES);
    const skillSet = new Set<string>(CURATED_SKILLS);
    const companySet = new Set<string>();

    if (Array.isArray(jobs)) {
      jobs.forEach((job) => {
        if (job.title) {
          const cleanTitle = job.title.replace(/\s*\d{10,}\s*$/, "").trim();
          if (cleanTitle) roleSet.add(cleanTitle);
        }
        if (Array.isArray(job.requirements)) {
          job.requirements.forEach((req) => {
            if (typeof req === "string" && req.trim().length > 1 && req.trim().length < 32) {
              skillSet.add(req.trim());
            }
          });
        }
        if (job.companyName && typeof job.companyName === "string") {
          companySet.add(job.companyName.trim());
        } else if (typeof job.recruiter === "object" && job.recruiter?.companyName) {
          companySet.add(job.recruiter.companyName.trim());
        }
      });
    }

    return [
      ...Array.from(roleSet).map((label) => ({ id: `role-${label}`, label, type: "role" as const })),
      ...Array.from(skillSet).map((label) => ({ id: `skill-${label}`, label, type: "skill" as const })),
      ...Array.from(companySet).map((label) => ({ id: `company-${label}`, label, type: "company" as const })),
    ];
  }, [jobs]);

  // Filtered suggestions matching user query
  const query = searchTitle.trim().toLowerCase();

  const matchedSuggestions = useMemo<SuggestionItem[]>(() => {
    if (!query) return [];

    const rank = (label: string) => {
      const l = label.toLowerCase();
      if (l === query) return 0;
      if (l.startsWith(query)) return 1;
      return 2;
    };

    const matches = allSuggestions.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    matches.sort((a, b) => rank(a.label) - rank(b.label));

    // Balanced split: top 4 roles, top 4 skills, top 2 companies
    const roles = matches.filter((m) => m.type === "role").slice(0, 4);
    const skills = matches.filter((m) => m.type === "skill").slice(0, 4);
    const companies = matches.filter((m) => m.type === "company").slice(0, 2);

    return [...roles, ...skills, ...companies];
  }, [allSuggestions, query]);

  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectSuggestion = (val: string) => {
    setSearchTitle(val);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || matchedSuggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < matchedSuggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : matchedSuggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < matchedSuggestions.length) {
        handleSelectSuggestion(matchedSuggestions[selectedIndex].label);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + q.length);
    const after = text.substring(idx + q.length);
    return (
      <>
        {before}
        <span className="text-blue-400 font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="relative min-h-[96vh] lg:min-h-screen pt-28 sm:pt-36 pb-16 sm:pb-24 flex flex-col justify-center items-center overflow-hidden bg-slate-950 font-sans">
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
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.18] max-w-3xl"
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
        <div ref={heroSearchRef} className="w-full max-w-4xl mt-12 sm:mt-16 md:mt-20">
          <div className="relative bg-slate-900/90 rounded-2xl p-2 sm:p-2.5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 transition-all duration-300 hover:border-white/20">
            {/* Input 1: Job Title / Skills with Live Autocomplete */}
            <div
              ref={searchContainerRef}
              className="relative flex-1 flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 border-b sm:border-b-0 sm:border-r border-white/10 min-w-0"
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Role, skill, or company..."
                value={searchTitle}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                  setShowSuggestions(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => {
                  if (searchTitle.trim().length > 0) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm sm:text-base font-normal focus:outline-none"
              />
              {searchTitle && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTitle("");
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }}
                  className="text-slate-500 hover:text-white p-1 rounded-md transition-colors shrink-0"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Floating Suggestions Dropdown */}
              {showSuggestions && query.length > 0 && (
                <div className="absolute top-[calc(100%+10px)] left-0 w-full sm:w-[380px] md:w-[420px] max-h-[380px] overflow-y-auto bg-[#121214] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 p-2 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  {matchedSuggestions.length === 0 ? (
                    <div className="px-4 py-5 text-center text-xs text-slate-400">
                      No matching roles, skills, or companies for &ldquo;
                      <span className="text-white font-medium">{searchTitle}</span>&rdquo;
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Suggested Matches</span>
                        <span>{matchedSuggestions.length} found</span>
                      </div>
                      {matchedSuggestions.map((item, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(item.label)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? "bg-blue-600/20 text-white border border-blue-500/35"
                                : "text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  item.type === "role"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : item.type === "skill"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-purple-500/10 text-purple-400"
                                }`}
                              >
                                {item.type === "role" && <Briefcase className="w-3.5 h-3.5" />}
                                {item.type === "skill" && <Sparkles className="w-3.5 h-3.5" />}
                                {item.type === "company" && <Building2 className="w-3.5 h-3.5" />}
                              </div>
                              <span className="truncate">{highlightMatch(item.label, query)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  item.type === "role"
                                    ? "bg-blue-500/10 text-blue-300"
                                    : item.type === "skill"
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-purple-500/10 text-purple-300"
                                }`}
                              >
                                {item.type === "role" ? "Role" : item.type === "skill" ? "Skill" : "Company"}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            </div>
                          </button>
                        );
                      })}
                      <div className="pt-2 px-3 pb-1 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↑</kbd>{" "}
                          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↓</kbd> navigate
                        </span>
                        <span>
                          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↵</kbd> select
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 mr-0.5 select-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Trending:</span>
          </div>
          {TRENDING_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSelectSuggestion(skill)}
              className="group inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(37,99,235,0.2)] active:scale-95 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-400 transition-colors" />
              <span>{skill}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
});

export default HeroSection;
