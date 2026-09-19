import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

interface Applicant {
  _id: string;
  applicant?: {
    _id: string;
    fullName?: string;
    fullname?: string;
    name?: string;
    email?: string;
  };
  candidate?: {
    _id: string;
    fullName?: string;
    fullname?: string;
    name?: string;
    email?: string;
  };
  status: string;
  createdAt: string;
}

export const JobApplicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/${jobId}/applicants`);

        console.log("Applicants Data Log:", response.data);

        const data =
          response.data?.data?.applications ||
          response.data?.applications ||
          response.data?.data ||
          (Array.isArray(response.data) ? response.data : []);

        setApplicants(data);
      } catch (err: any) {
        console.error("Fetch Applicants Error:", err);
        setError(err.response?.data?.message || "Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await api.post(`/applications/status/${applicationId}/update`, {
        status: newStatus,
      });
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err: any) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">Loading applicants...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/recruiter/jobs"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to Manage Jobs
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Job Applicants</h2>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No applications received yet
          </h3>
          <p className="text-gray-500 text-sm">
            Candidates who apply for this job posting will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {applicants.map((app) => {
                const userObj = app.applicant || app.candidate;
                const candidateName =
                  userObj?.fullName ||
                  userObj?.fullname ||
                  userObj?.name ||
                  "Candidate";
                const candidateEmail = userObj?.email || "";

                return (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {candidateName}
                      </div>
                      {candidateEmail && (
                        <div className="text-xs text-gray-500">
                          {candidateEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                          app.status?.toLowerCase() === "accepted" ||
                          app.status?.toLowerCase() === "shortlisted"
                            ? "bg-emerald-50 text-emerald-700"
                            : app.status?.toLowerCase() === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleStatusChange(app._id, "accepted")}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "rejected")}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
