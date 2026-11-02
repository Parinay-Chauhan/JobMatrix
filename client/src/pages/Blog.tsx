import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Blog: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const articles = [
    {
      id: "ats-engine-architecture",
      title: "Building a Sub-50ms ATS Match Engine on MongoDB & High-Concurrency Node.js",
      category: "Engineering",
      date: "October 22, 2026",
      readTime: "6 min read",
      author: "Systems Team",
      summary:
        "A breakdown of how we eliminated sluggish algorithmic bottlenecks, tokenized resume text without hallucination, and cached keyword vectors for lightning-fast matching.",
      tags: ["Node.js", "MongoDB", "Algorithms", "Performance"],
    },
    {
      id: "ghost-jobs-manifesto",
      title: "The Death of Ghost Jobs: Why Mandatory Wage Transparency is Winning Tech Hiring",
      category: "Hiring Trends",
      date: "October 15, 2026",
      readTime: "5 min read",
      author: "Talent Operations",
      summary:
        "Over 40% of tech job postings on legacy boards are never meant to be filled. Here's how our automatic expiry gates and strict salary disclosure policies restored applicant trust.",
      tags: ["Recruiting", "Compensation", "Ethics"],
    },
    {
      id: "junior-to-staff-guide",
      title: "From Junior to Staff: The Engineering Competencies That Actually Matter in 2026",
      category: "Career Growth",
      date: "September 28, 2026",
      readTime: "8 min read",
      author: "Engineering Leadership",
      summary:
        "Syntax is cheap in the age of AI coding assistants. We analyzed over 2,000 senior and staff placements to surface the architectural, communication, and systems traits that get you hired.",
      tags: ["Career", "Staff Engineering", "System Design"],
    },
    {
      id: "refresh-token-rotation",
      title: "Why We Swapped Bearer Tokens for Cryptographic Cookie Rotation and IDOR Defenses",
      category: "Security",
      date: "September 12, 2026",
      readTime: "7 min read",
      author: "AppSec Team",
      summary:
        "Defending candidate resumes and sensitive salary history against cross-site scripting (XSS) and token theft using HTTP-only automatic token families.",
      tags: ["Security", "JWT", "AppSec", "WebSockets"],
    },
    {
      id: "remote-async-habits",
      title: "Asynchronous Mastery: How Elite Remote Engineers Excel Across Global Timezones",
      category: "Career Growth",
      date: "August 30, 2026",
      readTime: "4 min read",
      author: "Product Strategy",
      summary:
        "The best distributed software teams don't spend all day in video calls. Learn how documentation-first engineering and atomic PRs drastically elevate your team velocity.",
      tags: ["Remote Work", "Productivity", "Culture"],
    },
  ];

  const categories = ["All", "Engineering", "Hiring Trends", "Career Growth", "Security"];

  const filteredArticles =
    selectedTag === "All"
      ? articles
      : articles.filter((art) => art.category === selectedTag);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput("");
    }
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

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The JobMatrix Publication</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Engineering, Hiring Telemetry & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Career Insights
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Deep-dives on distributed system design, transparent hiring economics, interview benchmarks, and developer career progression.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTag(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing {filteredArticles.length} Articles
          </span>
        </div>

        {/* Featured / Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {filteredArticles.map((article, idx) => (
            <article
              key={article.id}
              className={`p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between group ${
                idx === 0 && selectedTag === "All" ? "md:col-span-2 bg-gradient-to-br from-blue-950/30 via-slate-900/80 to-slate-950" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </span>
                </div>

                <h2
                  className={`font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight leading-snug mb-3 ${
                    idx === 0 && selectedTag === "All" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  }`}
                >
                  {article.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/60">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Get the Weekly Tech Hiring Digest
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join 15,000+ developers, tech leads, and talent leaders receiving our weekly analysis on hiring benchmarks and tech salary trends. Zero spam, unsubscribe anytime.
            </p>

            {emailSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're on the list! Welcome to the JobMatrix Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Blog;
