import React from "react";
import type { Job } from "../../types";
import Button from "./Button";

export interface JobCardProps {
  job: Job;
  actionText?: string;
  isApplied?: boolean;
  isLoading?: boolean;
  onAction?: (jobId: string) => void;
  showDetails?: boolean;
}

export const JobCard: React.FC<JobCardProps> = React.memo(({
  job,
  actionText = "Apply Now",
  isApplied = false,
  isLoading = false,
  onAction,
}) => {
  const companyName =
    (typeof job.recruiter === "object" ? job.recruiter?.companyName : undefined) ||
    job.companyName ||
    "Hiring Company";

  const formattedSalary =
    typeof job.salary === "number"
      ? `₹${job.salary.toLocaleString()}`
      : job.salary || "Competitive";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/80 hover:bg-slate-900 p-6 shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-300 hover:-translate-y-1">
      {/* Subtle top card glow on hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

      <div>
        {/* Top Badges & Date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
              {job.jobType || "Full-time"}
            </span>
            {job.workMode && (
              <span className="rounded-md bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 text-xs font-bold text-teal-300">
                {job.workMode}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            {job.createdAt
              ? new Date(job.createdAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {/* Title & Company */}
        <h3 className="text-lg font-extrabold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {job.title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-emerald-400/90 flex items-center gap-1.5">
          <span>{companyName}</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400 font-normal">{job.category || "General"}</span>
        </p>

        {/* Location & Details */}
        <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">📍</span> {job.location || "Remote / Hybrid"}
          </span>
          {job.experienceLevel && (
            <span className="flex items-center gap-1.5">
              <span className="text-teal-400">💼</span> {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="mt-3 text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Salary</span>
          <span className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
            {formattedSalary}
          </span>
        </div>

        {onAction && (
          <Button
            size="sm"
            variant={isApplied ? "outline" : "primary"}
            disabled={isApplied || isLoading}
            isLoading={isLoading}
            onClick={() => onAction(job._id)}
            className={
              isApplied
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-bold"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 cursor-pointer"
            }
          >
            {isApplied ? "Applied ✓" : actionText}
          </Button>
        )}
      </div>
    </div>
  );
});

export default JobCard;

