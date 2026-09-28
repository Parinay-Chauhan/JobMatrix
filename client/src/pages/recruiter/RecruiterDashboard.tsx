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
  Sparkles,
} from "lucide-react";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState, StatusBadge } from "../../components/common";

export const RecruiterDashboard: React.FC = () => {
  const { data: jobs = [], isLoading: loading } = useRecruiterJobsQuery();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
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
            <span>Employer Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Manage your company's open opportunities, track active candidates, and evaluate incoming applicant submissions.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Posted Jobs
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              {jobs.length}
            </h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hiring Status
            </p>
            <div className="mt-1">
              <StatusBadge status="active" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pipeline
              </p>
              <Link
                to="/recruiter/jobs"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-1 group"
              >
                <span>Job Manager</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posted Jobs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="px-6 py-4.5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Recent Job Postings</h2>
          </div>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({jobs.length})</span>
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
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                  >
                    + Post a Job
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
                className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-slate-300 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location || "Remote"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-slate-300 font-medium">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{job.category || "General"}</span>
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 font-bold"
                    >
                      <Users className="w-3.5 h-3.5 mr-1" />
                      <span>View Applicants</span>
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
