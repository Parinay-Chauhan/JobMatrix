import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Newspaper, Copy, Check, Mail } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Press: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const pressReleases = [
    {
      date: "October 24, 2026",
      tag: "Product Milestone",
      title: "JobMatrix Unveils Instant ATS Keyword Match Scoring to Defeat Black-Box Hiring",
      snippet:
        "JobMatrix launches a developer-first ATS optimizer allowing candidates to benchmark their resumes directly against recruiter keywords before submitting applications.",
    },
    {
      date: "August 12, 2026",
      tag: "Platform Growth",
      title: "JobMatrix Crosses 50,000 Verified Developer Applications with Strict Zero-Ghost-Job Policy",
      snippet:
        "By enforcing strict wage transparency and automated expiration of unfilled vacancies, JobMatrix achieves record application-to-interview conversion rates.",
    },
    {
      date: "June 05, 2026",
      tag: "Security Architecture",
      title: "Hardening Tech Recruitment: How JobMatrix Implemented Refresh Token Rotation and IDOR Defenses",
      snippet:
        "A deep dive into how JobMatrix eliminated candidate document IDOR vulnerabilities and instituted cryptographic session guards to protect confidential career records.",
    },
  ];

  const brandColors = [
    { name: "Deep Navy", hex: "#0F172A", role: "Primary Background & Structure" },
    { name: "Vibrant Blue", hex: "#2563EB", role: "Core Brand Accent & Authority" },
    { name: "Action Orange", hex: "#F97316", role: "High-Conversion CTA Accent" },
    { name: "Cyber Sky", hex: "#38BDF8", role: "Gradient Highlights & Telemetry" },
  ];

  const shortBoilerplate =
    "JobMatrix is a modern, transparent tech career platform engineered to eliminate ghost jobs and opaque applicant tracking systems. Through instant ATS keyword matching, real-time application telemetry, and strict wage transparency, JobMatrix connects top software engineers directly with verified recruiters.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Top Header */}
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
            <Newspaper className="w-3.5 h-3.5" />
            <span>Newsroom & Brand Assets</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            JobMatrix <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Press & Media Hub
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover our latest platform milestones, company announcements, brand guidelines, and official boilerplate assets for journalists and event hosts.
          </p>
        </div>

        {/* Press Releases Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recent Announcements
            </h2>
            <span className="text-xs font-semibold text-slate-500">Official Releases</span>
          </div>

          <div className="space-y-6">
            {pressReleases.map((pr, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {pr.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{pr.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
                  {pr.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pr.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Kit & Color Palette */}
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Brand Assets & Color System
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Approved color codes and typographic treatments for official representations of JobMatrix.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {brandColors.map((color, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <div
                  className="w-full h-12 rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{color.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-1">
                    <span>{color.hex}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(color.hex, idx + 10)}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Copy hex code"
                    >
                      {copiedIndex === idx + 10 ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{color.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Boilerplate Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">
                Official Company Boilerplate (50 Words)
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(shortBoilerplate, 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedIndex === 1 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              "{shortBoilerplate}"
            </p>
          </div>
        </div>

        {/* Media Contact Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Media & Press Inquiries
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Need quotes, leadership commentary, or high-resolution logos for a feature story?
            </p>
          </div>
          <a
            href="mailto:press@jobmatrix.dev"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>press@jobmatrix.dev</span>
          </a>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Press;
