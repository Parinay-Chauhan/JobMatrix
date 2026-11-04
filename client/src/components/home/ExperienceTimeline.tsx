import React from "react";
import { ArrowRight, Layers, TrendingUp } from "lucide-react";
import { useJobContext } from "../../context/JobContext";

interface PathwayTier {
  step: string;
  level: string;
  title: string;
  expValue: string;
  compensation: string;
  roles: string;
  skills: string[];
  description: string;
}

const PATHWAYS: PathwayTier[] = [
  {
    step: "01",
    level: "0 – 1 years",
    title: "Entry-level & trainees",
    expValue: "entry-level",
    compensation: "₹6L – ₹14L",
    roles: "Junior SDE, frontend intern, QA associate",
    skills: ["TypeScript", "React", "Python", "Git basics"],
    description: "Ideal for fresh graduates and early career engineers seeking strong team mentorship.",
  },
  {
    step: "02",
    level: "2 – 5 years",
    title: "Mid-level specialists",
    expValue: "mid-level",
    compensation: "₹14L – ₹32L",
    roles: "Full-stack engineer, backend developer, DevOps engineer",
    skills: ["Node.js", "PostgreSQL", "Docker", "REST APIs"],
    description: "Independent feature ownership, API design, and scalable production architecture.",
  },
  {
    step: "03",
    level: "5 – 8 years",
    title: "Senior engineers & leads",
    expValue: "senior-level",
    compensation: "₹32L – ₹55L",
    roles: "Senior SDE, tech lead, systems architect",
    skills: ["System design", "Kubernetes", "Microservices", "CI/CD"],
    description: "Driving architectural decisions, system performance, and technical mentorship.",
  },
  {
    step: "04",
    level: "8+ years",
    title: "Staff & leadership",
    expValue: "senior-level",
    compensation: "₹55L+",
    roles: "Staff engineer, engineering manager, director",
    skills: ["Engineering strategy", "Platform scale", "Team leadership"],
    description: "High-leverage platform roadmap, engineering organization culture, and hiring bar.",
  },
];

export const ExperienceTimeline: React.FC = () => {
  const { searchExperience, setSearchExperience } = useJobContext();

  const handleSelectTier = (expValue: string) => {
    setSearchExperience(expValue);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pathways" className="relative bg-slate-950 py-16 sm:py-20 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-normal mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Career pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Roles mapped to your experience timeline
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Filter verified opportunities by career seniority with transparent compensation benchmarks.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {PATHWAYS.map((tier) => {
            const isSelected = searchExperience.toLowerCase() === tier.expValue.toLowerCase();

            return (
              <div
                key={tier.step}
                className={`group relative rounded-2xl border p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? "bg-slate-900/90 border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.2)]"
                    : "bg-slate-900/60 border-white/[0.08] hover:border-white/[0.16] hover:bg-slate-900/80"
                }`}
              >
                <div>
                  {/* Step & Timeline Node */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-slate-500">Tier {tier.step}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 tabular-nums">
                      {tier.level}
                    </span>
                  </div>

                  {/* Title & Roles */}
                  <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tier.roles}</p>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tier.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Benchmark & Action */}
                <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">Typical benchmark</span>
                    <span className="text-sm font-semibold text-white font-mono tabular-nums flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{tier.compensation}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTier(tier.expValue)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>View roles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
