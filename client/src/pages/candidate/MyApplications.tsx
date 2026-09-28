import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  AlertCircle,
  Building2,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useMyApplicationsQuery } from "../../hooks/queries";
import { StatusBadge, Skeleton, EmptyState, Button, Pagination } from "../../components/common";

const PAGE_SIZE = 6;

export const MyApplications: React.FC = () => {
  const { data: applications = [], isLoading: loading, error } = useMyApplicationsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to load submitted applications."
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Stats Strip */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span>Application Status Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Track live recruiter decisions, review progress, and status logs across all submitted roles.
            </p>
          </div>

          <Link to="/candidate/find-jobs">
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            >
              + Browse Open Positions
            </Button>
          </Link>
        </div>

        {/* 4 Application Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-7 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Total Submitted</span>
              <span className="text-lg font-bold text-white">{stats.total}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Under Review</span>
              <span className="text-lg font-bold text-amber-400">{stats.pending}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Shortlisted / Offered</span>
              <span className="text-lg font-bold text-emerald-400">{stats.shortlisted}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Archived / Closed</span>
              <span className="text-lg font-bold text-slate-400">{stats.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-semibold border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted"
          description="You haven't submitted any job applications yet. Explore active roles in the directory to get started."
          action={
            <Link to="/candidate/find-jobs">
              <Button
                variant="primary"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                Explore Active Positions
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {paginatedApps.map((app) => {
            const job = typeof app.job === "object" ? app.job : null;
            const title = job?.title || "Position Title Unavailable";
            const location = job?.location || "Remote / Hybrid";
            const jobType = job?.jobType || "Full-time";
            const companyName =
              (typeof job?.recruiter === "object" ? job?.recruiter?.companyName : undefined) ||
              job?.companyName ||
              "Hiring Organization";

            return (
              <div
                key={app._id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{companyName}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-slate-300">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{jobType}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
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
