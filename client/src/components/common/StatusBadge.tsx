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
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      label = normalized === "shortlisted" ? "Shortlisted" : "Accepted";
      break;
    case "reviewed":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      dotColor = "bg-blue-500";
      label = "Reviewed";
      break;
    case "rejected":
      styles = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
      label = "Rejected";
      break;
    case "active":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      label = "Active";
      break;
    case "closed":
      styles = "bg-gray-100 text-gray-700 border-gray-300";
      dotColor = "bg-gray-400";
      label = "Closed";
      break;
    default:
      styles = "bg-amber-50 text-amber-700 border-amber-200";
      dotColor = "bg-amber-500";
      label = "Pending";
      break;
  }

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold capitalize shadow-xs ${sizeStyles[size]} ${styles} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
