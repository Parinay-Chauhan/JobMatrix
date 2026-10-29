import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, CheckCircle2, FileText, Target, DollarSign, Laptop, Sparkles, ChevronRight } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const CareerGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const chapters = [
    {
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      title: "1. Engineering an ATS-Compliant Resume",
      tag: "Resume Optimization",
      description: "Modern ATS platforms parse resumes using structural tokens and keyword weights. A poorly formatted two-column template will get rejected before human eyes ever see it.",
      keyTakeaways: [
        "Stick to single-column, cleanly parsed layouts (Standard sans-serif font, no complex tables or graphic overlays).",
        "Adopt the Google X-Y-Z formula for bullets: 'Accomplished [X] as measured by [Y], by doing [Z]'.",
        "Ensure your hard skills match the job description's exact terminology (e.g., 'TypeScript' instead of simply 'JavaScript').",
        "Include active repository, production system metrics, and deployment links for live verification.",
      ],
    },
    {
      icon: <Target className="w-5 h-5 text-sky-400" />,
      title: "2. Cracking Modern Technical & System Design Interviews",
      tag: "Interview Prep",
      description: "Passing technical interviews is a repeatable skill. Top startups in 2026 evaluate pragmatic architecture, trade-off analysis, and production judgment over esoteric trivia.",
      keyTakeaways: [
        "System Design: Lead with traffic assumptions (RPS, read/write ratios) before picking databases or message brokers.",
        "Articulate trade-offs: Explain why you chose PostgreSQL over MongoDB or Redis caching vs in-memory caching.",
        "Live Coding: Clarify boundary conditions, explain your thought process aloud, and write clean, modular test cases.",
        "Behavioral (STAR Method): Prepare 4-5 deep engineering stories detailing active production incidents, technical disagreements, and cross-functional leadership.",
      ],
    },
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      title: "3. Salary Benchmarking & Offer Negotiation",
      tag: "Compensation",
      description: "Never accept an offer without benchmarking market percentiles. Total compensation (TC) is a bundle of base pay, equity upside, and signing bonuses.",
      keyTakeaways: [
        "Evaluate equity smartly: Understand the difference between RSUs at liquid companies vs ISO/NSO stock options at early-stage startups.",
        "Always negotiate in total compensation terms: If a startup's base salary is capped, negotiate signing bonuses, equity refreshers, or accelerated review milestones.",
        "Get competing offers into play: Having multiple concurrent final-round processes increases your negotiation leverage by over 25%.",
        "Maintain high professional warmth: Express excitement for the team while calmly asserting your market value.",
      ],
    },
    {
      icon: <Laptop className="w-5 h-5 text-orange-400" />,
      title: "4. Excelling in Remote-First Engineering Teams",
      tag: "Career Progression",
      description: "Promotions in distributed teams are won through clear writing, autonomous execution, and proactive architectural documentation.",
      keyTakeaways: [
        "Master the written RFC: Write clear Request for Comments proposals that build engineering consensus without endless meetings.",
        "Over-communicate asynchronously: Post structured daily progress snippets and call out blockers early in team channels.",
        "Be dependable on reviews: Provide thoughtful, constructive pull request reviews within 4 hours to keep team velocity high.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex items-end gap-1 h-5 py-0.5">
              <span className="w-1 h-3 bg-blue-500 rounded-full" />
              <span className="w-1 h-4.5 bg-sky-400 rounded-full" />
              <span className="w-1 h-2 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
              Job<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">Matrix</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>The Developer Career Playbook</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Software Engineer's Guide to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              High-Growth Careers
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Battle-tested strategies for crafting ATS-optimized resumes, dominating technical system design rounds, and negotiating top-percentile compensation packages.
          </p>
        </div>

        {/* Chapters Stack */}
        <div className="space-y-10 mb-20">
          {chapters.map((ch, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {ch.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {ch.title}
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {ch.tag}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {ch.description}
              </p>

              <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Actionable Best Practices:</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {ch.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive ATS Optimizer Promo */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test Your Resume Against Recruiter ATS Keywords
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Don't guess how applicant tracking algorithms score your profile. Upload your resume or paste job requirements to get instant match analytics.
            </p>
            <div className="pt-2">
              <Link
                to="/candidate/resume-optimizer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Launch Free ATS Analyzer</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default CareerGuide;
