import React from "react";
import type { ApplicationStatus } from "../../types";

export interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "pending",
  size = "md",
  className = "",
}) => {
  const normalized = status?.toLowerCase() || "pending";

  let styles: string;
  let label: string;
  let dotColor: string;

  switch (normalized) {
    case "accepted":
    case "shortlisted":
      styles = "bg-blue-500/10 text-blue-300 border-blue-500/30";
      dotColor = "bg-blue-400 shadow-xs shadow-blue-400";
      label = normalized === "shortlisted" ? "Shortlisted" : "Accepted";
      break;
    case "reviewed":
      styles = "bg-sky-500/10 text-sky-300 border-sky-500/30";
      dotColor = "bg-sky-400 shadow-xs shadow-sky-400";
      label = "Reviewed";
      break;
    case "rejected":
      styles = "bg-rose-500/10 text-rose-300 border-rose-500/30";
      dotColor = "bg-rose-400 shadow-xs shadow-rose-400";
      label = "Rejected";
      break;
    case "active":
      styles = "bg-blue-500/10 text-blue-300 border-blue-500/30";
      dotColor = "bg-blue-400 shadow-xs shadow-blue-400";
      label = "Active";
      break;
    case "closed":
      styles = "bg-slate-800 text-slate-400 border-slate-700";
      dotColor = "bg-slate-500";
      label = "Closed";
      break;
    default:
      styles = "bg-amber-500/10 text-amber-300 border-amber-500/30";
      dotColor = "bg-amber-400 shadow-xs shadow-amber-400";
      label = "Pending";
      break;
  }

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border capitalize shadow-xs ${sizeStyles[size]} ${styles} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};

export default StatusBadge;

