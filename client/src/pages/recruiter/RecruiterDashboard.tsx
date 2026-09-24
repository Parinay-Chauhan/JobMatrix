import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useRecruiterJobsQuery } from "../../hooks/queries";
import { Button, Skeleton, EmptyState, StatusBadge } from "../../components/common";

export const RecruiterDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const { data: jobs = [], isLoading: loading } = useRecruiterJobsQuery();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your company's open positions and evaluate incoming talent.
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="primary">
            + Post New Job
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Total Posted Jobs
          </p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
            {jobs.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Hiring Status
          </p>
          <div className="mt-2">
            <StatusBadge status="active" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Manage Postings
          </p>
          <Link
            to="/recruiter/jobs"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 mt-2"
          >
            Go to Job Manager &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Posted Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900 text-base">Recent Job Postings</h2>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            View All ({jobs.length})
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No jobs posted yet"
              description="Create your first job listing to start receiving qualified applicant profiles."
              action={
                <Link to="/recruiter/jobs/new">
                  <Button variant="primary" size="sm">+ Post a Job</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/70 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 mt-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                      📂 {job.category || "General"}
                    </span>
                    <span className="text-gray-400">
                      📅 {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                    <Button variant="secondary" size="sm">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Session & Sign Out Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mb-8">
        <div>
          <h2 className="text-base font-bold text-gray-900">Employer Account Session</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Signed in as <span className="font-semibold text-gray-800">{user?.fullName || "Recruiter"}</span> ({user?.email})
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          onClick={handleLogout}
          className="sm:w-auto w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out / Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
