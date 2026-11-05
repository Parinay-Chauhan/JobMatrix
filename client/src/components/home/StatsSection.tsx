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
    <section className="relative bg-slate-950 border-t border-white/10 py-14 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-slate-900/80 text-left shadow-lg"
            >
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mt-3 text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                {stat.label}
              </div>
              <p className="mt-1.5 text-sm text-slate-400 font-normal leading-relaxed">
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
