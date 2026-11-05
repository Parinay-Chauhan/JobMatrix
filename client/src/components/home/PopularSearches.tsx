import React from "react";
import { useJobContext } from "../../context/JobContext";

interface CategoryItem {
  id: string;
  rank: string;
  title: string;
  query: string;
  tagline: string;
  glowColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "freshers",
    rank: "#1 Trending",
    title: "Jobs for Freshers",
    query: "Fresher",
    tagline: "Entry Level & Internships",
    glowColor: "37, 99, 235",
    iconBg: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: "wfh",
    rank: "#2 Trending",
    title: "Work from Home",
    query: "Remote",
    tagline: "Remote & Hybrid Work",
    glowColor: "14, 165, 233",
    iconBg: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "part-time",
    rank: "#3 Trending",
    title: "Part-time Jobs",
    query: "Part-time",
    tagline: "Flexible Shifts & Timings",
    glowColor: "37, 99, 235",
    iconBg: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "women",
    rank: "#4 Trending",
    title: "Jobs for Women",
    query: "Women",
    tagline: "Equal Opportunity Roles",
    glowColor: "244, 63, 94",
    iconBg: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "full-time",
    rank: "#5 Trending",
    title: "Full-time Careers",
    query: "Full Time",
    tagline: "Engineering & Corporate",
    glowColor: "99, 102, 241",
    iconBg: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "tech",
    rank: "#6 Trending",
    title: "Tech & Startups",
    query: "Developer",
    tagline: "Software, Design & Product",
    glowColor: "37, 99, 235",
    iconBg: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

export const PopularSearches: React.FC = React.memo(() => {
  const { handlePopularSearch } = useJobContext();

  return (
    <section className="relative overflow-hidden bg-slate-950 border-t border-b border-white/[0.08] py-14 sm:py-20 w-full font-sans">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Trending Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Popular Searches on{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                JobMatrix
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-normal">
              Click any category to filter and explore active opportunities instantly.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Live Database Updated Just Now</span>
          </div>
        </div>

        {/* High-Performance Hardware-Accelerated Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10">
          {CATEGORIES.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePopularSearch(item.query)}
              className="group relative flex flex-col justify-between min-h-[200px] rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-blue-500/40 p-6 sm:p-7 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`p-3 rounded-xl ${item.iconBg} shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/10 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-colors shadow-sm">
                    {item.rank}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {item.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/[0.08]">
                <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                  Explore roles
                </span>
                <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-blue-600 border border-white/10 group-hover:border-blue-500 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-200 shadow-sm">
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default PopularSearches;
