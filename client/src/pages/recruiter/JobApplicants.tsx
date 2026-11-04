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
            `Candidate ${newStatus === "accepted" ? "shortlisted" : "rejected"}`,
            {
              description: `Application status updated to ${newStatus}.`,
            }
          );
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to update application status.";
          toast.error("Status update failed", { description: msg });
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
        <Skeleton className="h-6 w-1/4" />
        <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to manage jobs</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Applicant pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Review candidate profiles, evaluate credentials, and update their recruitment pipeline status in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-lg shrink-0">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-white font-mono tabular-nums">
            {applicants.length} <span className="font-sans text-slate-400 font-normal">total submissions</span>
          </span>
        </div>
      </div>

      {/* Pipeline Summary Counters & Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
            filterStatus === "all"
              ? "bg-slate-800 text-white border-slate-700"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white"
          }`}
        >
          <span className="text-xs font-medium block">All candidates</span>
          <span className="text-xl font-semibold text-white font-mono tabular-nums mt-1 block">
            {counts.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
            filterStatus === "pending"
              ? "bg-slate-800 text-white border-slate-700"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Under review</span>
          </div>
          <span className="text-xl font-semibold text-slate-200 font-mono tabular-nums mt-1 block">
            {counts.pending}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("shortlisted")}
          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
            filterStatus === "shortlisted"
              ? "bg-slate-800 text-white border-slate-700"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span className={filterStatus === "shortlisted" ? "text-white" : "text-blue-400"}>Shortlisted</span>
          </div>
          <span className="text-xl font-semibold text-blue-400 font-mono tabular-nums mt-1 block">
            {counts.shortlisted}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("rejected")}
          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
            filterStatus === "rejected"
              ? "bg-slate-800 text-white border-slate-700"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Archived</span>
          </div>
          <span className="text-xl font-semibold text-slate-400 font-mono tabular-nums mt-1 block">
            {counts.rejected}
          </span>
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
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2"
              >
                Back to manage jobs
              </Button>
            </Link>
          }
        />
      ) : filteredApplicants.length === 0 ? (
        <EmptyState
          searchQuery={filterStatus !== "all" ? filterStatus : undefined}
          title={`No applications matching "${filterStatus}"`}
          onSearchAgain={() => setFilterStatus("all")}
          onBrowsePopular={() => setFilterStatus("all")}
        />
      ) : (
        <div className="space-y-4">
          {/* Mobile View: Dedicated Applicant Cards (md:hidden) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
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
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center font-medium text-xs shrink-0 overflow-hidden">
                        {candidateAvatar ? (
                          <img src={candidateAvatar} alt={candidateName} className="w-full h-full object-cover" />
                        ) : (
                          initials || "CA"
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">
                          {candidateName}
                        </h3>
                        {candidateEmail && (
                          <a
                            href={`mailto:${candidateEmail}`}
                            className="text-xs text-slate-400 hover:text-blue-400 mt-0.5 flex items-center gap-1 truncate"
                          >
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{candidateEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-slate-500 font-mono tabular-nums">
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
                      className={`w-full justify-center text-xs font-medium ${
                        isAccepted
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
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
                      className={`w-full justify-center text-xs font-medium ${
                        isRejected
                          ? "bg-slate-800 text-slate-500 border border-slate-700"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      <span>{isRejected ? "Archived" : "Reject"}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Table Layout (hidden md:block) */}
          <div className="hidden md:block bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800/80 text-xs font-medium text-slate-400">
                    <th className="px-5 py-3">Candidate profile</th>
                    <th className="px-5 py-3">Applied date</th>
                    <th className="px-5 py-3">Current status</th>
                    <th className="px-5 py-3 text-right">Review actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
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
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center font-medium text-xs shrink-0 overflow-hidden">
                              {candidateAvatar ? (
                                <img src={candidateAvatar} alt={candidateName} className="w-full h-full object-cover" />
                              ) : (
                                initials || "CA"
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                                {candidateName}
                              </div>
                              {candidateEmail && (
                                <a
                                  href={`mailto:${candidateEmail}`}
                                  className="text-xs text-slate-400 hover:text-blue-400 mt-0.5 flex items-center gap-1 transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{candidateEmail}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs font-mono tabular-nums">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={isUpdatingThisApp || isAccepted}
                            isLoading={isUpdatingThisApp}
                            onClick={() => handleStatusChange(app._id, "accepted")}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                              isAccepted
                                ? "bg-slate-800 text-slate-400 border border-slate-700"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
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
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                              isRejected
                                ? "bg-slate-800 text-slate-500 border border-slate-700"
                                : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            <span>{isRejected ? "Archived" : "Reject"}</span>
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
        title="Reject applicant"
        description="Are you sure you want to mark this candidate as rejected? They will be informed via status update."
        confirmText="Reject application"
        variant="danger"
        isLoading={updateStatusMutation.isPending}
        onConfirm={confirmReject}
        onCancel={() => setRejectingAppId(null)}
      />
    </div>
  );
};

export default JobApplicants;
