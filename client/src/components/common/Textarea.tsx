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
            className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full rounded-xl border bg-slate-900/90 px-4 py-2.5 text-sm text-white transition-all duration-150 placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:bg-slate-950 disabled:text-slate-600 disabled:cursor-not-allowed resize-none ${
            error
              ? "border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20"
              : "border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 focus:ring-emerald-500/20"
          } ${className}`}
          {...props}
        />

        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;

