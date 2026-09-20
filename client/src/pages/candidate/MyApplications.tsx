import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Application } from "../../types";
import { applicationService } from "../../services";
import { StatusBadge, Skeleton, EmptyState, Button } from "../../components/common";

export const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        const apps = await applicationService.getMyApplications();
        if (isMounted) {
          setApplications(apps);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to load your submitted applications.";
          setError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track real-time updates and decisions on your submitted job applications.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium border bg-red-50 border-red-200 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-gray-200/80 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-200/80 space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-200/80 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="You haven't applied to any job postings yet. Explore open roles and jumpstart your career."
          action={
            <Link to="/candidate/jobs">
              <Button variant="primary">Explore Open Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = typeof app.job === "object" ? app.job : null;
            const title = job?.title || "Job Title Unavailable";
            const location = job?.location || "Remote / Not Specified";
            const jobType = job?.jobType || "Full-time";
            const companyName =
              (typeof job?.recruiter === "object" ? job?.recruiter?.companyName : undefined) ||
              job?.companyName ||
              "Company";

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {companyName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 mt-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                      📍 {location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                      💼 {jobType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-400">
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
        </div>
      )}
    </div>
  );
};

export default MyApplications;
