import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Users,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { ApplicationStatus } from "../../types";
import { useJobApplicantsQuery, useUpdateApplicationStatusMutation } from "../../hooks/queries";
import {
  StatusBadge,
  Button,
  EmptyState,
  Skeleton,
  ConfirmDialog,
} from "../../components/common";

export const JobApplicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Reject Confirmation Dialog State
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);

  // TanStack Query for Job Applicants
  const { data: applicants = [], isLoading: loading } = useJobApplicantsQuery(jobId || "");

  // Update Status Mutation
  const updateStatusMutation = useUpdateApplicationStatusMutation();

  const handleStatusChange = (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    updateStatusMutation.mutate(
      { applicationId, status: newStatus, jobId },
      {
        onSuccess: () => {
          toast.success(
            `Candidate ${newStatus === "accepted" ? "Shortlisted" : "Rejected"}`,
            {
              description: `Application status updated to ${newStatus.toUpperCase()}.`,
            }
          );
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to update application status.";
          toast.error("Status Update Failed", { description: msg });
        },
      }
    );
  };

  const confirmReject = () => {
    if (!rejectingAppId) return;
    handleStatusChange(rejectingAppId, "rejected");
    setRejectingAppId(null);
  };

  const counts = useMemo(() => {
    const total = applicants.length;
    const pending = applicants.filter((a) => a.status === "pending" || a.status === "reviewed").length;
    const shortlisted = applicants.filter((a) => a.status === "accepted" || a.status === "shortlisted").length;
    const rejected = applicants.filter((a) => a.status === "rejected").length;
    return { total, pending, shortlisted, rejected };
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    if (filterStatus === "all") return applicants;
    if (filterStatus === "pending") return applicants.filter((a) => a.status === "pending" || a.status === "reviewed");
    if (filterStatus === "shortlisted") return applicants.filter((a) => a.status === "accepted" || a.status === "shortlisted");
    if (filterStatus === "rejected") return applicants.filter((a) => a.status === "rejected");
    return applicants;
  }, [applicants, filterStatus]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
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
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Manage Jobs</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candidate Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Applicant Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Review candidate profiles, evaluate credentials, and update their recruitment pipeline status in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl">
          <Users className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white">{applicants.length} Total Submissions</span>
        </div>
      </div>

      {/* Pipeline Summary Counters & Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === "all"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/20"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider block">All Candidates</span>
          <span className="text-xl font-black text-white mt-1 block">{counts.total}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === "pending"
              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/20"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </div>
          <span className="text-xl font-black text-amber-400 mt-1 block">{counts.pending}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("shortlisted")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === "shortlisted"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/20"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Shortlisted</span>
          </div>
          <span className="text-xl font-black text-emerald-400 mt-1 block">{counts.shortlisted}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("rejected")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === "rejected"
              ? "bg-rose-500/15 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/20"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </div>
          <span className="text-xl font-black text-slate-400 mt-1 block">{counts.rejected}</span>
        </button>
      </div>

      {applicants.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Candidates who apply for this job listing will appear here in real-time."
          action={
            <Link to="/recruiter/jobs">
              <Button
                variant="primary"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                Back to Manage Jobs
              </Button>
            </Link>
          }
        />
      ) : filteredApplicants.length === 0 ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center">
          <p className="text-slate-400 text-sm">No applications found with status filter "{filterStatus}".</p>
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Show All Applications
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile View: Dedicated Applicant Cards (md:hidden) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredApplicants.map((app) => {
              const candidate =
                typeof app.applicant === "object" ? app.applicant : undefined;
              const candidateName = candidate?.fullName || "Candidate";
              const candidateEmail = candidate?.email || "";
              const candidateAvatar = candidate?.avatar;
              const initials = candidateName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              const isUpdatingThisApp =
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.applicationId === app._id;
              const isAccepted =
                app.status?.toLowerCase() === "accepted" ||
                app.status?.toLowerCase() === "shortlisted";
              const isRejected = app.status?.toLowerCase() === "rejected";

              return (
                <div
                  key={app._id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                        {candidateAvatar ? (
                          <img src={candidateAvatar} alt={candidateName} className="w-full h-full object-cover" />
                        ) : (
                          initials || "CA"
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base truncate">
                          {candidateName}
                        </h3>
                        {candidateEmail && (
                          <a
                            href={`mailto:${candidateEmail}`}
                            className="text-xs text-emerald-400 hover:underline mt-0.5 flex items-center gap-1 truncate"
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{candidateEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isUpdatingThisApp || isAccepted}
                      isLoading={isUpdatingThisApp}
                      onClick={() => handleStatusChange(app._id, "accepted")}
                      className={`w-full justify-center font-bold ${
                        isAccepted
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      <span>{isAccepted ? "Shortlisted" : "Shortlist"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={isUpdatingThisApp || isRejected}
                      isLoading={isUpdatingThisApp}
                      onClick={() => setRejectingAppId(app._id)}
                      className={`w-full justify-center font-bold ${
                        isRejected
                          ? "bg-slate-800 text-slate-500 border border-slate-700"
                          : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      <span>{isRejected ? "Rejected" : "Reject"}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Table Layout (hidden md:block) */}
          <div className="hidden md:block bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Candidate Profile</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {filteredApplicants.map((app) => {
                    const candidate =
                      typeof app.applicant === "object" ? app.applicant : undefined;
                    const candidateName = candidate?.fullName || "Candidate";
                    const candidateEmail = candidate?.email || "";
                    const candidateAvatar = candidate?.avatar;
                    const initials = candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();
                    const isUpdatingThisApp =
                      updateStatusMutation.isPending &&
                      updateStatusMutation.variables?.applicationId === app._id;
                    const isAccepted =
                      app.status?.toLowerCase() === "accepted" ||
                      app.status?.toLowerCase() === "shortlisted";
                    const isRejected = app.status?.toLowerCase() === "rejected";

                    return (
                      <tr
                        key={app._id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                              {candidateAvatar ? (
                                <img src={candidateAvatar} alt={candidateName} className="w-full h-full object-cover" />
                              ) : (
                                initials || "CA"
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {candidateName}
                              </div>
                              {candidateEmail && (
                                <a
                                  href={`mailto:${candidateEmail}`}
                                  className="text-xs text-slate-400 hover:text-emerald-400 mt-0.5 flex items-center gap-1 transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{candidateEmail}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={isUpdatingThisApp || isAccepted}
                            isLoading={isUpdatingThisApp}
                            onClick={() => handleStatusChange(app._id, "accepted")}
                            className={`font-bold ${
                              isAccepted
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>{isAccepted ? "Shortlisted" : "Shortlist"}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={isUpdatingThisApp || isRejected}
                            isLoading={isUpdatingThisApp}
                            onClick={() => setRejectingAppId(app._id)}
                            className={`font-bold ${
                              isRejected
                                ? "bg-slate-800 text-slate-500 border border-slate-700"
                                : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            <span>{isRejected ? "Rejected" : "Reject"}</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(rejectingAppId)}
        title="Reject Applicant"
        description="Are you sure you want to mark this candidate as Rejected? They will be informed via status update."
        confirmText="Reject Application"
        variant="danger"
        isLoading={updateStatusMutation.isPending}
        onConfirm={confirmReject}
        onCancel={() => setRejectingAppId(null)}
      />
    </div>
  );
};

export default JobApplicants;
