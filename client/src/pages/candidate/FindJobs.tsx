import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Globe,
  Layers,
  Search,
  X,
  Building2,
  GraduationCap,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { useJobsQuery, useMyApplicationsQuery, useApplyJobMutation } from "../../hooks/queries";
import { useAuth } from "../../context/AuthContext";
import {
  JobCard,
  JobCardSkeleton,
  EmptyState,
  Input,
  Select,
  Pagination,
} from "../../components/common";

const PAGE_SIZE = 20;

export const FindJobs: React.FC = () => {
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
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
        toast.success("Application submitted successfully.", {
          description: "You can track status updates in 'My Applications'.",
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Metric Strip */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span>Career Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore Available Positions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Browse verified engineering, design, and product roles with transparent compensation and direct team evaluation.
            </p>
          </div>
        </div>

        {/* 4 Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-7 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Total Openings</span>
              <span className="text-base sm:text-lg font-bold text-white">{jobs.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Applied Roles</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">{appliedJobIds.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Remote Roles</span>
              <span className="text-base sm:text-lg font-bold text-cyan-300">{remoteCount}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Job Domains</span>
              <span className="text-base sm:text-lg font-bold text-white">{categories.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Category Chips */}
      <div id="search-bar" className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-4">
        {/* Search & Main Selects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
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
                    className="hover:text-white transition-colors cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 p-1 rounded"
                    title="Clear search"
                  >
                    <X className="w-3 h-3 text-slate-400" />
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
              { value: "", label: "All Domains" },
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
              { value: "", label: "All Employment Types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Remote", label: "Remote" },
            ]}
          />
        </div>

        {/* Quick Filter Chips & Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Quick Filters:</span>
            </span>
            <button
              onClick={() => {
                setSelectedWorkMode("");
                setSelectedJobType("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !selectedWorkMode && !selectedJobType && !selectedCategory
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => {
                setSelectedWorkMode("Remote");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedWorkMode === "Remote"
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Remote Only
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Full-time");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedJobType === "Full-time"
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Full-time
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Internship");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedJobType === "Internship"
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Internships
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-500/10"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Active Opportunities</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {filteredJobs.length}
          </span>
        </h2>

        {filteredJobs.length > 0 && (
          <p className="text-xs text-slate-400">
            Showing page <span className="font-semibold text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
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
          title="No jobs matching your criteria"
          description={
            activeFiltersCount > 0
              ? "Adjust your search keywords or clear applied filters to view more available roles."
              : "There are currently no active job postings matching your parameters."
          }
          action={
            activeFiltersCount > 0 ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            ) : undefined
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
