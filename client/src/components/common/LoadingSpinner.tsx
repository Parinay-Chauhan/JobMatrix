import React from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "text-indigo-600",
  label,
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <svg
        className={`animate-spin ${sizeMap[size]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <p className="text-sm font-medium text-gray-500">{label}</p>}
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "h-4 w-full" }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`}
    />
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
