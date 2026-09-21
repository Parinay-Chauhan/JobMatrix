import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMyApplicationsQuery } from "../../hooks/queries";
import { StatusBadge, Skeleton, EmptyState, Button, Pagination } from "../../components/common";

const PAGE_SIZE = 6;

export const MyApplications: React.FC = () => {
  const { data: applications = [], isLoading: loading, error } = useMyApplicationsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to load your submitted applications."
    : null;

  const totalPages = Math.ceil(applications.length / PAGE_SIZE) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return applications.slice(start, start + PAGE_SIZE);
  }, [applications, currentPage]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track real-time updates and decisions on your submitted job applications ({applications.length} total).
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium border bg-red-50 border-red-200 text-red-700">
          {errorMessage}
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
            <Link to="/candidate/dashboard">
              <Button variant="primary">Explore Open Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {paginatedApps.map((app) => {
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
