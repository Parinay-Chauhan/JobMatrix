import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, X, Filter } from "lucide-react";
import { useJobContext } from "../../context/JobContext";
import { JobCard, JobCardSkeleton, EmptyState } from "../common";

export const JobListingsSection: React.FC = () => {
  const {
    filteredJobs,
    loading,
    searchTitle,
    setSearchTitle,
    searchLocation,
    setSearchLocation,
    searchExperience,
    setSearchExperience,
    clearFilters,
  } = useJobContext();
  const navigate = useNavigate();

  const activeSearchQuery = searchTitle || searchLocation || searchExperience;

  return (
    <div id="jobs" className="bg-slate-950 flex-1 w-full border-t border-white/10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide mb-3">
              <Filter className="w-4 h-4" />
              <span>Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Latest job openings
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-2 font-normal leading-relaxed">
              Explore available opportunities posted by verified tech companies
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors group"
          >
            <span>Post a job opening</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Active Filters Bar (if any filter is applied) */}
        {activeSearchQuery && (
          <div className="flex flex-wrap items-center gap-2 p-3.5 mb-6 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <span className="text-xs text-zinc-400 font-normal mr-1">Active filters:</span>
            {searchTitle && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                <span>keyword: {searchTitle}</span>
                <button
                  type="button"
                  onClick={() => setSearchTitle("")}
                  className="hover:text-white cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchLocation && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                <span>location: {searchLocation}</span>
                <button
                  type="button"
                  onClick={() => setSearchLocation("")}
                  className="hover:text-white cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchExperience && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                <span>experience: {searchExperience}</span>
                <button
                  type="button"
                  onClick={() => setSearchExperience("")}
                  className="hover:text-white cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline ml-2 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            searchQuery={activeSearchQuery || "all"}
            onApplySuggestion={(suggested) => {
              setSearchTitle(suggested);
            }}
            onSearchAgain={() => {
              clearFilters();
              const input = document.querySelector(
                'input[placeholder*="Role"], input[placeholder*="Search"]'
              ) as HTMLInputElement;
              input?.focus();
            }}
            onBrowsePopular={clearFilters}
          />
        ) : (
          /* Job Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                actionText="Apply now"
                onAction={() => navigate("/login")}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListingsSection;
