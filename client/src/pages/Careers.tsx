import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Laptop, Heart, GraduationCap, Plane, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Careers: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <Laptop className="w-5 h-5 text-blue-400" />,
      title: "100% Remote & Async First",
      desc: "Work from anywhere in the world. We value outcomes, code quality, and deep focus over arbitrary clock-watching.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      title: "Top-of-Market Pay + Equity",
      desc: "Transparent salary bands tied to global benchmarks plus early-stage equity grants with transparent vesting.",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-sky-400" />,
      title: "$2,500 Annual Growth Budget",
      desc: "Dedicated stipend for conferences, technical books, certifications, and specialized mentorship programs.",
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      title: "Comprehensive Wellness",
      desc: "Full medical, dental, and vision insurance plus monthly fitness and mental health stipends.",
    },
    {
      icon: <Plane className="w-5 h-5 text-orange-400" />,
      title: "Flexible Time Off",
      desc: "Minimum 25 days paid vacation annually plus company-wide mental health rejuvenation days.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      title: "Pro Hardware Setup",
      desc: "Latest Apple M-series MacBook Pro, dual 4K monitors, ergonomic chair, and home office setup allowance.",
    },
  ];

  const jobOpenings = [
    {
      id: "eng-01",
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$130k - $175k • 0.2% - 0.5% Equity",
      skills: ["React", "TypeScript", "Node.js", "MongoDB", "WebSockets"],
      description: "Scale our real-time application pipelines, multi-factor security barriers, and high-concurrency recruiter dashboards.",
    },
    {
      id: "ai-02",
      title: "AI / NLP Engineer (ATS Algorithms)",
      department: "AI & Data",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$140k - $185k • 0.25% - 0.6% Equity",
      skills: ["Python", "FastAPI", "Embeddings", "Resume Parsing", "Vector Search"],
      description: "Architect deterministic, zero-hallucination ATS keyword extractors and semantic resume-to-job matching pipelines.",
    },
    {
      id: "des-03",
      title: "Lead Product Designer",
      department: "Design",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$115k - $155k • 0.15% - 0.4% Equity",
      skills: ["Figma", "Design Systems", "Dark Mode UI", "Micro-Interactions"],
      description: "Own the end-to-end user experience, typography system, and high-fidelity interaction design across JobMatrix web apps.",
    },
    {
      id: "ops-04",
      title: "Technical Talent & Recruiter Partner",
      department: "Operations",
      location: "Remote (US / Europe / India)",
      type: "Full-Time",
      salary: "$85k - $120k + Commission",
      skills: ["Technical Recruitment", "Account Management", "Employer Branding"],
      description: "Partner with hyper-growth tech startups and scale-ups to onboard hiring managers and curate developer pipelines.",
    },
  ];

  const departments = ["All", "Engineering", "AI & Data", "Design", "Operations"];

  const filteredJobs =
    selectedDepartment === "All"
      ? jobOpenings
      : jobOpenings.filter((job) => job.department === selectedDepartment);

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
            <Briefcase className="w-3.5 h-3.5" />
            <span>Join Our Team</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Help Us Reinvent How <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Engineers Find Their Calling
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are a tight-knit team of engineers, systems architects, and designers working remotely across 6 timezones. We build software that respects both candidates and hiring managers.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why You'll Love Building Here
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              High autonomy, transparent compensation, and benefits designed for long-term craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 w-fit mb-4">
                  {b.icon}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Roles Section */}
        <div id="open-roles" className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Open Opportunities ({filteredJobs.length})
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Explore current engineering, design, and operations openings.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedDepartment === dept
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {job.department}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    <span className="text-xs font-mono font-semibold text-orange-400">
                      {job.salary}
                    </span>
                    <a
                      href={`mailto:careers@jobmatrix.dev?subject=Application for ${encodeURIComponent(
                        job.title
                      )} (${job.id})`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process Info */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
          <h3 className="text-xl font-bold text-white tracking-tight mb-2">
            Don't see an exact match for your skillset?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed mb-5">
            We are always eager to meet high-calibre systems engineers, distributed database specialists, and product visionaries. Send your resume and GitHub profile directly to our founders.
          </p>
          <a
            href="mailto:careers@jobmatrix.dev?subject=General Engineering / Product Inquiry"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span>Send General Application</span>
            <CheckCircle2 className="w-4 h-4" />
          </a>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Careers;
