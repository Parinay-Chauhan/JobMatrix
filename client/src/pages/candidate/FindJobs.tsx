import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useJobsQuery, useMyApplicationsQuery, useApplyJobMutation } from "../../hooks/queries";
import {
  JobCard,
  JobCardSkeleton,
  EmptyState,
  Input,
  Select,
  Pagination,
} from "../../components/common";

const PAGE_SIZE = 6;

export const FindJobs: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // TanStack Queries
  const { data: jobs = [], isLoading: loadingJobs } = useJobsQuery();
  const { data: myApplications = [], isLoading: loadingApps } = useMyApplicationsQuery();

  // Apply Job Mutation
  const applyMutation = useApplyJobMutation();

  const appliedJobIds = useMemo(() => {
    return myApplications
      .map((app) => (typeof app.job === "object" ? app.job?._id : app.job))
      .filter((id): id is string => Boolean(id));
  }, [myApplications]);

  const handleApply = (jobId: string) => {
    applyMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success("Application submitted successfully!", {
          description: "Check 'My Applications' to track its status.",
        });
      },
      onError: (err: unknown) => {
        const errResponse = (err as { response?: { data?: { message?: string; error?: string } } })?.response;
        const errorMsg =
          errResponse?.data?.message ||
          errResponse?.data?.error ||
          "Failed to apply for this job.";

        toast.error("Application Failed", {
          description: errorMsg,
        });
      },
    });
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) cats.add(j.category);
    });
    return Array.from(cats);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        !selectedCategory || job.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchType =
        !selectedJobType || job.jobType?.toLowerCase() === selectedJobType.toLowerCase();

      return matchSearch && matchCategory && matchType;
    });
  }, [jobs, searchTerm, selectedCategory, selectedJobType]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const loading = loadingJobs || loadingApps;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore Job Opportunities
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover vetted tech, product, and engineering roles matching your profile.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by title, skill, or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          <Select
            value={selectedJobType}
            onChange={(e) => {
              setSelectedJobType(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "All Job Types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Remote", label: "Remote" },
            ]}
          />
        </div>
      </div>

      {/* Job Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description={
            searchTerm || selectedCategory || selectedJobType
              ? "Try adjusting your search criteria or filters."
              : "There are currently no active job postings available."
          }
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job._id);
              const isApplyingThisJob =
                !isApplied && applyMutation.isPending && applyMutation.variables === job._id;

              return (
                <JobCard
                  key={job._id}
                  job={job}
                  isApplied={isApplied}
                  isLoading={isApplyingThisJob}
                  onAction={handleApply}
                />
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredJobs.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  );
};

export default FindJobs;
