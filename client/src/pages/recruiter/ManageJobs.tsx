import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

interface Job {
  _id: string;
  title: string;
  category?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  positions?: number;
  createdAt: string;
}

export const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRecruiterJobs = async () => {
      try {
        const response = await api.get("/jobs/my-jobs");

        if (isMounted) {
          // Flexible extraction for different backend response wrapper formats
          const extractedJobs =
            response.data?.data?.jobs ||
            response.data?.data ||
            response.data?.jobs ||
            (Array.isArray(response.data) ? response.data : []);

          setJobs(extractedJobs);
        }
      } catch (err: unknown) {
        console.error("API Error fetching jobs:", err);
        if (isMounted) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fetch jobs.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };



    fetchRecruiterJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">Loading posted jobs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Posted Jobs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            View, track, and manage applications for all your active job
            postings.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Post New Job
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No jobs posted yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Create your first job listing to start receiving applications.
          </p>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
          >
            Post a job now &rarr;
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Type & Mode</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Positions</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {job.category || "General"}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {job.jobType || "Full-time"}
                      </span>
                      <span className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {job.workMode || "On-site"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {job.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {job.positions || 1}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                      >
                        View Applicants &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
