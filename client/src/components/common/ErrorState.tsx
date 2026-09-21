import React from "react";
import Button from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50/70 p-6 text-center ${className}`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h4 className="text-base font-bold text-red-900">{title}</h4>
      <p className="mt-1 text-sm text-red-700">{message}</p>

      {onRetry && (
        <div className="mt-4">
          <Button onClick={onRetry} variant="danger" size="sm">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
