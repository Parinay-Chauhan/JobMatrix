import React from "react";
import { MapPin, Briefcase, Building2, Check, Sparkles } from "lucide-react";
import type { Job } from "../../types";
import Button from "./Button";

export interface JobCardProps {
  job: Job;
  actionText?: string;
  isApplied?: boolean;
  isLoading?: boolean;
  onAction?: (jobId: string) => void;
  showDetails?: boolean;
  onOpenATS?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = React.memo(({
  job,
  actionText = "Apply now",
  isApplied = false,
  isLoading = false,
  onAction,
  onOpenATS,
}) => {
  const companyName =
    (typeof job.recruiter === "object" ? job.recruiter?.companyName : undefined) ||
    job.companyName ||
    "Hiring organization";

  const formattedSalary =
    typeof job.salary === "number"
      ? `₹${job.salary.toLocaleString()}`
      : job.salary || "Competitive";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/70 hover:bg-slate-900/95 p-5 sm:p-6 backdrop-blur-md hover:border-white/[0.16] hover:shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-200">
      <div>
        {/* Top Badges & Date & ATS Trigger */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-xs font-normal text-slate-300">
              {job.jobType || "Full-time"}
            </span>
            {job.workMode && (
              <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                {job.workMode}
              </span>
            )}
            {job.experienceLevel && (
              <span className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-xs font-normal text-slate-300 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                <span>{job.experienceLevel}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenATS && (
              <button
                type="button"
                onClick={() => onOpenATS(job)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-medium transition-all cursor-pointer active:scale-95"
                title="Analyze ATS match and get tailored resume keywords"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>ATS match</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "Recent"}
            </span>
          </div>
        </div>

        {/* Title & Company */}
        <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
          {(job.title || "").replace(/\s+\d{10,14}$/, "")}
        </h3>
        <p className="mt-1 text-xs text-blue-400 font-normal flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-blue-400/80" />
          <span>{companyName}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{job.category || "Engineering"}</span>
        </p>

        {/* Location & Details */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location || "Remote / Hybrid"}</span>
          </span>
        </div>

        {/* Modern Skill Tags */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.requirements.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300"
              >
                {skill}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500 self-center">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {job.description && (
          <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-normal">Compensation</span>
          <span className="text-sm font-semibold text-white font-mono tabular-nums">
            {formattedSalary}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAction && (
            <Button
              size="sm"
              variant={isApplied ? "outline" : "primary"}
              disabled={isApplied || isLoading}
              isLoading={isLoading}
              onClick={() => onAction(job._id)}
              className={
                isApplied
                  ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 font-medium flex items-center gap-1.5"
                  : "bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all"
              }
            >
              {isApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </>
              ) : (
                actionText
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default JobCard;
