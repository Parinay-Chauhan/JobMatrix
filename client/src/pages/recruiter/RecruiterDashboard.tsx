import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

interface Job {
  _id: string;
  title: string;
  category?: string;
  location?: string;
  createdAt: string;
}

export const RecruiterDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch recruiter's posted jobs
      const res = await api.get("/jobs/my-jobs");
      const fetchedJobs =
        res.data?.data?.jobs ||
        res.data?.data ||
        res.data?.jobs ||
        (Array.isArray(res.data) ? res.data : []);

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recruiter Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your job postings and review incoming candidates.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Post New Job
        </Link>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Posted Jobs
          </p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
            {jobs.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Active Job Status
          </p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
            Active
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Action
          </p>
          <Link
            to="/recruiter/jobs"
            className="inline-block mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Manage All Jobs &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Posted Jobs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Job Postings</h3>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View All
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            You haven't posted any jobs yet. Click on "+ Post New Job" to create
            one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-gray-900">{job.title}</h4>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    <span>📍 {job.location || "Remote"}</span>
                    <span>📂 {job.category || "General"}</span>
                    <span>
                      📅 {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="w-full md:w-auto text-center px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md transition-colors"
                  >
                    View Applicants
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
