import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState, StatusBadge } from "../../components/common";

export const RecruiterDashboard: React.FC = () => {
  const { data: jobs = [], isLoading: loading } = useRecruiterJobsQuery();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Recruiter dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Manage your company's open opportunities, track active candidates, and evaluate incoming applicant submissions.
          </p>
        </div>

        <Link to="/recruiter/jobs/new">
          <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>Post job</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">
              Total posted jobs
            </p>
            <h3 className="text-2xl font-semibold text-white font-mono tabular-nums mt-0.5">
              {jobs.length}
            </h3>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">
              Hiring status
            </p>
            <div className="mt-1">
              <StatusBadge status="active" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Pipeline
              </p>
              <Link
                to="/recruiter/jobs"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 mt-1 group"
              >
                <span>Job manager</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posted Jobs */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-white text-xs sm:text-sm">Recent job postings</h2>
          </div>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View all (<span className="font-mono tabular-nums">{jobs.length}</span>)</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No jobs posted yet"
              description="Create your first job listing to start receiving qualified candidate profiles."
              action={
                <Link to="/recruiter/jobs/new">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3.5 py-1.5"
                  >
                    + Post a job
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-800/30 transition-colors group"
              >
                <div className="space-y-1">
                  <h3 className="font-medium text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                    {(job.title || "").replace(/\s+\d{10,14}$/, "")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-slate-300 text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location || "Remote"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-slate-300 text-[11px] font-medium">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{job.category || "General"}</span>
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 text-[11px] font-mono tabular-nums">
                      <Calendar className="w-3 h-3" />
                      <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg"
                    >
                      <Users className="w-3.5 h-3.5 mr-1" />
                      <span>View applicants</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
