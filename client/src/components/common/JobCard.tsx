import React from "react";
import { MapPin, Briefcase, Building2, Check } from "lucide-react";
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
    "Hiring Organization";

  const formattedSalary =
    typeof job.salary === "number"
      ? `₹${job.salary.toLocaleString()}`
      : job.salary || "Competitive";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/80 hover:bg-slate-900 p-6 shadow-xl hover:border-slate-700 transition-all duration-200">
      <div>
        {/* Top Badges & Date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              {job.jobType || "Full-time"}
            </span>
            {job.workMode && (
              <span className="rounded-md bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-xs font-semibold text-teal-300">
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
        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {job.title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>{companyName}</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400 font-normal">{job.category || "Engineering"}</span>
        </p>

        {/* Location & Details */}
        <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{job.location || "Remote / Hybrid"}</span>
          </span>
          {job.experienceLevel && (
            <span className="flex items-center gap-1 text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>{job.experienceLevel}</span>
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
      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Compensation</span>
          <span className="text-sm font-bold text-white">
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
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-bold flex items-center gap-1.5"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
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
  );
});

export default JobCard;
