import React, { forwardRef } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-none ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 hover:border-gray-400 focus:border-indigo-600 focus:ring-indigo-100"
          } ${className}`}
          {...props}
        />

        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
