import React from "react";
import { useJobContext } from "../../context/JobContext";

export const PopularSearches: React.FC = () => {
  const { handlePopularSearch } = useJobContext();

  const popularSearches = [
    {
      id: "freshers",
      rank: "#1 Trending",
      title: "Jobs for Freshers",
      query: "Fresher",
      tagline: "Entry Level & Internships",
      iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
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
      iconBg: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
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
      iconBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
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
      iconBg: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
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
      iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 border-t border-b border-slate-800/80 py-16 sm:py-20 w-full">
      {/* Ambient subtle glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trending Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Popular Searches on{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                JobMatrix
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-normal">
              Click any category to filter and explore active opportunities instantly.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>Live Database Updated Just Now</span>
          </div>
        </div>

        {/* Grid of 6 distinct Category Launcher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularSearches.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePopularSearch(item.query)}
              className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer backdrop-blur-md hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              {/* Glow accent in corner on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-full blur-xl transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${item.iconBg} shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-colors">
                    {item.rank}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {item.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  Explore roles
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-800/90 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
