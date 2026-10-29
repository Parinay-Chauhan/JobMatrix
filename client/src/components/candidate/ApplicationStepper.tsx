import React from "react";
import { Check, Sparkles, X } from "lucide-react";
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
  // Step 2: In Review / Verify
  // Step 3: Decision / Finish

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
        {/* Step 1: Applied / Details */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 ring-2 ring-orange-500/20">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 mt-1.5 tracking-tight">
            Applied
          </span>
        </div>

        {/* Connector Line 1 */}
        <div className="w-8 sm:w-12 h-0.5 -mt-4 bg-orange-500 relative overflow-hidden">
          {/* Subtle flowing light pulse animation on the active line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-marquee" />
        </div>

        {/* Step 2: In Review / Verify */}
        <div className="flex flex-col items-center">
          {isStep2Completed ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 ring-2 ring-orange-500/20">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : isStep2Active ? (
            <div className="relative flex items-center justify-center">
              {/* Pulsing halo ring */}
              <span className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 text-orange-400 border-2 border-orange-500 font-extrabold text-xs flex items-center justify-center shadow-md shadow-orange-500/20 relative z-10 animate-pulse">
                2
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-slate-700/80 text-slate-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
          )}
          <span
            className={`text-[10px] sm:text-[11px] font-bold mt-1.5 tracking-tight ${
              isStep2Active
                ? "text-orange-400"
                : isStep2Completed
                ? "text-slate-200"
                : "text-slate-500"
            }`}
          >
            {isStep2Completed ? "Reviewed" : "In Review"}
          </span>
        </div>

        {/* Connector Line 2 */}
        <div
          className={`w-8 sm:w-12 h-0.5 -mt-4 transition-colors ${
            isStep2Completed
              ? isStep3Completed
                ? "bg-emerald-500"
                : isStep3Rejected
                ? "bg-rose-500"
                : "bg-orange-500"
              : "bg-slate-800"
          }`}
        />

        {/* Step 3: Finish / Decision */}
        <div className="flex flex-col items-center">
          {isStep3Completed ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/40 ring-2 ring-emerald-500/30">
              <Sparkles className="w-4 h-4 fill-current stroke-[2.5]" />
            </div>
          ) : isStep3Rejected ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
              <X className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : isStep3Active ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500/20 animate-ping pointer-events-none" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 text-sky-400 border-2 border-sky-400 font-extrabold text-xs flex items-center justify-center relative z-10 animate-pulse">
                3
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center">
              3
            </div>
          )}
          <span
            className={`text-[10px] sm:text-[11px] font-bold mt-1.5 tracking-tight ${
              isStep3Completed
                ? "text-emerald-400"
                : isStep3Rejected
                ? "text-rose-400"
                : isStep3Active
                ? "text-sky-400"
                : "text-slate-500"
            }`}
          >
            {normalized === "shortlisted"
              ? "Shortlisted"
              : normalized === "accepted"
              ? "Accepted"
              : normalized === "rejected"
              ? "Closed"
              : "Decision"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStepper;
