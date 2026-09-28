import React, { useState, useMemo } from "react";
import { toast } from "sonner";
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

const PAGE_SIZE = 6;

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
        toast.success("Application submitted successfully!", {
          description: "Track the recruiter's feedback in 'My Applications'.",
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Candidate Career Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                {user?.fullName?.split(" ")[0] || "Candidate"}
              </span>{" "}
              👋
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Explore verified roles, track application progress, and connect directly with hiring teams.
            </p>
          </div>

          {/* Quick Action */}
          <div className="shrink-0 flex items-center gap-3">
            <a
              href="#search-bar"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Roles</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* 4 Live Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
              💼
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Total Openings</span>
              <span className="text-lg sm:text-xl font-black text-white">{jobs.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-lg shrink-0">
              ⚡
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Applied Jobs</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{appliedJobIds.length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0">
              🌐
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Remote Roles</span>
              <span className="text-lg sm:text-xl font-black text-cyan-300">{remoteCount}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
              🏢
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Job Domains</span>
              <span className="text-lg sm:text-xl font-black text-white">{categories.length || 6}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Quick Category Chips */}
      <div id="search-bar" className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-4">
        {/* Search & Main Selects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, skill, company, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<span className="text-emerald-400">🔍</span>}
              rightIcon={
                searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-white transition-colors cursor-pointer text-xs bg-slate-800 px-1.5 py-0.5 rounded"
                  >
                    ✕
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

        {/* Quick Category Chips & Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Filter:
            </span>
            <button
              onClick={() => {
                setSelectedWorkMode("");
                setSelectedJobType("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !selectedWorkMode && !selectedJobType && !selectedCategory
                  ? "bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => {
                setSelectedWorkMode("Remote");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedWorkMode === "Remote"
                  ? "bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              🌐 Remote Only
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Full-time");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedJobType === "Full-time"
                  ? "bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              💼 Full-Time
            </button>
            <button
              onClick={() => {
                setSelectedJobType("Internship");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedJobType === "Internship"
                  ? "bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              🎓 Internships
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-500/10"
            >
              <span>✕ Reset Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span>Available Positions</span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {filteredJobs.length}
          </span>
        </h2>

        {filteredJobs.length > 0 && (
          <p className="text-xs text-slate-400">
            Page <span className="font-bold text-white">{currentPage}</span> of{" "}
            <span className="font-bold text-white">{totalPages}</span>
          </p>
        )}
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
          title="No jobs matching your criteria"
          description={
            activeFiltersCount > 0
              ? "Try adjusting your search terms or clearing your filters to discover more open roles."
              : "There are currently no active job postings available."
          }
          action={
            activeFiltersCount > 0 ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
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

