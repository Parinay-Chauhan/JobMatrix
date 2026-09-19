import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Job {
  _id: string;
  title: string;
  category?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  salary?: number;
  description?: string;
}

export const FindJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/jobs");
      const extractedJobs =
        response.data?.data?.jobs ||
        response.data?.data ||
        response.data?.jobs ||
        (Array.isArray(response.data) ? response.data : []);
      setJobs(extractedJobs);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setApplyingId(jobId);
      setMessage(null);

      // Most standard backend controllers use POST for application submission:
      await api.post(`/applications/apply/${jobId}`);

      setAppliedJobs((prev) => [...prev, jobId]);
      setMessage({
        type: "success",
        text: "Successfully applied for this job!",
      });
    } catch (err: any) {
      console.error("Apply Job Error Log:", err.response);

      // Alternative fallback endpoint hit in case route is /applications/:id/apply
      try {
        await api.get(`/applications/apply/${jobId}`);
        setAppliedJobs((prev) => [...prev, jobId]);
        setMessage({
          type: "success",
          text: "Successfully applied for this job!",
        });
      } catch (fallbackErr: any) {
        const errorMsg =
          err.response?.data?.message ||
          fallbackErr.response?.data?.message ||
          "Failed to apply for this job.";
        setMessage({ type: "error", text: errorMsg });
      }
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">
          Loading available jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Explore Job Opportunities
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Browse open roles and apply to build your career.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            No active job listings
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded">
                      {job.jobType || "Full-time"}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mb-3">
                    {job.category || "Technology"}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {job.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      💼 {job.workMode || "On-site"}
                    </span>
                    {job.salary && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        💰 ₹{job.salary.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={isApplied || applyingId === job._id}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isApplied
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {applyingId === job._id
                    ? "Applying..."
                    : isApplied
                      ? "Applied"
                      : "Apply Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
