import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Terminal, Code2, Shield, Layers, Copy, Check, ChevronRight } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ats" | "jobs" | "auth">("ats");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const codeSnippets = {
    ats: `// Sample ATS Keyword Match Payload
POST /api/v1/ats/analyze
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
Body: {
  "jobDescription": "Looking for Senior React/Node engineer with WebSockets experience...",
  "resumeKeywords": ["React", "TypeScript", "Node.js", "Redis", "Docker"]
}

// Response (200 OK)
{
  "success": true,
  "matchScore": 88,
  "matchedSkills": ["React", "Node.js", "TypeScript"],
  "missingCriticalSkills": ["WebSockets"],
  "suggestions": [
    "Highlight real-time socket implementations in your work history",
    "Quantify your React state management performance gains"
  ]
}`,
    jobs: `// Fetch Filtered Verified Job Listings
GET /api/v1/jobs?workMode=Remote&category=Tech&page=1&limit=20
Headers: {
  "Accept": "application/json"
}

// Response (200 OK)
{
  "success": true,
  "total": 142,
  "page": 1,
  "jobs": [
    {
      "_id": "6718a9e102f9c...",
      "title": "Senior Backend Engineer",
      "company": "Stripe-backed Fintech",
      "workMode": "Remote",
      "salaryRange": { "min": 120000, "max": 160000, "currency": "USD" },
      "requiredSkills": ["Node.js", "PostgreSQL", "Redis", "Kafka"],
      "createdAt": "2026-10-24T14:30:00.000Z"
    }
  ]
}`,
    auth: `// Refresh Token Cryptographic Rotation
POST /api/v1/auth/refresh-token
Credentials: include (HTTP-only cookie)

// Server Behavior:
// 1. Validates incoming refresh token signature.
// 2. Checks token revocation list & reuse flags.
// 3. Immediately invalidates old token family if reuse detected (Anti-Theft).
// 4. Sets new cryptographic token pair in Set-Cookie response header.`,
  };

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
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer & Platform Specs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            JobMatrix <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Platform Documentation
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Comprehensive reference guides covering ATS matching mechanics, public REST APIs, real-time application pipelines, and authentication guardrails.
          </p>
        </div>

        {/* 3 Pillars Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Deterministic ATS Scoring</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our resume matching engine extracts hard skills, years of experience, and role responsibilities using transparent algorithmic weighting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">WebSocket Telemetry</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Application state events stream across secure socket rooms, ensuring recruiters and candidates see instantaneous milestone updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 w-fit mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero-Trust Security</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Cryptographic JWT rotation, cross-tenant IDOR barriers, and strict rate-limiting designed to keep applicant profiles uncompromised.
            </p>
          </div>
        </div>

        {/* Interactive API Explorer Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 mb-16 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>REST API Reference</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Endpoints & Schemas
              </h2>
            </div>

            {/* Tab Selectors */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("ats")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "ats"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ATS Match API
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("jobs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "jobs"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Jobs Feed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("auth")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "auth"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Token Rotation
              </button>
            </div>
          </div>

          {/* Code Container */}
          <div className="relative">
            <button
              type="button"
              onClick={() => handleCopy(codeSnippets[activeTab], activeTab)}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer z-10"
            >
              {copiedSnippet === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <pre className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Integration Quicklinks */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Ready to Optimize Your Resume with our ATS Engine?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Run your resume against active job descriptions in seconds using our built-in analyzer.
            </p>
          </div>
          <Link
            to="/candidate/resume-optimizer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
          >
            <span>Launch ATS Optimizer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Documentation;
