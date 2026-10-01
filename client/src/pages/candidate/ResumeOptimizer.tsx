import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  UploadCloud,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  Code2,
  Terminal,
  Database,
  Smartphone,
} from "lucide-react";
import type { Job } from "../../types";
import {
  useCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useJobsQuery,
  useUploadResumeMutation,
} from "../../hooks/queries";
import { analyzeJobATS } from "../../utils/atsEngine";
import { Input, Textarea, Modal } from "../../components/common";

const SAMPLE_PRESETS = [
  {
    name: "Full Stack Engineer",
    icon: Code2,
    role: "Senior Full Stack Engineer",
    company: "Stripe / Scale AI",
    jd: "Looking for a Senior Full Stack Engineer experienced in React, TypeScript, Node.js, Next.js, PostgreSQL, Docker, and AWS. Must have experience architecting scalable REST APIs, microservices, and CI/CD pipelines.",
  },
  {
    name: "Frontend Specialist",
    icon: Terminal,
    role: "Lead Frontend Engineer",
    company: "Vercel / Linear",
    jd: "Seeking an expert Frontend Engineer proficient in React, Next.js, TypeScript, Tailwind CSS, Redux, WebSockets, and modern web performance optimization (Web Vitals, accessibility).",
  },
  {
    name: "Backend & Cloud",
    icon: Database,
    role: "Backend Infrastructure Engineer",
    company: "Datadog / Uber",
    jd: "Seeking a Backend Engineer experienced in Node.js, Go (Golang), Python, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, and distributed systems design.",
  },
  {
    name: "Mobile App Dev",
    icon: Smartphone,
    role: "Mobile Applications Engineer",
    company: "DoorDash / Coinbase",
    jd: "Looking for a Mobile Developer with strong skills in React Native, Flutter, TypeScript, iOS, Android, REST APIs, and state management.",
  },
];

