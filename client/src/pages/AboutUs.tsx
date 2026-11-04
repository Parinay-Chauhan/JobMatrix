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
} from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: <Target className="w-4 h-4 text-blue-400" />,
      title: "Zero ghost jobs",
      description:
        "Every posting on JobMatrix requires verified recruiter credentials, active hiring budget, and transparent compensation bands.",
    },
    {
      icon: <Code2 className="w-4 h-4 text-sky-400" />,
      title: "Deterministic ATS matching",
      description:
        "No recruitment black boxes. Receive real-time, actionable keyword gap analysis comparing your resume against job requirements.",
    },
    {
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      title: "Data sovereignty",
      description:
        "Candidate contact details and resumes are never sold to data brokers. Information is shared only when you explicitly apply.",
    },
    {
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
      title: "Real-time telemetry",
      description:
        "Instant WebSocket updates notify applicants the moment their application is viewed, shortlisted, or scheduled for interview.",
    },
  ];

  const platformMetrics = [
    { value: "98.4%", label: "ATS match accuracy" },
    { value: "< 24 hrs", label: "Average recruiter response" },
    { value: "100%", label: "Free for job seekers" },
    { value: "0", label: "Unverified listings permitted" },
  ];

  const skillTaxonomy = [
    {
      category: "Frontend & UI engineering",
      icon: <Code2 className="w-3.5 h-3.5 text-blue-400" />,
      skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vue.js", "WebAssembly"],
    },
    {
      category: "Backend & systems",
      icon: <Database className="w-3.5 h-3.5 text-sky-400" />,
      skills: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL"],
    },
    {
      category: "AI & data platforms",
      icon: <Cpu className="w-3.5 h-3.5 text-indigo-400" />,
      skills: ["PyTorch", "LangChain", "Vector DBs", "RAG pipelines", "Pandas", "Scikit-Learn"],
    },
  ];

  const experienceMilestones = [
    {
      step: "01",
      period: "Step 1",
      title: "ATS profile & skill diagnostics",
      subtitle: "Deterministic resume parsing",
      description:
        "Upload your resume to receive instantaneous keyword relevance scoring, missing skills alerts, and role alignment ratings.",
      badge: "Diagnostics",
    },
    {
      step: "02",
      period: "Step 2",
      title: "Verified role discovery",
      subtitle: "No ghost postings",
      description:
        "Filter opportunities backed by active hiring budgets, verified recruiter identities, and transparent compensation bands.",
      badge: "Discovery",
    },
    {
      step: "03",
      period: "Step 3",
      title: "Real-time telemetry & review",
      subtitle: "Sub-24h turnaround",
      description:
        "Track review progress through live application status updates, interview invitations, and direct recruiter messages.",
      badge: "Telemetry",
    },
    {
      step: "04",
      period: "Step 4",
      title: "Offer & career trajectory",
      subtitle: "Market-rate compensation",
      description:
        "Receive transparent offers with verified salary ranges, equity terms, and structured career development roadmaps.",
      badge: "Placement",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Crisp Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              Job<span className="text-blue-400">Matrix</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 rounded-lg border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-20">
        {/* Hero Section */}
        <div className="relative text-center max-w-3xl mx-auto pt-4">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-24 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-normal mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Our mission and vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.12]">
            Fixing tech hiring with radical transparency
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            JobMatrix was engineered to dismantle the noise of legacy job boards. We connect exceptional software talent with high-growth teams through deterministic ATS matching and verifiable opportunities.
          </p>
        </div>

        {/* Impact Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {platformMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md text-center"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums">
                {item.value}
              </div>
              <div className="mt-1.5 text-xs text-slate-400 font-normal">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative / Context Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-white/[0.08] backdrop-blur-md space-y-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            The problem with legacy hiring platforms
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            <p>
              Applying for software roles in 2026 often feels like shouting into an automated void. Millions of developers spend hours crafting tailored resumes, only to encounter ghost job listings kept active to project artificial corporate growth, or black-box screening systems that reject qualified engineers based on arbitrary formatting quirks.
            </p>
            <p>
              Simultaneously, recruiters are overwhelmed by thousands of bot-generated resume submissions, slowing hiring down to a crawl.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border-l-2 border-blue-500 text-slate-200 text-sm font-medium">
              JobMatrix was built as the antidote: an intelligent, developer-centric portal where both sides get verified signals, real-time milestone feedback, and honest compensation data.
            </div>
          </div>
        </div>

        {/* Modern Skill Tags & Supported Taxonomies */}
        <div className="space-y-6">
          <div className="flex flex-col items-start max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-normal mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Skill taxonomy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Verified technical domains & modern skill tags
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              JobMatrix ATS scoring engine natively parses and verifies proficiency across modern software stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillTaxonomy.map((group, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  {group.icon}
                  <span>{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline Cards */}
        <div className="space-y-6">
          <div className="flex flex-col items-start max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-normal mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Candidate roadmap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              The JobMatrix candidate experience timeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How engineers transition from resume diagnostics to accepted offers on JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {experienceMilestones.map((m) => (
              <div
                key={m.step}
                className="group relative p-5 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-white/[0.16] backdrop-blur-md flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-slate-500">Milestone {m.step}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {m.title}
                  </h3>
                  <div className="text-xs text-blue-400/90 font-normal mt-0.5">
                    {m.subtitle}
                  </div>

                  <p className="mt-3 text-xs text-slate-400 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{m.period}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="space-y-6">
          <div className="flex flex-col items-start max-w-xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Core platform principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Foundational pillars that guide every feature we build into JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-white/[0.16] transition-all backdrop-blur-md space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    {val.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {val.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="relative p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-white/[0.08] backdrop-blur-md shadow-2xl overflow-hidden text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-24 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Ready to discover your next opportunity?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Join thousands of engineers and verified recruiters matching with transparent compensation on JobMatrix today.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-95"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/candidate/find-jobs"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-normal text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
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
