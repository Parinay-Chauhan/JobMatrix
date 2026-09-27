import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobContext } from "../../context/JobContext";
import { JobCard, JobCardSkeleton, EmptyState } from "../common";

export const JobListingsSection: React.FC = () => {
  const { filteredJobs, loading, clearFilters } = useJobContext();
  const navigate = useNavigate();

  return (
    <div id="jobs" className="bg-gray-50 flex-1 w-full border-t border-gray-200/80">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Latest Job Openings
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Explore available opportunities posted by top companies
            </p>
          </div>

          <Link
            to="/register"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
          >
            Post a Job &rarr;
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty Search State */
          <EmptyState
            title="No jobs found"
            description="Try adjusting your search terms or location filters."
            actionText="Clear Search"
            onAction={clearFilters}
          />
        ) : (
          /* Job Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                actionText="Apply Now"
                onAction={() => navigate("/login")}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