export const ResumeOptimizer: React.FC = () => {
  const { data: profile } = useCandidateProfileQuery();
  const updateProfileMutation = useUpdateCandidateProfileMutation();
  const uploadResumeMutation = useUploadResumeMutation();
  const { data: jobs = [], isLoading: loadingJobs } = useJobsQuery();

  // Mode: "platform_job" | "custom_jd"
  const [analysisMode, setAnalysisMode] = useState<"platform_job" | "custom_jd">("platform_job");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  // Custom JD state
  const [customRoleTitle, setCustomRoleTitle] = useState("Senior Full Stack Engineer");
  const [customCompanyName, setCustomCompanyName] = useState("Target Company");
  const [customJdText, setCustomJdText] = useState(
    "We are looking for a Senior Full Stack Engineer experienced in React, TypeScript, Node.js, Next.js, PostgreSQL, Docker, and AWS. Must have experience designing scalable REST APIs and CI/CD pipelines."
  );

  // Resume Viewer Modal State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "bullets" | "checklist">("skills");

  const candidateSkills = useMemo(() => {
    if (!profile?.skills) return [];
    if (Array.isArray(profile.skills)) return profile.skills;
    if (typeof profile.skills === "string") {
      return (profile.skills as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [profile?.skills]);

  // Fallback default job if jobs list is still loading
  const fallbackJob: Job = useMemo(() => ({
    _id: "demo-job",
    title: "Full Stack Engineer",
    companyName: "Tech Innovations",
    description: "Seeking a developer skilled in React, TypeScript, Node.js, REST APIs, PostgreSQL, and Cloud infrastructure.",
    location: "Remote / Hybrid",
    jobType: "Full-time",
    requirements: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    createdAt: new Date().toISOString(),
  } as unknown as Job), []);

  // Selected or Synthetic Job
  const currentJob = useMemo<Job>(() => {
    if (analysisMode === "platform_job") {
      if (selectedJobId) {
        const found = jobs.find((j) => j._id === selectedJobId);
        if (found) return found;
      }
      return jobs[0] || fallbackJob;
    } else {
      // Synthetic Job created from Custom JD
      return {
        _id: "custom-jd",
        title: customRoleTitle || "Target Position",
        companyName: customCompanyName || "Target Company",
        description: customJdText,
        location: "Flexible / Remote",
        jobType: "Full-time",
        requirements: [],
        createdAt: new Date().toISOString(),
      } as unknown as Job;
    }
  }, [analysisMode, selectedJobId, jobs, customRoleTitle, customCompanyName, customJdText, fallbackJob]);

  // Run ATS Analysis
  const analysis = useMemo(() => {
    return analyzeJobATS(currentJob, profile);
  }, [currentJob, profile]);

  // Calculate Candidate General ATS Health Score
  const overallAtsReadiness = useMemo(() => {
    let score = 0;
    if (profile?.resume) score += 25;
    if (candidateSkills.length >= 5) score += 25;
    else if (candidateSkills.length > 0) score += 10;
    if (profile?.bio && profile.bio.trim().length >= 40) score += 20;
    if (profile?.experience && profile.experience.length > 0) score += 15;
    if (profile?.education && profile.education.length > 0) score += 15;
    return score;
  }, [profile, candidateSkills]);

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Bullet point copied!", {
      description: "Paste this directly into your resume under work experience.",
    });
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleAddSkillToProfile = async (skillToAdd: string) => {
    if (candidateSkills.some((s) => s.toLowerCase() === skillToAdd.toLowerCase())) return;
    const updated = [...candidateSkills, skillToAdd];
    try {
      await updateProfileMutation.mutateAsync({ skills: updated });
      toast.success(`Added "${skillToAdd}" to your Profile!`, {
        description: "ATS Match score updated live.",
      });
    } catch {
      toast.error("Failed to add skill.");
    }
  };

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      await uploadResumeMutation.mutateAsync(file);
      toast.success("Resume document uploaded successfully!");
    } catch {
      toast.error("Failed to upload resume.");
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setAnalysisMode("custom_jd");
    setCustomRoleTitle(preset.role);
    setCustomCompanyName(preset.company);
    setCustomJdText(preset.jd);
    toast.info(`Loaded preset: ${preset.name}`, {
      description: "Analysis updated with sample job requirements.",
    });
  };

  // Filtered Jobs for Dropdown / Selector
  const filteredJobs = useMemo(() => {
    if (!jobSearchTerm) return jobs;
    return jobs.filter((j) =>
      j.title?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      (typeof j.recruiter === "object" && j.recruiter?.companyName?.toLowerCase().includes(jobSearchTerm.toLowerCase())) ||
      j.companyName?.toLowerCase().includes(jobSearchTerm.toLowerCase())
    );
  }, [jobs, jobSearchTerm]);

  // Band styling configuration
  const matchBand = analysis?.matchBand || "low";
  const bandConfig = {
    high: {
      text: "Strong ATS Match",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      circleClass: "text-emerald-400 stroke-emerald-400",
      accentBg: "from-emerald-500/10 via-teal-500/5 to-transparent",
      tip: "High likelihood of passing automated ATS recruiter filters!",
    },
    medium: {
      text: "Moderate Match",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      circleClass: "text-amber-400 stroke-amber-400",
      accentBg: "from-amber-500/10 via-orange-500/5 to-transparent",
      tip: "Add missing keywords below to reach 80%+ match rate.",
    },
    low: {
      text: "Optimization Required",
      badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      circleClass: "text-rose-400 stroke-rose-400",
      accentBg: "from-rose-500/10 via-orange-500/5 to-transparent",
      tip: "Major keyword gap. Use 1-click Add buttons to optimize.",
    },
  }[matchBand];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Candidate Tool</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              AI ATS Resume Optimizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Match your resume and profile against any job opening, find missing ATS keywords, and generate role-tailored bullet points with 1-click.
            </p>
          </div>

          {/* Quick Resume Upload/Status Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">Your Attached Resume</span>
              {profile?.resume ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {profile.resume.split("/").pop()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-bold underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ) : (
                <label className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1.5 mt-0.5">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Resume PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-7 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">ATS Readiness</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{overallAtsReadiness}%</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Profile Keywords</span>
              <span className="text-lg sm:text-xl font-black text-white">{candidateSkills.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active Roles</span>
              <span className="text-lg sm:text-xl font-black text-cyan-300">{jobs.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Target Role Match</span>
              <span className="text-lg sm:text-xl font-black text-white">{analysis.score}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* User-Friendly 3-Step Guided Guide Card */}
      {showHowItWorks && (
        <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 border border-emerald-500/30 p-5 sm:p-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5 text-emerald-300 font-extrabold text-sm sm:text-base uppercase tracking-wider">
              <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>How It Works (3 Easy Steps)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-3.5 bg-slate-950/80 p-4.5 rounded-xl border border-slate-800/90 shadow-sm">
              <span className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-base flex items-center justify-center shrink-0 border border-emerald-500/30">
                1
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">Choose Target Role</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Select an active job from the left list or paste any job description from LinkedIn/Indeed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/80 p-4.5 rounded-xl border border-slate-800/90 shadow-sm">
              <span className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 font-black text-base flex items-center justify-center shrink-0 border border-teal-500/30">
                2
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">Review Keyword Gaps</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-medium">
                  See matching keywords (green) and missing keywords (amber) that ATS filters search for.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/80 p-4.5 rounded-xl border border-slate-800/90 shadow-sm">
              <span className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-base flex items-center justify-center shrink-0 border border-cyan-500/30">
                3
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">1-Click Boost & Copy</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Click &quot;+ Add&quot; to boost your score and copy tailored bullets directly into your resume.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Step 1 - Target Job Selector / Custom JD                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400 block">Step 1</span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Select Target Position
                </h2>
              </div>

              {/* Mode Toggle Switch */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAnalysisMode("platform_job")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analysisMode === "platform_job"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Platform Jobs
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisMode("custom_jd")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analysisMode === "custom_jd"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Paste JD
                </button>
              </div>
            </div>

            {analysisMode === "platform_job" ? (
              <div className="space-y-4">
                <Input
                  placeholder="Search live jobs by title, company, or tech..."
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />

                <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                  {loadingJobs ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Loading available openings...
                    </div>
                  ) : filteredJobs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                      No jobs match your search keywords.
                    </div>
                  ) : (
                    filteredJobs.map((j) => {
                      const isSelected = (selectedJobId || jobs[0]?._id) === j._id;
                      const comp =
                        (typeof j.recruiter === "object" ? j.recruiter?.companyName : undefined) ||
                        j.companyName ||
                        "Organization";

                      return (
                        <div
                          key={j._id}
                          onClick={() => setSelectedJobId(j._id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm sm:text-base font-bold line-clamp-1 ${isSelected ? "text-emerald-300" : "text-white"}`}>
                              {j.title}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 shrink-0 font-semibold">
                              {j.jobType || "Full-time"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-slate-300 mt-1.5 flex items-center gap-1.5 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{comp}</span>
                            <span className="text-slate-600">&bull;</span>
                            <span>{j.location || "Remote"}</span>
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Custom JD Form with 1-Click Role Presets */
              <div className="space-y-4">
                {/* 1-Click Sample Presets */}
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    ⚡ Quick Test with Sample Role:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SAMPLE_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-slate-200 group-hover:text-emerald-300">
                            <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{preset.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Input
                    label="Target Job Title"
                    value={customRoleTitle}
                    onChange={(e) => setCustomRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                  <Input
                    label="Company Name"
                    value={customCompanyName}
                    onChange={(e) => setCustomCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Google"
                  />
                </div>

                <Textarea
                  label="Paste Job Description (Requirements & Responsibilities)"
                  rows={6}
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  placeholder="Paste the full job description text here..."
                  helperText="Our ATS keyword parser will instantly extract required skills."
                />
              </div>
            )}
          </div>

          {/* Current Profile Skills Manager */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-teal-400 block">Your Profile</span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Active Skills ({candidateSkills.length})
                </h3>
              </div>
              <Link
                to="/candidate/profile"
                className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pt-1">
              {candidateSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-[13px] font-medium"
                >
                  {sk}
                </span>
              ))}
              {candidateSkills.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  No skills listed. Add skills through the edit profile view.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Step 2 & 3 - Live ATS Analysis & 1-Click Optimizer          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 shadow-xl overflow-hidden">
            {/* Header Strip with Glowing Gradient */}
            <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${bandConfig.accentBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  Step 2 & 3: Live Scan Result
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {currentJob.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 mt-1.5 font-semibold">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {(typeof currentJob.recruiter === "object" ? currentJob.recruiter?.companyName : undefined) ||
                      currentJob.companyName ||
                      "Organization"}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-300 font-normal">{currentJob.location || "Remote"}</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-medium leading-relaxed">
                  {bandConfig.tip}
                </p>
              </div>

              {/* Gauge Meter */}
              <div className="flex items-center gap-3.5 bg-slate-950/85 p-4 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
                <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={bandConfig.circleClass}
                      strokeDasharray={`${analysis.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-white">{analysis.score}%</span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${bandConfig.badgeClass} block text-center`}>
                    {bandConfig.text}
                  </span>
                  <span className="text-xs text-slate-300 mt-1.5 block font-medium">
                    {analysis.matchedSkills.length} of {analysis.allRequiredSkills.length} skills matched
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "skills"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>1. Skills Gap Breakdown</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-extrabold text-slate-200">
                  {analysis.allRequiredSkills.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bullets")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "bullets"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>2. Tailored Resume Bullets</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-extrabold text-slate-200">
                  {analysis.suggestedBullets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "checklist"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>3. ATS Health Checklist</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-extrabold text-slate-200">
                  {analysis.formattingTips.length}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-6">
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {/* Diagnostic Advice */}
                  <div className="p-4.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <p className="font-bold text-emerald-400 mb-1">ATS Diagnostic Recommendation:</p>
                    {analysis.keywordDensityAdvice}
                  </div>

                  {/* Missing Skills with 1-Click Add (TOP PRIORITY) */}
                  <div className="space-y-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Missing Target Keywords ({analysis.missingSkills.length})</span>
                      </h4>
                      <span className="text-xs text-amber-300/90 font-medium">Click &quot;+ Add&quot; to update profile instantly</span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {analysis.missingSkills.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAddSkillToProfile(sk)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-500/20 border border-amber-500/40 hover:border-emerald-500/50 text-amber-200 hover:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer group shadow-sm active:scale-95"
                          title={`Click to add "${sk}" to your profile skills`}
                        >
                          <Plus className="w-4 h-4 text-amber-400 group-hover:text-emerald-300 transition-colors" />
                          <span>{sk}</span>
                          <span className="text-xs text-slate-400 font-normal group-hover:text-emerald-400">
                            (+Add)
                          </span>
                        </button>
                      ))}
                      {analysis.missingSkills.length === 0 && (
                        <p className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-2 py-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>All detected required keywords are present in your profile!</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Matching Skills Found ({analysis.matchedSkills.length})</span>
                      </h4>
                      <span className="text-xs text-slate-400">Will pass ATS filters</span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {analysis.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{sk}</span>
                        </span>
                      ))}
                      {analysis.matchedSkills.length === 0 && (
                        <p className="text-xs sm:text-sm text-slate-400 italic py-1">
                          No matching skills found yet. Click &quot;+ Add&quot; on missing keywords above.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bullets" && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs sm:text-sm text-emerald-300 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Copy these bullet points directly into your resume under your relevant work experience entries:</span>
                  </div>

                  <div className="space-y-3">
                    {analysis.suggestedBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-4.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-start justify-between gap-3.5 transition-colors group"
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                          &bull; {bullet}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet, idx)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all shrink-0 cursor-pointer"
                          title="Copy bullet point to clipboard"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "checklist" && (
                <div className="space-y-3">
                  {analysis.formattingTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={`p-4.5 rounded-xl border flex items-start gap-4 ${
                        tip.passed
                          ? "bg-emerald-500/5 border-emerald-500/25"
                          : "bg-slate-950/80 border-slate-800"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {tip.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h5 className="text-sm sm:text-base font-bold text-white">{tip.title}</h5>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${tip.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                            {tip.passed ? "OPTIMIZED" : "ACTION NEEDED"}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Resume Viewer Modal */}
      {isResumeModalOpen && profile?.resume && (
        <Modal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          title="Attached Resume Document"
          size="xl"
        >
          <div className="space-y-4">
            <div className="h-[500px] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(profile.resume)}&embedded=true`}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400 font-mono truncate max-w-sm">
                {profile.resume.split("/").pop()}
              </span>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Download PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ResumeOptimizer;
