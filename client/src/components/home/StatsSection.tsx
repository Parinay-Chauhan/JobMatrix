import React from "react";

interface StatItem {
  value: string;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    value: "10,000+",
    label: "Verified listings",
    description: "Active engineering & design opportunities",
  },
  {
    value: "98.4%",
    label: "ATS precision",
    description: "Deterministic keyword match scoring",
  },
  {
    value: "< 24h",
    label: "Response turnaround",
    description: "Average recruiter response SLA",
  },
  {
    value: "100%",
    label: "Free for candidates",
    description: "Zero fees, transparent compensation",
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="relative bg-slate-950 border-t border-white/[0.08] py-10 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-slate-900/70 text-left"
            >
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white whitespace-nowrap">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-200 tracking-tight">
                {stat.label}
              </div>
              <p className="mt-1 text-xs text-slate-400 font-normal leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
