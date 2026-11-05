import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  X,
  Filter,
} from "lucide-react";
import type { Job } from "../../types";
import { useJobsQuery, useMyApplicationsQuery, useApplyJobMutation } from "../../hooks/queries";
import {
  JobCard,
  JobCardSkeleton,
  EmptyState,
  Input,
  Select,
  Pagination,
} from "../../components/common";
import { ATSAnalyzerModal } from "../../components/candidate";

const PAGE_SIZE = 20;

export const FindJobs: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);

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

  const handleApply = useCallback((jobId: string) => {
    applyMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success("Application submitted successfully", {
          description: "Track status updates in My Applications.",
        });
      },
      onError: (err: unknown) => {
        const errResponse = (err as { response?: { data?: { message?: string; error?: string } } })?.response;
        const errorMsg =
          errResponse?.data?.message ||
          errResponse?.data?.error ||
          "Failed to apply for this job.";

        toast.error("Application failed", {
          description: errorMsg,
        });
      },
    });
  }, [applyMutation]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) cats.add(j.category);
    });
    return Array.from(cats);
  }, [jobs]);

  const remoteCount = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.workMode?.toLowerCase() === "remote" ||
        j.jobType?.toLowerCase() === "remote" ||
        j.location?.toLowerCase().includes("remote")
    ).length;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof job.recruiter === "object" &&
          job.recruiter?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        !selectedCategory || job.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchType =
        !selectedJobType || job.jobType?.toLowerCase() === selectedJobType.toLowerCase();

      const matchWorkMode =
        !selectedWorkMode || job.workMode?.toLowerCase() === selectedWorkMode.toLowerCase();

      return matchSearch && matchCategory && matchType && matchWorkMode;
    });
  }, [jobs, searchTerm, selectedCategory, selectedJobType, selectedWorkMode]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const loading = loadingJobs || loadingApps;
  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedJobType ? 1 : 0) +
    (selectedWorkMode ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedJobType("");
    setSelectedWorkMode("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Metric Strip */}
      <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Explore positions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified engineering, design, and product roles with transparent requirements and direct team evaluation.
          </p>
        </div>

        {/* 4 Quiet Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Total openings</span>
            <span className="text-2xl font-semibold text-white font-mono tabular-nums mt-1 block">{jobs.length}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Applied roles</span>
            <span className="text-2xl font-semibold text-blue-400 font-mono tabular-nums mt-1 block">{appliedJobIds.length}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Remote roles</span>
            <span className="text-2xl font-semibold text-slate-200 font-mono tabular-nums mt-1 block">{remoteCount}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Job domains</span>
            <span className="text-2xl font-semibold text-slate-200 font-mono tabular-nums mt-1 block">{categories.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Category Chips */}
      <div id="search-bar" className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
        {/* Search & Main Selects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, technology, company, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              rightIcon={
                searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-white transition-colors cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 p-1 rounded-md"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "All domains" },
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
              { value: "", label: "All employment types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Remote", label: "Remote" },
            ]}
          />
        </div>

        {/* Quick Filter Chips & Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters:</span>
            </span>
            <button
              onClick={() => {
                setSelectedWorkMode("");
                setSelectedJobType("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                !selectedWorkMode && !selectedJobType && !selectedCategory
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              All roles
            </button>
            <button
              onClick={() => {
                setSelectedWorkMode("Remote");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedWorkMode === "Remote"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              Remote only
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Full-time");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedJobType === "Full-time"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              Full-time
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Internship");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedJobType === "Internship"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              Internships
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-500/10"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters (<span className="font-mono tabular-nums">{activeFiltersCount}</span>)</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span>Active opportunities</span>
          <span className="text-xs font-mono tabular-nums font-medium px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300">
            {filteredJobs.length}
          </span>
        </h2>

        {filteredJobs.length > 0 && (
          <p className="text-xs text-slate-400">
            Page <span className="font-mono tabular-nums font-medium text-white">{currentPage}</span> of{" "}
            <span className="font-mono tabular-nums font-medium text-white">{totalPages}</span>
          </p>
        )}
      </div>

      {/* Job Grid */}
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
          searchQuery={searchTerm || (activeFiltersCount > 0 ? selectedCategory || selectedJobType || selectedWorkMode || "search" : undefined)}
          onApplySuggestion={(suggested) => setSearchTerm(suggested)}
          onSearchAgain={() => {
            handleResetFilters();
            const input = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            input?.focus();
          }}
          onBrowsePopular={handleResetFilters}
        />
      ) : (
        <div className="space-y-6">
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
                  onOpenATS={setSelectedAtsJob}
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

      {/* ATS Match Analyzer Modal */}
      <ATSAnalyzerModal
        job={selectedAtsJob}
        isOpen={Boolean(selectedAtsJob)}
        onClose={() => setSelectedAtsJob(null)}
        onApply={handleApply}
        isApplied={selectedAtsJob ? appliedJobIds.includes(selectedAtsJob._id) : false}
      />
    </div>
  );
};

export default FindJobs;
