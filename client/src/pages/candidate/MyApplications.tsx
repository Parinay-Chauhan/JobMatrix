import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company?: string;
    location?: string;
    jobType?: string;
    salary?: number;
  };
  status: string;
  createdAt: string;
}

export const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/get");

        const apps =
          res.data?.data?.applications || res.data?.data || res.data || [];

        if (isMounted) {
          setApplications(Array.isArray(apps) ? apps : []);
        }
      } catch (err: unknown) {
        console.error("Error fetching applications:", err);
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



  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "reviewed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">
          Loading your applications...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track the current status of all the jobs you have applied for.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            You haven't applied to any jobs yet.
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job || {};
            return (
              <div
                key={app._id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {job.title || "Job Title Unavailable"}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                    {job.location && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        📍 {job.location}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        💼 {job.jobType}
                      </span>
                    )}
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      📅 Applied on:{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(
                      app.status,
                    )}`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
