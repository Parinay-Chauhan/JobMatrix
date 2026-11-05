import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Layers,
  Code2,
  Database,
  Cpu,
  Clock,
  Sparkles,
} from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: "Zero ghost jobs",
      description:
        "Every listing on JobMatrix requires verified recruiter identities, active hiring budget, and mandatory compensation transparency. No expired postings kept alive to fabricate growth.",
    },
    {
      icon: <Code2 className="w-5 h-5 text-sky-400" />,
      title: "Deterministic ATS matching",
      description:
        "No recruitment black boxes. Receive immediate, actionable keyword gap analysis comparing your resume against verified job requirements with full transparency.",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: "Data sovereignty",
      description:
        "Candidate contact details and resumes are never sold to third-party ad networks or brokers. Your data is delivered strictly when you choose to apply.",
    },
    {
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      title: "Real-time socket telemetry",
      description:
        "Instant WebSocket updates notify applicants the moment their application is opened, shortlisted, or scheduled for technical review.",
    },
  ];

  const platformMetrics = [
    { value: "98.4%", label: "ATS match precision", desc: "Deterministic keyword verification" },
    { value: "< 24h", label: "Average response", desc: "Recruiter turnaround SLA" },
    { value: "100%", label: "Free for job seekers", desc: "Zero fees, transparent compensation" },
    { value: "0", label: "Unverified listings", desc: "Zero ghost jobs allowed" },
  ];

  const skillTaxonomy = [
    {
      category: "Frontend & UI Architecture",
      icon: <Code2 className="w-4 h-4 text-blue-400" />,
      skills: ["TypeScript", "React 19", "Next.js", "Tailwind CSS", "Vue.js", "WebAssembly", "GraphQL"],
    },
    {
      category: "Backend & Distributed Systems",
      icon: <Database className="w-4 h-4 text-sky-400" />,
      skills: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC"],
    },
    {
      category: "AI & Data Engineering Platforms",
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      skills: ["PyTorch", "LangChain", "Vector DBs", "RAG Pipelines", "Pandas", "Scikit-Learn"],
    },
  ];

  const experienceMilestones = [
    {
      step: "01",
      title: "ATS profile & diagnostics",
      subtitle: "Deterministic resume parsing",
      description:
        "Upload your resume to receive instantaneous keyword relevance scoring, missing skills alerts, and role alignment ratings.",
      badge: "Diagnostics",
    },
    {
      step: "02",
      title: "Verified role discovery",
      subtitle: "Guaranteed active hiring",
      description:
        "Explore opportunities backed by verified company budgets, explicit seniority tiers, and transparent market compensation bands.",
      badge: "Discovery",
    },
    {
      step: "03",
      title: "Real-time telemetry & review",
      subtitle: "Sub-24h turnaround SLA",
      description:
        "Track interview progress through live application status updates, direct recruiter chat, and automated pipeline notifications.",
      badge: "Telemetry",
    },
    {
      step: "04",
      title: "Offer & career trajectory",
      subtitle: "Transparent compensation",
      description:
        "Receive competitive offers with verified salary ranges, equity terms, and structured engineering career development roadmaps.",
      badge: "Placement",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Crisp Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Job<span className="text-blue-400">Matrix</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 rounded-lg border border-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24 space-y-16 sm:space-y-24">
        {/* Crisp Hero Section */}
        <div className="relative text-center max-w-3xl mx-auto pt-2">
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-blue-500/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified engineering hiring architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight leading-[1.08]">
            Fixing tech hiring with radical transparency
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed font-normal max-w-2xl mx-auto">
            JobMatrix was engineered to dismantle the noise of legacy job portals. We connect exceptional software talent with high-growth teams through deterministic ATS matching and verifiable opportunities.
          </p>
        </div>

        {/* Clean, Elegant Stats Section (Sans-Serif, Balanced text-3xl/4xl) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {platformMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md text-left transition-all duration-200 hover:border-white/20 hover:bg-slate-900/60"
            >
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {item.value}
              </div>
              <div className="mt-3 text-base font-bold text-slate-100 tracking-tight">
                {item.label}
              </div>
              <p className="mt-1.5 text-sm text-slate-400 font-normal leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Narrative / Context Feature Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-md shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>The problem statement</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
            The fundamental flaw in modern hiring platforms
          </h2>

          <div className="space-y-5 text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            <p>
              Applying for software roles in 2026 often feels like shouting into an automated void. Millions of developers spend hours crafting tailored resumes, only to encounter ghost job listings kept active to project artificial corporate growth, or black-box screening algorithms that reject qualified engineers based on arbitrary formatting quirks.
            </p>
            <p>
              Simultaneously, engineering leaders are overwhelmed by thousands of bot-generated resume submissions, slowing hiring down to a crawl and missing real talent.
            </p>
            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border-l-4 border-blue-500 text-slate-100 font-medium text-base leading-relaxed">
              JobMatrix was built as the antidote: an intelligent, developer-centric portal where both sides get verified signals, real-time milestone feedback, and honest compensation data.
            </div>
          </div>
        </div>

        {/* Modern Skill Tags & Supported Taxonomies */}
        <div className="space-y-8">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Skill taxonomy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Verified technical domains & modern skill tags
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 leading-relaxed font-normal">
              The JobMatrix ATS scoring engine natively parses and verifies engineering proficiency across modern software stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {skillTaxonomy.map((group, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-white/20 backdrop-blur-md space-y-4 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 text-base font-semibold text-white">
                  {group.icon}
                  <span>{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-200 font-medium hover:border-white/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified, Airy Milestone Cards (NO duplicate Milestone labels) */}
        <div className="space-y-8">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Candidate roadmap</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              The candidate experience roadmap
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 leading-relaxed font-normal">
              How engineers transition from initial resume diagnostics to verified offers on JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {experienceMilestones.map((m) => (
              <div
                key={m.step}
                className="group relative p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-white/20 hover:bg-slate-900/70 backdrop-blur-md flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  {/* Single Clean Step Indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-semibold text-blue-400 tracking-wider">
                      {m.step}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {m.title}
                  </h3>
                  <div className="text-xs text-blue-400/90 font-medium mt-1">
                    {m.subtitle}
                  </div>

                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                  <span>Verified step</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="space-y-8">
          <div className="flex flex-col items-start max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Core platform principles
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 leading-relaxed font-normal">
              The engineering and transparency standards that govern every feature on JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                    {val.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                    {val.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/60 to-slate-950/95 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-blue-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
              Ready to discover your next opportunity?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal max-w-xl mx-auto">
              Join thousands of engineers and verified recruiters matching with transparent compensation on JobMatrix today.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-95"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/candidate/find-jobs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-200"
              >
                <span>Browse verified roles</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default AboutUs;
