import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState } from "../../components/common";

export const RecruiterDashboard: React.FC = () => {
  const { data: jobs = [], isLoading: loading } = useRecruiterJobsQuery();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/4 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* High-End Header Banner with Subtle Radial Glow & Glass Surface */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] shadow-inner">
        {/* Ambient Top Glow Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Hiring Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Recruiter dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Real-time hiring velocity, candidate review pipelines, and verified job postings.
            </p>
          </div>

          <Link to="/recruiter/jobs/new">
            <button
              type="button"
              className="relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post new job</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Metrics Row - Linear Style Floating Glass Cards with Hover Scale & Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Posted Jobs */}
        <div className="group relative rounded-xl bg-slate-900/40 border border-white/[0.07] hover:border-blue-500/40 p-5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              Total posted jobs
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white font-mono tabular-nums tracking-tight">
              {jobs.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">open roles</span>
          </div>
        </div>

        {/* Hiring Status */}
        <div className="group relative rounded-xl bg-slate-900/40 border border-white/[0.07] hover:border-emerald-500/40 p-5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              Hiring status
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Accepting candidates</span>
            </div>
          </div>
        </div>

        {/* Pipeline & Job Manager */}
        <Link
          to="/recruiter/jobs"
          className="group relative rounded-xl bg-slate-900/40 border border-white/[0.07] hover:border-slate-700 p-5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              Candidate pipeline
            </span>
            <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:text-white transition-all">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 inline-flex items-center gap-1.5">
              <span>Open job manager</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {jobs.length} listings
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Posted Jobs - High Contrast Card with Smooth Hover Interaction */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/[0.08] overflow-hidden backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-semibold text-white text-sm tracking-tight">Recent job postings</h2>
          </div>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>View all (<span className="font-mono tabular-nums">{jobs.length}</span>)</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-lg"
                  >
                    + Post a job
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="space-y-1.5">
                  <h3 className="font-medium text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                    {(job.title || "").replace(/\s+\d{10,14}$/, "")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 border border-white/[0.06] px-2 py-0.5 text-slate-300 text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location || "Remote"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 border border-white/[0.06] px-2 py-0.5 text-slate-300 text-[11px] font-medium">
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
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-all cursor-pointer group/btn"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-blue-400 transition-colors" />
                      <span>View applicants</span>
                    </button>
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
