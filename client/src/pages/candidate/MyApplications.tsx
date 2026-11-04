import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useMyApplicationsQuery } from "../../hooks/queries";
import { Skeleton, EmptyState, Button, Pagination } from "../../components/common";
import { ApplicationStepper } from "../../components/candidate";

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Stats Strip */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              My applications
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Track live review decisions and status updates across your submitted applications.
            </p>
          </div>

          <Link to="/candidate/find-jobs">
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
              Browse positions
            </Button>
          </Link>
        </div>

        {/* 4 Quiet Application Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Total submitted</span>
            <span className="text-2xl font-semibold text-white tabular-nums mt-1 block">{stats.total}</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Under review</span>
            <span className="text-2xl font-semibold text-amber-400 tabular-nums mt-1 block">{stats.pending}</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Shortlisted</span>
            <span className="text-2xl font-semibold text-blue-400 tabular-nums mt-1 block">{stats.shortlisted}</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-medium block">Archived</span>
            <span className="text-2xl font-semibold text-slate-400 tabular-nums mt-1 block">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg text-sm border bg-rose-500/10 border-rose-500/20 text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <Skeleton className="h-5 w-1/3" />
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
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
              >
                Explore positions
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {paginatedApps.map((app) => {
            const job = typeof app.job === "object" ? app.job : null;
            const title = (job?.title || "Position Title Unavailable").replace(/\s+\d{10,14}$/, "");
            const location = job?.location || "Remote / Hybrid";
            const jobType = job?.jobType || "Full-time";
            const companyName =
              (typeof job?.recruiter === "object" ? job?.recruiter?.companyName : undefined) ||
              job?.companyName ||
              "Hiring Organization";

            return (
              <div
                key={app._id}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 transition-colors duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{companyName}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-950/60 border border-slate-800/80 px-2 py-0.5 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-slate-950/60 border border-slate-800/80 px-2 py-0.5 text-slate-300">
                      <Briefcase className="w-3 h-3 text-slate-500" />
                      <span>{jobType}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 ml-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <ApplicationStepper status={app.status} />
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={applications.length}
                pageSize={PAGE_SIZE}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
