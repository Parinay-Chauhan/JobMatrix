import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  UploadCloud,
  Search,
  ExternalLink,
  ArrowRight,
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
    return Math.min(100, score);
  }, [profile, candidateSkills]);

  // 1-Click Add Missing Skill Handler
  const handleAddSkillToProfile = (skillToAdd: string) => {
    if (candidateSkills.some((s) => s.toLowerCase() === skillToAdd.toLowerCase())) {
      toast.info(`"${skillToAdd}" is already in your skills.`);
      return;
    }

    const updatedSkills = [...candidateSkills, skillToAdd];
    updateProfileMutation.mutate(
      { skills: updatedSkills },
      {
        onSuccess: () => {
          toast.success(`Added "${skillToAdd}" to your profile skills`, {
            description: "Your ATS Match score has increased.",
          });
        },
        onError: () => {
          toast.error("Failed to update profile skills.");
        },
      }
    );
  };

  // Copy Bullet Point Handler
  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Bullet point copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Resume File Upload Handler
  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    uploadResumeMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Resume updated successfully");
      },
      onError: () => {
        toast.error("Failed to upload resume document.");
      },
    });
  };

  // Preset Applicator
  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setCustomRoleTitle(preset.role);
    setCustomCompanyName(preset.company);
    setCustomJdText(preset.jd);
    toast.info(`Loaded "${preset.name}" preset`);
  };

  // Filter Jobs for Search List
  const filteredJobs = useMemo(() => {
    if (!jobSearchTerm) return jobs.slice(0, 15);
    const term = jobSearchTerm.toLowerCase();
    return jobs
      .filter((j) => {
        const comp = typeof j.recruiter === "object" ? j.recruiter?.companyName : j.companyName;
        return (
          j.title.toLowerCase().includes(term) ||
          comp?.toLowerCase().includes(term) ||
          j.requirements?.some((r) => r.toLowerCase().includes(term))
        );
      })
      .slice(0, 15);
  }, [jobs, jobSearchTerm]);

  // Color config based on score band
  const matchBand = analysis.score >= 80 ? "high" : analysis.score >= 50 ? "medium" : "low";
  const bandConfig = {
    high: {
      text: "High Match",
      circleClass: "text-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      tip: "Your profile strongly matches this job description.",
    },
    medium: {
      text: "Moderate Match",
      circleClass: "text-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      tip: "You meet some key requirements. Add missing keywords below to improve your score.",
    },
    low: {
      text: "Needs Improvement",
      circleClass: "text-rose-500",
      badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      tip: "Major keyword gap. Use the add buttons below to add relevant skills.",
    },
  }[matchBand];

  return (
    <div className="space-y-6">
      {/* Hero Header Strip */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Resume optimizer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Compare your resume against any job description, identify keyword gaps, and tailor your profile for applicant tracking systems.
            </p>
          </div>

          {/* Quick Resume Upload/Status Card */}
          <div className="flex items-center gap-3.5 bg-slate-950/40 border border-slate-800/80 rounded-lg p-3.5 shrink-0">
            <div className="w-9 h-9 rounded-md bg-slate-800/80 flex items-center justify-center text-slate-300 shrink-0">
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Attached resume</span>
              {profile?.resume ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-white truncate max-w-[140px]">
                    {(profile.resume.split("/").pop() || "").replace(/^\d+[-_]?/, "")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ) : (
                <label className="text-xs font-medium text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1.5 mt-0.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload resume PDF</span>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">ATS readiness</span>
            <span className="text-2xl font-semibold text-blue-400 tabular-nums mt-1 block">{overallAtsReadiness}%</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Profile keywords</span>
            <span className="text-2xl font-semibold text-white tabular-nums mt-1 block">{candidateSkills.length}</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Active openings</span>
            <span className="text-2xl font-semibold text-sky-400 tabular-nums mt-1 block">{jobs.length}</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Target match</span>
            <span className="text-2xl font-semibold text-white tabular-nums mt-1 block">{analysis.score}%</span>
          </div>
        </div>
      </div>

      {/* 3-Step Guided Guide Card */}
      {showHowItWorks && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>How it works (3 steps)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-800/60"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                1
              </span>
              <div>
                <h4 className="text-sm font-medium text-white">Choose target role</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Select an active job opening from the list or paste any job description text.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                2
              </span>
              <div>
                <h4 className="text-sm font-medium text-white">Review keyword gaps</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Inspect matched keywords and see missing skills that ATS filters scan for.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                3
              </span>
              <div>
                <h4 className="text-sm font-medium text-white">Add skills & copy bullets</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Click Add to update your profile and copy role-tailored bullet points into your resume.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Step 1 - Target Job Selector / Custom JD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Target position
                </h2>
              </div>

              {/* Mode Toggle Switch */}
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setAnalysisMode("platform_job")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    analysisMode === "platform_job"
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Platform jobs
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisMode("custom_jd")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    analysisMode === "custom_jd"
                      ? "bg-slate-800 text-white border border-slate-700"
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
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/40 rounded-lg border border-slate-800/80">
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
                          className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-slate-800/70 border-blue-500/40 text-white"
                              : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium line-clamp-1 ${isSelected ? "text-blue-300" : "text-white"}`}>
                              {(j.title || "").replace(/\s+\d{10,14}$/, "")}
                            </h4>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 font-medium">
                              {j.jobType || "Full-time"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
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
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-2">
                    Quick test with sample role:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 group-hover:text-white">
                            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                  label="Paste Job Description"
                  rows={6}
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  placeholder="Paste the full job description text here..."
                  helperText="Required skills and technologies will be extracted automatically."
                />
              </div>
            )}
          </div>

          {/* Current Profile Skills Manager */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Active profile skills ({candidateSkills.length})
                </h3>
              </div>
              <Link
                to="/candidate/profile"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Edit profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pt-1">
              {candidateSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800/80 text-slate-300 text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
              {candidateSkills.length === 0 && (
                <p className="text-xs text-slate-500 py-1">
                  No skills listed. Add skills in your profile.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Step 2 & 3 - Live ATS Analysis & Optimizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden">
            {/* Header Strip with Score Summary */}
            <div className="p-6 border-b border-slate-800/80 bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {(currentJob.title || "").replace(/\s+\d{10,14}$/, "")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>
                    {(typeof currentJob.recruiter === "object" ? currentJob.recruiter?.companyName : undefined) ||
                      currentJob.companyName ||
                      "Organization"}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span>{currentJob.location || "Remote"}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {bandConfig.tip}
                </p>
              </div>

              {/* Gauge Meter */}
              <div className="flex items-center gap-3.5 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 shrink-0">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
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
                    <span className="text-base font-semibold text-white tabular-nums">{analysis.score}%</span>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${bandConfig.badgeClass} block text-center`}>
                    {bandConfig.text}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block font-medium tabular-nums">
                    {analysis.matchedSkills.length} of {analysis.allRequiredSkills.length} skills matched
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "skills"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Skills breakdown</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-850 text-[11px] font-medium text-slate-300 tabular-nums">
                  {analysis.allRequiredSkills.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bullets")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "bullets"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Tailored resume bullets</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-850 text-[11px] font-medium text-slate-300 tabular-nums">
                  {analysis.suggestedBullets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "checklist"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>ATS checklist</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-850 text-[11px] font-medium text-slate-300 tabular-nums">
                  {analysis.formattingTips.length}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-6">
              {activeTab === "skills" && (
                <div className="space-y-5">
                  {/* Diagnostic Advice */}
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-blue-400 mb-0.5">Recommendation</p>
                    {analysis.keywordDensityAdvice}
                  </div>

                  {/* Missing Skills with 1-Click Add */}
                  <div className="space-y-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Missing keywords ({analysis.missingSkills.length})</span>
                      </h4>
                      <span className="text-xs text-amber-400/80">Click + Add to update your profile</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysis.missingSkills.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAddSkillToProfile(sk)}
                          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          title={`Add ${sk} to profile`}
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sk}</span>
                        </button>
                      ))}
                      {analysis.missingSkills.length === 0 && (
                        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>All required keywords are present in your profile.</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Matching skills ({analysis.matchedSkills.length})</span>
                      </h4>
                      <span className="text-xs text-slate-500">Passed ATS scan</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysis.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{sk}</span>
                        </span>
                      ))}
                      {analysis.matchedSkills.length === 0 && (
                        <p className="text-xs text-slate-500 py-1">
                          No matching skills found yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bullets" && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-lg text-xs text-slate-300">
                    Copy these bullet points directly into your resume under relevant experience entries:
                  </div>

                  <div className="space-y-2.5">
                    {analysis.suggestedBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 flex items-start justify-between gap-3 transition-colors"
                      >
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          &bull; {bullet}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet, idx)}
                          className="p-2 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shrink-0 cursor-pointer"
                          title="Copy bullet point"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "checklist" && (
                <div className="space-y-2.5">
                  {analysis.formattingTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border flex items-start gap-3 ${
                        tip.passed
                          ? "bg-slate-950/40 border-slate-800/80"
                          : "bg-amber-500/5 border-amber-500/20"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {tip.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-medium text-white">{tip.title}</h5>
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${tip.passed ? "bg-slate-800 text-emerald-400 border border-slate-700" : "bg-amber-500/10 text-amber-300 border border-amber-500/20"}`}>
                            {tip.passed ? "Optimized" : "Action needed"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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

      {/* Resume Viewer Modal */}
      {isResumeModalOpen && profile?.resume && (
        <Modal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          title="Attached Resume Document"
          size="xl"
        >
          <div className="space-y-4">
            <div className="h-[500px] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80">
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
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
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
