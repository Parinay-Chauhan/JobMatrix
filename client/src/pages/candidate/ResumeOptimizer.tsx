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

export const ResumeOptimizer: React.FC = () => {
  const { data: profile } = useCandidateProfileQuery();
  const updateProfileMutation = useUpdateCandidateProfileMutation();
  const uploadResumeMutation = useUploadResumeMutation();
  const { data: jobs = [] } = useJobsQuery();

  // Mode: "platform_job" | "custom_jd"
  const [analysisMode, setAnalysisMode] = useState<"platform_job" | "custom_jd">("platform_job");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobSearchTerm, setJobSearchTerm] = useState("");

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

  // Fallback default job
  const fallbackJob: Job = useMemo(() => ({
    _id: "demo-job",
    title: "Senior Full Stack Engineer",
    companyName: "Tech Innovations Inc.",
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
      description: "Paste this directly into your resume's experience section.",
    });
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleAddSkillToProfile = async (skillToAdd: string) => {
    if (candidateSkills.some((s) => s.toLowerCase() === skillToAdd.toLowerCase())) return;
    const updated = [...candidateSkills, skillToAdd];
    try {
      await updateProfileMutation.mutateAsync({ skills: updated });
      toast.success(`Added "${skillToAdd}" to your Profile!`, {
        description: "Your ATS Match score has been recalculated live.",
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
    },
    medium: {
      text: "Moderate Match (Keywords Needed)",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      circleClass: "text-amber-400 stroke-amber-400",
      accentBg: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
    low: {
      text: "Optimization Required",
      badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      circleClass: "text-rose-400 stroke-rose-400",
      accentBg: "from-rose-500/10 via-orange-500/5 to-transparent",
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
              <span>AI ATS Resume Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Resume Keyword & ATS Scanner
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Scan your profile against specific job descriptions, identify missing keyword gaps, and generate tailored, high-impact resume bullets to maximize interview callbacks.
            </p>
          </div>

          {/* Quick Resume Upload/Status Card */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Resume Status</span>
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
                <label className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1 mt-0.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload PDF</span>
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
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">ATS Readiness</span>
              <span className="text-base font-bold text-emerald-400">{overallAtsReadiness}%</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Profile Keywords</span>
              <span className="text-base font-bold text-white">{candidateSkills.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Roles</span>
              <span className="text-base font-bold text-cyan-300">{jobs.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Selected Match</span>
              <span className="text-base font-bold text-white">{analysis.score}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Target Job Selector or Custom JD Input                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Target Job Source
              </h2>
              {/* Toggle Switch */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAnalysisMode("platform_job")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analysisMode === "custom_jd"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Paste Custom JD
                </button>
              </div>
            </div>

            {analysisMode === "platform_job" ? (
              <div className="space-y-4">
                <Input
                  placeholder="Search available platform jobs..."
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />

                <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredJobs.length === 0 ? (
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
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/40 shadow-md"
                              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 ${isSelected ? "text-emerald-300" : "text-white"}`}>
                              {j.title}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 font-medium">
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
              /* Custom JD Form */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
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
                  rows={8}
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  placeholder="Paste the full job description text here..."
                  helperText="Our NLP keyword engine will extract skills and benchmark your profile."
                />
              </div>
            )}
          </div>

          {/* Current Profile Skills Manager */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Profile Skills ({candidateSkills.length})
              </h3>
              <Link
                to="/candidate/profile"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {candidateSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
              {candidateSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">
                  No skills added yet. Add skills to increase ATS score.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Live Score & Diagnostic Workspace                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 shadow-xl overflow-hidden">
            {/* Header Strip with Glowing Gradient */}
            <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${bandConfig.accentBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-1">
                  Analyzing Role
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentJob.title}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {(typeof currentJob.recruiter === "object" ? currentJob.recruiter?.companyName : undefined) ||
                      currentJob.companyName ||
                      "Organization"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
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
                    <span className="text-base font-black text-white">{analysis.score}%</span>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bandConfig.badgeClass} block text-center`}>
                    {bandConfig.text}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {analysis.matchedSkills.length} of {analysis.allRequiredSkills.length} required skills
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950/40">
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "skills"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>Skills Gap Breakdown</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-extrabold text-slate-300">
                  {analysis.allRequiredSkills.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bullets")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "bullets"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>Tailored Resume Bullets</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-extrabold text-slate-300">
                  {analysis.suggestedBullets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "checklist"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>ATS Checklist</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-extrabold text-slate-300">
                  {analysis.formattingTips.length}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-6">
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {/* Diagnostic Advice */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-emerald-400 mb-1">ATS Diagnostic Advice:</p>
                    {analysis.keywordDensityAdvice}
                  </div>

                  {/* Matched Skills */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Matching Skills in Profile ({analysis.matchedSkills.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-500">Will pass keyword filters</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{sk}</span>
                        </span>
                      ))}
                      {analysis.matchedSkills.length === 0 && (
                        <p className="text-xs text-slate-500 italic">
                          No matching skills found yet. Review missing skills below.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills with 1-Click Add */}
                  <div className="space-y-3 border-t border-slate-800 pt-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Missing Keywords to Add ({analysis.missingSkills.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-500">Click &quot;+&quot; to add to profile</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAddSkillToProfile(sk)}
                          className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer group"
                          title={`Add "${sk}" to your profile skills`}
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform" />
                          <span>{sk}</span>
                        </button>
                      ))}
                      {analysis.missingSkills.length === 0 && (
                        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fantastic! Your profile covers all detected required skills for this job.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bullets" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Copy these ATS-optimized accomplishment statements tailored to this position. Paste them directly into your resume under your relevant work experience entries.
                  </p>

                  <div className="space-y-3">
                    {analysis.suggestedBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          &bull; {bullet}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet, idx)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                          title="Copy bullet point"
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
                      className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                        tip.passed
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-slate-950/80 border-slate-800"
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
                          <h5 className="text-xs font-bold text-white">{tip.title}</h5>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${tip.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                            {tip.passed ? "Optimized" : "Action Needed"}
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
          title="Candidate Resume Document"
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
