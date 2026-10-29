import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Target, Zap, Shield, Layers, CheckCircle2, ChevronRight, BarChart3 } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Features: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featureHighlights = [
    {
      icon: <Sparkles className="w-6 h-6 text-orange-400" />,
      title: "Deterministic ATS Resume Scoring",
      badge: "Candidate Superpower",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      description:
        "No more guessing why an application vanished. Our built-in ATS engine parses your PDF/DOCX resume against the recruiter's exact job description, highlighting matched skills, missing keywords, and structural tips.",
      bullets: [
        "Keyword extraction with zero AI hallucination",
        "Actionable missing keyword suggestions",
        "Instant score percentage benchmark (0-100%)",
        "Single-click optimization before applying",
      ],
    },
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: "Zero Ghost Jobs & Verified Wage Transparency",
      badge: "Platform Guarantee",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      description:
        "Every job posting on JobMatrix requires mandatory salary transparency and undergoes domain verification. Inactive roles expire automatically after 30 days to eliminate ghost listings.",
      bullets: [
        "100% verified corporate hiring domains",
        "Mandatory compensation ranges for all roles",
        "Automatic expiration for fulfilled positions",
        "Strict prohibition of recruiter placement fees",
      ],
    },
    {
      icon: <Zap className="w-6 h-6 text-sky-400" />,
      title: "Real-Time Application Status Telemetry",
      badge: "Real-Time Telemetry",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      description:
        "Stay updated without obsessively refreshing emails. Instant WebSocket notifications notify you the moment a recruiter opens your resume, reviews your profile, or moves you to shortlisted.",
      bullets: [
        "Live status badges: Pending, Reviewed, Shortlisted, Accepted",
        "In-app notification bell with unread counters",
        "Full application timeline history and resume snapshot",
        "Direct recruiter messaging without third-party brokers",
      ],
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: "High-Velocity Recruiter Pipeline Dashboard",
      badge: "For Hiring Teams",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      description:
        "Screen hundreds of technical candidates in minutes. Filter applicants by ATS match score, work authorization, tech stack experience, and work mode (Remote/Hybrid).",
      bullets: [
        "Instant sorting by ATS compatibility score",
        "Quick candidate status updates in one click",
        "Direct resume preview without downloading junk files",
        "Automated applicant volume and conversion analytics",
      ],
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-400" />,
      title: "Cryptographic Security & Anti-IDOR Defenses",
      badge: "Enterprise Security",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      description:
        "Engineered with security-first architecture. Your uploaded resumes, compensation disclosures, and account credentials are protected by cryptographic token rotation and strict RBAC boundaries.",
      bullets: [
        "Automatic refresh token rotation with theft detection",
        "Cross-user IDOR barriers on candidate document endpoints",
        "End-to-end 256-bit TLS encryption in transit",
        "Full GDPR & CCPA account and data erasure controls",
      ],
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      title: "Dark-Mode Cyber Aesthetics & Sub-Second Speed",
      badge: "Developer UX",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      description:
        "Designed specifically for developers and modern knowledge workers. Features sleek contrast, zero visual clutter, ergonomic keyboard navigation, and ultra-fast client-side page transitions.",
      bullets: [
        "Vite + Tailwind CSS v4 sub-second compile and render",
        "Deep Navy & Vibrant Blue palette with Action Orange accents",
        "Responsive, mobile-optimized candidate and recruiter suites",
        "Accessible contrast meeting high WCAG standards",
      ],
    },
  ];

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
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Engineered for High-Precision <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Technical Recruitment
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every feature in JobMatrix is designed to eliminate friction, banish ghost jobs, and give candidates and recruiters deterministic transparency.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {featureHighlights.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-300 transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                {feat.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Experience the Future of Hiring Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Whether you are an engineer looking for high-autonomy roles or a recruiter building a world-class team, JobMatrix is ready for you.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/candidate/find-jobs"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>Browse Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Features;
