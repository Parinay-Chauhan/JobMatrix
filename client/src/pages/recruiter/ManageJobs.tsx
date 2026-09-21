import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState, Pagination, Input } from "../../components/common";

const PAGE_SIZE = 8;

export const ManageJobs: React.FC = () => {
  const { data: jobs = [], isLoading: loading, error } = useRecruiterJobsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to fetch your posted jobs."
    : null;

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        (job.category && job.category.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track applications, candidate status, and recruitment progress across all listings ({jobs.length} total).
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="primary">
            + Post New Job
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No job postings yet"
          description="Create your first job listing to attract qualified candidates."
          action={
            <Link to="/recruiter/jobs/new">
              <Button variant="primary">Post a Job Now</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search postings by title or location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
              Showing {filteredJobs.length} of {jobs.length} postings
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
              <p className="text-gray-500 text-sm">No job postings matched "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Job Role</th>
                      <th className="px-6 py-4">Type & Mode</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Positions</th>
                      <th className="px-6 py-4">Posted Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {paginatedJobs.map((job) => (
                      <tr
                        key={job._id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {job.title}
                          </div>
                          <div className="text-xs text-indigo-600 font-medium mt-0.5">
                            {job.category || "General"}
                          </div>
                        </td>
                        <td className="px-6 py-4 space-x-1.5">
                          <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                            {job.jobType || "Full-time"}
                          </span>
                          {job.workMode && (
                            <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                              {job.workMode}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                          📍 {job.location || "Remote"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-semibold">
                          {job.positions || 1} open
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "Recent"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                            <Button variant="secondary" size="sm">
                              Applicants &rarr;
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredJobs.length}
              pageSize={PAGE_SIZE}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
