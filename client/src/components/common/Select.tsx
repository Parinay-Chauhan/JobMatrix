import React, { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, helperText, className = "", id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative rounded-xl">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-xl border bg-slate-900/90 px-4 py-2.5 text-sm text-white transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-950 disabled:text-slate-600 disabled:cursor-not-allowed pr-10 cursor-pointer ${
              error
                ? "border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20"
                : "border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 focus:ring-emerald-500/20"
            } ${className}`}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white py-1">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;

