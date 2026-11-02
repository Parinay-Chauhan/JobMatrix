import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Sliders, Info, Cpu, CheckCircle } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const CookiePolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "October 2026";

  const cookieCategories = [
    {
      name: "Essential & Security Cookies",
      badge: "Strictly Necessary",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      description:
        "These cookies and secure storage tokens are critical for you to navigate JobMatrix and access authenticated services. They cannot be switched off in our systems.",
      examples: [
        { key: "accessToken / refreshToken", purpose: "Maintains your secure logged-in session with cryptographic rotation and IDOR protection." },
        { key: "csrf_token", purpose: "Guards against Cross-Site Request Forgery attacks during job application submissions." },
        { key: "auth_role", purpose: "Determines candidate vs recruiter access privileges for dashboard routing." },
      ],
    },
    {
      name: "Functional & Preference Cookies",
      badge: "Enhances Experience",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      description:
        "These cookies enable enhanced personalization and remember choices you make across sessions to save you time.",
      examples: [
        { key: "job_search_filters", purpose: "Remembers your preferred job categories, locations (WFH/Hybrid), and experience levels." },
        { key: "ats_analyzer_cache", purpose: "Temporarily preserves your last parsed resume keywords during session comparisons." },
        { key: "portal_theme", purpose: "Saves high-contrast dark mode display preferences across browser tabs." },
      ],
    },
    {
      name: "Performance & Analytics Storage",
      badge: "Optional / Aggregated",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      description:
        "Helps us measure site traffic, identify slow API queries, and optimize the overall hiring funnel through fully anonymized usage patterns.",
      examples: [
        { key: "_jm_perf", purpose: "Measures query round-trip times and job listing rendering speeds." },
        { key: "_jm_funnel", purpose: "Calculates aggregated application completion rates to detect user drop-off points." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navbar */}
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Banner */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Cookie className="w-3.5 h-3.5" />
            <span>Transparent Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Cookie Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Understand how JobMatrix uses cookies and browser storage technologies to keep your account safe, remember search preferences, and speed up job applications.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Effective Date: {lastUpdated} • Version 2.0
          </div>
        </div>

        {/* Intro Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 mb-10 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                What Are Cookies & Local Storage?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cookies are small data files stored directly on your computer or mobile device by websites you visit. At JobMatrix, we use secure HTTP-only cookies and local browser storage to verify user sessions, prevent unauthorized token reuse, and streamline your job-seeking workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Categories of Cookies */}
        <div className="space-y-8 mb-12">
          {cookieCategories.map((category, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {category.name}
                  </h2>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${category.badgeColor}`}
                >
                  {category.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Cookie Items Table / Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-1/3">Key / Identifier</th>
                      <th className="py-2.5 px-3">Purpose on JobMatrix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/30 text-slate-400">
                    {category.examples.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-blue-300 font-medium">
                          {item.key}
                        </td>
                        <td className="py-2.5 px-3">{item.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* How to Manage Cookies Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <Sliders className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Managing Your Cookie Preferences
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Most modern web browsers allow you to control or block cookies through their system settings. Note that disabling essential authentication cookies may impair your ability to stay logged in or submit candidate applications.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-300">Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-300">Mozilla Firefox: Settings &rarr; Privacy & Security &rarr; Enhanced Tracking</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2">
            Questions regarding our Cookie Policy? Reach out to{" "}
            <span className="text-blue-400 font-mono">support@jobmatrix.dev</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default CookiePolicy;
