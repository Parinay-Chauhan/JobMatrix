import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyApplicationsQuery } from "../../hooks/queries";
import { StatusBadge, Skeleton, EmptyState, Button, Pagination } from "../../components/common";

const PAGE_SIZE = 6;

export const MyApplications: React.FC = () => {
  const { data: applications = [], isLoading: loading, error } = useMyApplicationsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to load your submitted applications."
    : null;

  const totalPages = Math.ceil(applications.length / PAGE_SIZE) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return applications.slice(start, start + PAGE_SIZE);
  }, [applications, currentPage]);

  const stats = useMemo(() => {
    let pending = 0;
    let shortlisted = 0;
    let rejected = 0;

    applications.forEach((app) => {
      const s = app.status?.toLowerCase();
      if (s === "accepted" || s === "shortlisted") shortlisted++;
      else if (s === "rejected") rejected++;
      else pending++;
    });

    return { total: applications.length, pending, shortlisted, rejected };
  }, [applications]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Stats Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Application Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              My Job Applications
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              Track live recruiter decisions and interview updates across your submitted applications.
            </p>
          </div>

          <Link to="/candidate/find-jobs">
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
            >
              + Browse More Jobs
            </Button>
          </Link>
        </div>

        {/* 4 Application Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium block">Total Submitted</span>
            <span className="text-xl font-black text-white">{stats.total}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium block">Under Review</span>
            <span className="text-xl font-black text-amber-400">{stats.pending}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium block">Shortlisted / Won</span>
            <span className="text-xl font-black text-emerald-400">{stats.shortlisted}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium block">Archived / Rejected</span>
            <span className="text-xl font-black text-slate-400">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl text-sm font-bold border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="You haven't applied to any job openings yet. Discover handpicked opportunities and send your first application."
          action={
            <Link to="/candidate/find-jobs">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
              >
                Explore Open Roles
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {paginatedApps.map((app) => {
            const job = typeof app.job === "object" ? app.job : null;
            const title = job?.title || "Job Title Unavailable";
            const location = job?.location || "Remote / Not Specified";
            const jobType = job?.jobType || "Full-time";
            const companyName =
              (typeof job?.recruiter === "object" ? job?.recruiter?.companyName : undefined) ||
              job?.companyName ||
              "Hiring Company";

            return (
              <div
                key={app._id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    {companyName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1 text-slate-300">
                      📍 {location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1 text-slate-300">
                      💼 {jobType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      📅 Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <StatusBadge status={app.status} size="md" />
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={applications.length}
              pageSize={PAGE_SIZE}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

