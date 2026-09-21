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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div>
        {/* Top Badges & Date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {job.jobType || "Full-time"}
            </span>
            {job.workMode && (
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {job.workMode}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-gray-400 shrink-0">
            {job.createdAt
              ? new Date(job.createdAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {/* Title & Company */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {job.title}
        </h3>
        <p className="mt-0.5 text-xs font-semibold text-indigo-600">
          {companyName} &bull; {job.category || "General"}
        </p>

        {/* Location & Details */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            📍 {job.location || "Remote / Hybrid"}
          </span>
          {job.experienceLevel && (
            <span className="flex items-center gap-1">
              💼 {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="mt-3 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <span className="text-xs text-gray-400 block">Salary</span>
          <span className="text-sm font-bold text-gray-900">
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
          >
            {isApplied ? "Applied ✓" : actionText}
          </Button>
        )}
      </div>
    </div>
  );
});

export default JobCard;
