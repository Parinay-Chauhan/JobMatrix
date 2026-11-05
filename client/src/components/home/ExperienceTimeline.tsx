import React from "react";
import { ArrowRight, Layers } from "lucide-react";
import { useJobContext } from "../../context/JobContext";

interface PathwayTier {
  step: string;
  level: string;
  title: string;
  expValue: string;
  compensation: string;
  description: string;
}
  
const PATHWAYS: PathwayTier[] = [
  {
    step: "01",
    level: "0 – 1 yrs",
    title: "Entry-level & Internships",
    expValue: "entry-level",
    compensation: "₹6L – ₹14L / yr",
    description: "Junior software engineering, QA, and frontend roles with structured team mentorship.",
  },
  {
    step: "02",
    level: "2 – 5 yrs",
    title: "Mid-Level Specialists",
    expValue: "mid-level",
    compensation: "₹14L – ₹32L / yr",
    description: "Full-stack, backend, and cloud roles with autonomous feature ownership and API design.",
  },
  {
    step: "03",
    level: "5 – 8 yrs",
    title: "Senior Engineers & Leads",
    expValue: "senior-level",
    compensation: "₹32L – ₹55L / yr",
    description: "High-throughput system architecture, cross-team reliability, and technical leadership.",
  },
  {
    step: "04",
    level: "8+ yrs",
    title: "Staff & Engineering Leads",
    expValue: "senior-level",
    compensation: "₹55L+ / yr",
    description: "Organizational platform roadmaps, engineering excellence, and large-scale infrastructure.",
  },
];

export const ExperienceTimeline: React.FC = React.memo(() => {
  const { searchExperience, setSearchExperience } = useJobContext();

  const handleSelectTier = (expValue: string) => {
    setSearchExperience(expValue);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pathways" className="relative bg-slate-950 py-16 sm:py-24 border-t border-white/10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <Layers className="w-4 h-4" />
            <span>Career Pathways</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Roles mapped to your experience level
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-3 font-normal leading-relaxed">
            Explore verified software opportunities across seniority tiers with transparent compensation benchmarks.
          </p>
        </div>

        {/* Clean Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {PATHWAYS.map((tier) => {
            const isSelected = searchExperience.toLowerCase() === tier.expValue.toLowerCase();

            return (
              <div
                key={tier.step}
                className={`group relative rounded-2xl border p-7 sm:p-8 backdrop-blur-md flex flex-col justify-between transition-all duration-200 shadow-xl ${
                  isSelected
                    ? "bg-slate-900/90 border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.25)]"
                    : "bg-slate-900/50 border-white/10 hover:border-white/25 hover:bg-slate-900/80"
                }`}
              >
                <div>
                  {/* Single Clean Step Indicator & Level Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-bold text-blue-400 tracking-wider">
                      {tier.step}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-200">
                      {tier.level}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                    {tier.title}
                  </h3>

                  {/* Short, Airy Body Paragraph */}
                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                    {tier.description}
                  </p>
                </div>

                {/* Footer: Benchmark & Action */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Benchmark</span>
                    <span className="text-base font-bold text-white">
                      {tier.compensation}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTier(tier.expValue)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>View roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default ExperienceTimeline;
