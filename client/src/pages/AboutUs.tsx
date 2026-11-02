import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Target, Users, Shield, Zap, ChevronRight } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: "Zero Ghost Jobs",
      description: "Legacy portals leave expired or fake listings active for months. Every posting on JobMatrix is verified with active hiring budget and mandatory wage transparency.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      title: "Transparent ATS Matching",
      description: "No recruitment black boxes. Candidates receive instant, actionable ATS keyword match insights, identifying exactly where their resumes align or have skill gaps.",
    },
    {
      icon: <Shield className="w-5 h-5 text-orange-400" />,
      title: "Data Sovereignty",
      description: "Candidate resumes are never sold to third-party ad networks or brokers. Your contact details are shared only when you actively choose to apply.",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: "Real-Time Telemetry",
      description: "Real-time socket notifications let applicants track application reviews, recruiter shortlists, and decision updates as they happen.",
    },
  ];

  const platformMetrics = [
    { value: "98.4%", label: "ATS Match Accuracy" },
    { value: "< 48 hrs", label: "Average Recruiter Turnaround" },
    { value: "100%", label: "Fee-Free for Job Seekers" },
    { value: "0", label: "Unverified Listings Allowed" },
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

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Fixing Tech Hiring with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Radical Transparency
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            JobMatrix was engineered to dismantle the noise of legacy job boards. We connect exceptional software talent with high-growth teams through deterministic ATS matching and verifiable opportunities.
          </p>
        </div>

        {/* Impact Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {platformMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center"
            >
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="mt-1.5 text-xs text-slate-400 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 mb-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The Problem with Modern Hiring Platforms
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              Applying for software roles in 2026 feels like shouting into a void. Millions of developers spend hours crafting tailored resumes, only to encounter ghost job listings kept active to artificially project corporate growth, or black-box screening systems that reject qualified engineers based on arbitrary formatting quirks.
            </p>
            <p>
              On the flip side, recruiters are buried beneath thousands of irrelevant, bot-spammed applications generated by automated submission scripts.
            </p>
            <p className="text-slate-200 font-semibold border-l-2 border-orange-500 pl-4">
              JobMatrix was built as the antidote: an intelligent, developer-centric portal where both sides get verified signals, real-time milestone feedback, and honest compensation data.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our Core Principles
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              The foundational pillars that guide every feature we build into JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {val.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {val.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Discover Your Next Opportunity?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join thousands of engineers and verified recruiters matching on JobMatrix today.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/candidate/find-jobs"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>Browse Verified Roles</span>
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
