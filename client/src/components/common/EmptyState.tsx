import React from "react";
import Button from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 p-12 text-center backdrop-blur-xs ${className}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
        {icon || (
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      )}

      {action ? (
        <div className="mt-6">{action}</div>
      ) : actionText && onAction ? (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary" size="sm">
            {actionText}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
