import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Sparkles,
  Share2,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { useJobDetailQuery } from "../hooks/queries/useJobsQuery";
import {
  useMyApplicationsQuery,
  useApplyJobMutation,
} from "../hooks/queries/useApplicationsQuery";
import { useAuth } from "../context/AuthContext";
import { Button, LoadingSpinner } from "../components/common";
import { ATSAnalyzerModal } from "../components/candidate";
import { queryKeys } from "../hooks/queryKeys";
import type { Job } from "../types";
import { toast } from "sonner";

export const JobDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isATSModalOpen, setIsATSModalOpen] = useState(false);

  // 1. Check if job was passed directly in router state (0ms instant transition)
  const stateJob = (location.state as { job?: Job } | undefined)?.job;

  // 2. Check if job exists in React Query list cache
  const cachedJobs =
    queryClient.getQueryData<Job[]>(queryKeys.jobs.all) ||
    queryClient.getQueryData<Job[]>(queryKeys.jobs.list()) ||
    [];
  const cachedJob = cachedJobs.find((j) => (j._id || (j as any).id) === id);

  // 3. Fetch Job Details from server with fallback to state/cache
  const { data: serverJob, isLoading } = useJobDetailQuery(id);

  const job = serverJob || stateJob || cachedJob;

  // 4. Applications check - strictly enabled ONLY for candidates to prevent 401 unauth resets
  const { data: myApplications = [] } = useMyApplicationsQuery({
    enabled: Boolean(user?.role === "candidate"),
  });
  const applyMutation = useApplyJobMutation();

  const isApplied = Boolean(
    job &&
      user?.role === "candidate" &&
      myApplications.some(
        (app) => (typeof app.job === "object" ? app.job?._id : app.job) === (job._id || (job as any).id)
      )
  );

  const companyName =
    (typeof job?.recruiter === "object" ? job?.recruiter?.companyName : undefined) ||
    job?.companyName ||
    "Hiring organization";

  const formattedSalary =
    typeof job?.salary === "number"
      ? `₹${job.salary.toLocaleString()}`
      : job?.salary || "Competitive";

  const handleApply = () => {
    if (!user) {
      toast.info("Sign in required", {
        description: "Please sign in as a candidate to apply for this role.",
      });
      navigate("/login");
      return;
    }

    if (user.role === "recruiter") {
      toast.info("Recruiter account", {
        description: "Recruiter accounts cannot apply to job postings.",
      });
      return;
    }

    const targetJobId = job?._id || (job as any)?.id;
    if (!targetJobId) return;

    applyMutation.mutate(targetJobId, {
      onSuccess: () => {
        toast.success("Application submitted successfully", {
          description: "You can track real-time status in My Applications.",
        });
      },
      onError: (err: unknown) => {
        const errResponse = (err as { response?: { data?: { message?: string; error?: string } } })?.response;
        const errorMsg =
          errResponse?.data?.message ||
          errResponse?.data?.error ||
          "Failed to submit application. Please try again.";
        toast.error("Application failed", { description: errorMsg });
      },
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard", {
        description: "Share this verified job posting with colleagues.",
      });
    }
  };

  // Only show loading if we have zero data from state, cache, or server
  if (isLoading && !job) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-xs font-mono text-slate-400">Loading job details...</p>
      </div>
    );
  }

  // If loading finished and no job was found anywhere
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 max-w-md w-full backdrop-blur-md">
          <h2 className="text-xl font-bold text-white tracking-tight">Job not found</h2>
          <p className="mt-2 text-sm text-slate-400">
            This role may have been closed or filled by the recruiting team.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go back</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(user?.role === "candidate" ? "/candidate/find-jobs" : "/")}
            >
              Browse all jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </button>

          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
            <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Job<span className="text-blue-400">Matrix</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Role Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs font-normal text-slate-300">
                  {job.jobType || "Full-time"}
                </span>
                {job.workMode && (
                  <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                    {job.workMode}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs font-normal text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.experienceLevel}</span>
                  </span>
                )}
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified listing</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                {(job.title || "").replace(/\s+\d{10,14}$/, "")}
              </h1>

              {/* Company & Meta */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400">
                <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>{companyName}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{job.location || "Remote / Hybrid"}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Posted{" "}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </span>
              </div>
            </div>

            {/* Compensation & Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 border-t md:border-t-0 border-white/10 pt-4 md:pt-0 shrink-0">
              <div className="md:text-right">
                <span className="text-xs text-slate-400 block font-normal">
                  Annual Compensation
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                  {formattedSalary}
                </span>
                <span className="text-[11px] text-emerald-400 block font-medium mt-0.5">
                  Transparent compensation band
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Share job link"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {user?.role === "candidate" && (
                  <button
                    type="button"
                    onClick={() => setIsATSModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-300 text-xs font-medium transition-all cursor-pointer active:scale-95"
                    title="Scan resume against this job posting"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>ATS match</span>
                  </button>
                )}

                <Button
                  size="md"
                  variant={isApplied ? "outline" : "primary"}
                  disabled={isApplied || applyMutation.isPending}
                  isLoading={applyMutation.isPending}
                  onClick={handleApply}
                  className={
                    isApplied
                      ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 font-semibold flex items-center gap-1.5 px-5 py-2.5"
                      : "bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all px-6 py-2.5"
                  }
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Applied</span>
                    </>
                  ) : (
                    "Apply now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Description Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Role Description */}
            <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>About the role</span>
              </h2>

              <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal whitespace-pre-line space-y-3">
                {job.description || "No full description provided for this position."}
              </div>
            </section>

            {/* Key Requirements & Technical Qualifications */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Key qualifications & skills</span>
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    {job.requirements.length} requirements
                  </span>
                </div>

                <div className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] flex items-start gap-3 transition-colors hover:border-white/15"
                    >
                      <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* JobMatrix Transparency & Trust Banner */}
            <section className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Verified hiring guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                All roles on JobMatrix undergo automated entity validation and recruiter identity verification. No ghost jobs, duplicate agencies, or unverified commission positions are permitted.
              </p>
            </section>

            {/* Bottom Apply CTA Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-indigo-900/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Ready to take the next step?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Submit your application with deterministic ATS alignment.
                </p>
              </div>

              <Button
                size="md"
                variant={isApplied ? "outline" : "primary"}
                disabled={isApplied || applyMutation.isPending}
                isLoading={applyMutation.isPending}
                onClick={handleApply}
                className={
                  isApplied
                    ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 font-semibold flex items-center gap-1.5"
                    : "bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-md transition-all shrink-0"
                }
              >
                {isApplied ? "Applied" : "Apply now"}
              </Button>
            </div>
          </div>

          {/* Sidebar Overview Column (1 col) */}
          <div className="space-y-6">
            {/* Role Summary Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Role overview
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Compensation</span>
                  <span className="font-semibold text-white font-mono">{formattedSalary}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Employment</span>
                  <span className="font-medium text-slate-200">{job.jobType || "Full-time"}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Work model</span>
                  <span className="font-medium text-blue-300">{job.workMode || "Remote"}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Experience tier</span>
                  <span className="font-medium text-slate-200">{job.experienceLevel || "Mid-level"}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Domain</span>
                  <span className="font-medium text-slate-200">{job.category || "Engineering"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-slate-200 text-right">{job.location || "Remote"}</span>
                </div>
              </div>
            </div>

            {/* Hiring Organization Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Hiring organization
              </h3>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{companyName}</h4>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Employer
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Direct hiring team on JobMatrix. Applications are processed with deterministic ATS evaluation.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ATS Match Modal - only mounted if user is logged in as candidate and explicitly opened */}
      {isATSModalOpen && user?.role === "candidate" && (
        <ATSAnalyzerModal
          job={job}
          isOpen={isATSModalOpen}
          onClose={() => setIsATSModalOpen(false)}
          onApply={handleApply}
          isApplied={isApplied}
        />
      )}
    </div>
  );
};

export default JobDetails;
