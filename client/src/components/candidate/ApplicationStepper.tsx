import React from "react";
import { Check, X } from "lucide-react";
import type { ApplicationStatus } from "../../types";

interface ApplicationStepperProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const ApplicationStepper: React.FC<ApplicationStepperProps> = ({
  status = "pending",
  className = "",
}) => {
  const normalized = status?.toLowerCase() || "pending";

  // Step 1: Applied (always completed once submitted)
  // Step 2: Under Review
  // Step 3: Decision

  const isStep2Completed =
    normalized === "reviewed" ||
    normalized === "shortlisted" ||
    normalized === "accepted" ||
    normalized === "rejected";

  const isStep2Active = normalized === "pending";

  const isStep3Completed =
    normalized === "shortlisted" || normalized === "accepted";

  const isStep3Rejected = normalized === "rejected";
  const isStep3Active = normalized === "reviewed";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Horizontal Steps with Connecting Lines */}
      <div className="flex items-center">
        {/* Step 1: Applied */}
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border border-blue-500/40">
            <Check className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 mt-1.5">
            Applied
          </span>
        </div>

        {/* Connector Line 1 */}
        <div
          className={`w-7 sm:w-10 h-px -mt-4 transition-colors ${
            isStep2Completed || isStep2Active ? "bg-blue-600" : "bg-slate-800"
          }`}
        />

        {/* Step 2: In Review */}
        <div className="flex flex-col items-center">
          {isStep2Completed ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border border-blue-500/40">
              <Check className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          ) : isStep2Active ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/50 font-mono font-medium text-xs flex items-center justify-center">
              2
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border border-slate-800 text-slate-500 font-mono text-xs flex items-center justify-center">
              2
            </div>
          )}
          <span
            className={`text-[10px] sm:text-[11px] font-medium mt-1.5 ${
              isStep2Active
                ? "text-blue-400 font-semibold"
                : isStep2Completed
                ? "text-slate-300"
                : "text-slate-500"
            }`}
          >
            {isStep2Completed ? "Reviewed" : "Review"}
          </span>
        </div>

        {/* Connector Line 2 */}
        <div
          className={`w-7 sm:w-10 h-px -mt-4 transition-colors ${
            isStep3Completed
              ? "bg-emerald-500"
              : isStep3Rejected
              ? "bg-rose-500/80"
              : isStep3Active
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
        />

        {/* Step 3: Decision */}
        <div className="flex flex-col items-center">
          {isStep3Completed ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          ) : isStep3Rejected ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <X className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          ) : isStep3Active ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/50 font-mono font-medium text-xs flex items-center justify-center">
              3
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border border-slate-800 text-slate-500 font-mono text-xs flex items-center justify-center">
              3
            </div>
          )}
          <span
            className={`text-[10px] sm:text-[11px] font-medium mt-1.5 ${
              isStep3Completed
                ? "text-emerald-400 font-semibold"
                : isStep3Rejected
                ? "text-rose-400"
                : isStep3Active
                ? "text-blue-400 font-semibold"
                : "text-slate-500"
            }`}
          >
            {normalized === "shortlisted"
              ? "Shortlisted"
              : normalized === "accepted"
              ? "Accepted"
              : normalized === "rejected"
              ? "Archived"
              : "Decision"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStepper;
