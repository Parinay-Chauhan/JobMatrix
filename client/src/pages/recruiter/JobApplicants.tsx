import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Application, ApplicationStatus } from "../../types";
import { applicationService } from "../../services";
import { StatusBadge, Button, EmptyState, Skeleton } from "../../components/common";

export const JobApplicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchApplicants = async () => {
      if (!jobId) return;

      try {
        const data = await applicationService.getJobApplicants(jobId);
        if (isMounted) {
          setApplicants(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to load applicants.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApplicants();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      setUpdatingId(applicationId);

      await applicationService.updateApplicationStatus(applicationId, newStatus);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update application status.";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
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

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

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
                  const isUpdating = updatingId === app._id;

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
                            isUpdating ||
                            app.status?.toLowerCase() === "accepted" ||
                            app.status?.toLowerCase() === "shortlisted"
                          }
                          isLoading={isUpdating}
                          onClick={() => handleStatusChange(app._id, "accepted")}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={
                            isUpdating ||
                            app.status?.toLowerCase() === "rejected"
                          }
                          isLoading={isUpdating}
                          onClick={() => handleStatusChange(app._id, "rejected")}
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
    </div>
  );
};

export default JobApplicants;
