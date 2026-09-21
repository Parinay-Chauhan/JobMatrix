import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link & Header */}
      <div className="mb-6">
        <Link
          to="/recruiter/jobs"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 mb-2"
        >
          &larr; Back to Posted Jobs
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Applicant Pipeline
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review candidates who applied, inspect resumes, and update recruitment status.
        </p>
      </div>

      {applicants.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Candidates who apply for this job listing will appear here in real-time."
          action={
            <Link to="/recruiter/jobs">
              <Button variant="secondary">Back to Manage Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {applicants.map((app) => {
                  const candidate =
                    typeof app.applicant === "object" ? app.applicant : undefined;
                  const candidateName = candidate?.fullName || "Candidate";
                  const candidateEmail = candidate?.email || "";
                  const isUpdatingThisApp =
                    updateStatusMutation.isPending &&
                    updateStatusMutation.variables?.applicationId === app._id;

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {candidateName}
                        </div>
                        {candidateEmail && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {candidateEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "Recently"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={
                            isUpdatingThisApp ||
                            app.status?.toLowerCase() === "accepted" ||
                            app.status?.toLowerCase() === "shortlisted"
                          }
                          isLoading={isUpdatingThisApp}
                          onClick={() => handleStatusChange(app._id, "accepted")}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={
                            isUpdatingThisApp ||
                            app.status?.toLowerCase() === "rejected"
                          }
                          isLoading={isUpdatingThisApp}
                          onClick={() => setRejectingAppId(app._id)}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(rejectingAppId)}
        title="Reject Applicant"
        description="Are you sure you want to reject this candidate? Their application status will be marked as Rejected."
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
