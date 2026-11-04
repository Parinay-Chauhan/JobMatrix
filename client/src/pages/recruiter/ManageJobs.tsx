import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState, Pagination, Input } from "../../components/common";

const PAGE_SIZE = 8;

export const ManageJobs: React.FC = () => {
  const { data: jobs = [], isLoading: loading, error } = useRecruiterJobsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to fetch your posted jobs."
    : null;

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        (job.category && job.category.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        (job.requirements && job.requirements.some((r) => r.toLowerCase().includes(query)))
    );
  }, [jobs, searchQuery]);

  const totalPositions = useMemo(() => {
    return jobs.reduce((acc, job) => acc + (job.positions || 1), 0);
  }, [jobs]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 rounded-2xl border border-white/[0.08] bg-slate-900/40 animate-pulse p-6 sm:p-8 space-y-4">
          <Skeleton className="h-6 w-32 bg-slate-800" />
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-4 w-96 bg-slate-800" />
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-6 space-y-4">
          <Skeleton className="h-10 w-full bg-slate-800" />
          <Skeleton className="h-14 w-full bg-slate-800" />
          <Skeleton className="h-14 w-full bg-slate-800" />
          <Skeleton className="h-14 w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner - Vercel / Linear SaaS style */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hiring inventory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Manage job postings
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Track candidate pipelines, monitor application volume, and manage open positions across your team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/recruiter/jobs/new">
              <Button
                variant="primary"
                size="md"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-400/30 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                <span>Post new job</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/[0.06]">
          <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] font-medium text-slate-400">Total postings</div>
            <div className="text-lg font-semibold text-white font-mono tabular-nums">{jobs.length}</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] font-medium text-slate-400">Open seats</div>
            <div className="text-lg font-semibold text-blue-400 font-mono tabular-nums">{totalPositions}</div>
          </div>
          <div className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] font-medium text-slate-400">Filtered results</div>
            <div className="text-lg font-semibold text-emerald-400 font-mono tabular-nums">{filteredJobs.length}</div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-medium border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No job postings yet"
          description="Create your first job listing to attract qualified candidates."
          action={
            <Link to="/recruiter/jobs/new">
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_20px_rgba(37,99,235,0.35)]"
              >
                Post a job now
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-xl border border-white/[0.08] bg-slate-900/60 p-3 sm:p-4 backdrop-blur-md">
            <div className="w-full sm:w-96 relative">
              <Input
                placeholder="Filter by role, category, location, or skill..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-slate-950/80 border-white/[0.08] text-white placeholder:text-slate-500 pl-9 pr-8 text-sm focus:border-blue-500/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-xs text-slate-400 font-normal self-end sm:self-center font-mono tabular-nums">
              Showing <span className="text-white font-medium">{filteredJobs.length}</span> of{" "}
              <span className="text-slate-400">{jobs.length}</span> listings
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              onApplySuggestion={(suggested) => setSearchQuery(suggested)}
              onSearchAgain={() => {
                setSearchQuery("");
                const input = document.querySelector('input[placeholder*="Filter"]') as HTMLInputElement;
                input?.focus();
              }}
              onBrowsePopular={() => setSearchQuery("")}
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile View: Experience Timeline Cards (md:hidden) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group relative rounded-xl border border-white/[0.08] bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 backdrop-blur-md transition-all duration-200 hover:border-white/[0.16] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <h3 className="font-semibold text-white text-base truncate group-hover:text-blue-300 transition-colors">
                          {(job.title || "").replace(/\s+\d{10,14}$/, "")}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-blue-400 font-medium">{job.category || "General"}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300">{job.jobType || "Full-time"}</span>
                        </div>
                      </div>
                      {job.experienceLevel && (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-slate-300">
                          {job.experienceLevel}
                        </span>
                      )}
                    </div>

                    {/* Modern Skill Tags */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.requirements.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requirements.length > 4 && (
                          <span className="text-[11px] font-mono px-1.5 py-0.5 text-slate-500">
                            +{job.requirements.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Timeline & Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                      <span className="inline-flex items-center gap-1 bg-slate-950 border border-white/[0.06] px-2 py-0.5 rounded-md text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location || "Remote"}</span>
                      </span>
                      {job.workMode && (
                        <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md">
                          {job.workMode}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 bg-slate-950 border border-white/[0.06] px-2 py-0.5 rounded-md text-slate-300 font-mono tabular-nums">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{job.positions || 1} open</span>
                      </span>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-slate-500 font-mono tabular-nums flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                      </span>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all"
                        >
                          <span>Applicants</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Elevated Table Layout (hidden md:block) */}
              <div className="hidden md:block rounded-2xl border border-white/[0.08] bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/70 border-b border-white/[0.08] text-xs font-medium text-slate-400">
                        <th className="px-6 py-3.5">Job role & skills</th>
                        <th className="px-6 py-3.5">Experience & mode</th>
                        <th className="px-6 py-3.5">Location</th>
                        <th className="px-6 py-3.5">Positions</th>
                        <th className="px-6 py-3.5">Posted timeline</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-sm">
                      {paginatedJobs.map((job) => (
                        <tr
                          key={job._id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Role & Skills */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                              {(job.title || "").replace(/\s+\d{10,14}$/, "")}
                            </div>
                            <div className="text-xs text-blue-400 font-normal mt-0.5">
                              {job.category || "General"}
                            </div>
                            {/* Skill Tags */}
                            {job.requirements && job.requirements.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {job.requirements.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.requirements.length > 3 && (
                                  <span className="text-[10px] font-mono px-1 text-slate-500 self-center">
                                    +{job.requirements.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Experience & Mode */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5 items-start">
                              {job.experienceLevel ? (
                                <span className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] text-slate-200 px-2 py-0.5 rounded-md text-xs font-medium">
                                  <Briefcase className="w-3 h-3 text-slate-400" />
                                  <span>{job.experienceLevel}</span>
                                </span>
                              ) : (
                                <span className="inline-block bg-slate-950 border border-white/[0.08] text-slate-300 px-2 py-0.5 rounded-md text-xs font-normal">
                                  {job.jobType || "Full-time"}
                                </span>
                              )}

                              <div className="flex items-center gap-1.5">
                                {job.workMode && (
                                  <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                    {job.workMode}
                                  </span>
                                )}
                                {job.experienceLevel && (
                                  <span className="text-xs text-slate-400 font-normal">
                                    {job.jobType || "Full-time"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-4 text-slate-300 text-xs">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{job.location || "Remote"}</span>
                            </div>
                          </td>

                          {/* Positions */}
                          <td className="px-6 py-4 text-slate-300 text-xs font-mono tabular-nums">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{job.positions || 1} open</span>
                            </div>
                          </td>

                          {/* Posted Timeline */}
                          <td className="px-6 py-4 text-slate-400 text-xs font-mono tabular-nums">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                              <Button
                                variant="primary"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all"
                              >
                                <span>Applicants</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-4 flex justify-center">
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
      )}
    </div>
  );
};

export default ManageJobs;
