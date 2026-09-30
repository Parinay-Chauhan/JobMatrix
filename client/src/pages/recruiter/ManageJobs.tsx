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
  Sparkles,
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
        (job.location && job.location.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

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
        <Skeleton className="h-10 w-1/3" />
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Job Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track applications, candidate status, and recruitment progress across all listings ({jobs.length} total).
          </p>
        </div>

        <Link to="/recruiter/jobs/new">
          <Button
            variant="primary"
            size="md"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>Post New Job</span>
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-semibold border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-2.5">
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
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                Post a Job Now
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="w-full sm:w-88 relative">
              <Input
                placeholder="Search postings by title or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 pl-9"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="text-xs text-slate-400 font-medium self-end sm:self-center">
              Showing <span className="text-emerald-400 font-bold">{filteredJobs.length}</span> of <span className="text-white font-bold">{jobs.length}</span> postings
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center">
              <p className="text-slate-400 text-sm">No job postings matched "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile View: Job Cards (md:hidden) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {job.title}
                        </h3>
                        <span className="text-xs font-semibold text-emerald-400">
                          {job.category || "General"}
                        </span>
                      </div>
                      <span className="inline-block bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0">
                        {job.jobType || "Full-time"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                      <span className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location || "Remote"}</span>
                      </span>
                      {job.workMode && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
                          {job.workMode}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300 font-semibold">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{job.positions || 1} open</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                      </span>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all"
                        >
                          <span>Applicants</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table Layout (hidden md:block) */}
              <div className="hidden md:block bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Job Role</th>
                        <th className="px-6 py-4">Type & Mode</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Positions</th>
                        <th className="px-6 py-4">Posted Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-sm">
                      {paginatedJobs.map((job) => (
                        <tr
                          key={job._id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-xs text-emerald-400 font-medium mt-0.5">
                              {job.category || "General"}
                            </div>
                          </td>
                          <td className="px-6 py-4 space-x-1.5">
                            <span className="inline-block bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md text-xs font-semibold">
                              {job.jobType || "Full-time"}
                            </span>
                            {job.workMode && (
                              <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-xs font-semibold">
                                {job.workMode}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-300 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.location || "Remote"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.positions || 1} open</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                              <Button
                                variant="primary"
                                size="sm"
                                className="font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all"
                              >
                                <span>Applicants</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
