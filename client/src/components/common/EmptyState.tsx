import React, { useState } from "react";
import Button from "./Button";
import { getDidYouMeanSuggestion, POPULAR_TOPICS } from "../../utils/searchSuggestions";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;

  // Helpful Search Error Props (Pattern 10 - Turn dead ends into a way forward)
  searchQuery?: string;
  suggestedQuery?: string;
  onApplySuggestion?: (query: string) => void;
  onSearchAgain?: () => void;
  onBrowsePopular?: () => void;
  popularTopics?: string[];
  showWhyItWorks?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  action,
  className = "",
  searchQuery,
  suggestedQuery,
  onApplySuggestion,
  onSearchAgain,
  onBrowsePopular,
  popularTopics = POPULAR_TOPICS,
  showWhyItWorks = true,
}) => {
  const [showTopics, setShowTopics] = useState(false);

  // Determine if this is an empty search state
  const isSearchEmpty = Boolean(searchQuery && searchQuery.trim().length > 0);

  // Calculate intelligent "Did you mean" typo correction
  const didYouMean =
    suggestedQuery || (isSearchEmpty ? getDidYouMeanSuggestion(searchQuery!) : null);

  const displayTitle =
    title || (isSearchEmpty ? `No results for “${searchQuery}”` : "No items found");

  const handleBrowseTopicsClick = () => {
    setShowTopics((prev) => !prev);
    if (onBrowsePopular) {
      onBrowsePopular();
    }
  };

  if (isSearchEmpty) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden ${className}`}
      >
        {/* Soft background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pattern 10 Header Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>Smart Search Assistant</span>
        </div>

        {/* Sad Document Icon with Red Alert Badge (exact match to reference) */}
        <div className="relative mb-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            {/* Document sheet with folded corner & sad expression */}
            <div className="w-10 h-12 bg-white rounded-md relative shadow-md flex flex-col items-center justify-center">
              {/* Folded corner */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-slate-300 rounded-bl-sm" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-3 border-r-3 border-white pointer-events-none" />

              {/* Sad face */}
              <div className="flex items-center gap-2 mb-1 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
              <div className="w-3.5 h-1.5 border-t-2 border-slate-800 rounded-t-full" />
            </div>
          </div>

          {/* Red Alert Badge at bottom right of icon */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-extrabold text-xs shadow-lg border-2 border-slate-900 animate-in zoom-in-75">
            !
          </div>
        </div>

        {/* Main Heading */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {displayTitle}
        </h3>

        {/* Did you mean suggestion OR description */}
        {didYouMean ? (
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Did you mean{" "}
            <button
              type="button"
              onClick={() => onApplySuggestion?.(didYouMean)}
              className="font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 decoration-orange-400/80 transition-colors cursor-pointer"
            >
              {didYouMean}
            </button>
            ?
          </p>
        ) : description ? (
          <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed font-normal">
            {description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Check your spelling or try searching for another role or skill.
          </p>
        )}

        {/* Action Buttons (Orange Primary + Outlined Secondary) */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={onSearchAgain || onAction}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
            }}
          >
            Search again
          </button>

          <button
            type="button"
            onClick={handleBrowseTopicsClick}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm text-orange-400 hover:text-orange-300 bg-slate-800/80 hover:bg-slate-800 border border-orange-500/30 transition-all duration-200 cursor-pointer"
          >
            Browse popular topics
          </button>
        </div>

        {/* Interactive Popular Topics Pills */}
        {showTopics && popularTopics.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800 w-full max-w-md animate-in fade-in duration-200">
            <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">
              Popular Searches
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onApplySuggestion?.(topic)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-700 hover:border-orange-500/40 transition-all cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* "Why it works" Educational Card (exact match to reference image) */}
        {showWhyItWorks && (
          <div className="mt-8 w-full max-w-md rounded-2xl bg-slate-950/70 border border-slate-800 p-4 text-left flex items-start gap-3.5 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-white tracking-wide">Why it works</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Explaining what went wrong and what to try next keeps people from leaving.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Fallback EmptyState for non-search views
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/60 bg-slate-950/80 p-12 text-center backdrop-blur-md ${className}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
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

      <h3 className="text-lg font-bold text-white">{title || "No items found"}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-400 leading-relaxed">
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
