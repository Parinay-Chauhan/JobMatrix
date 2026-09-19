import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Job {
  _id: string;
  title: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  category?: string;
  salary?: string;
  description?: string;
  createdAt: string;
}

export const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs");
        const jobData =
          res.data?.data?.jobs ||
          res.data?.jobs ||
          res.data?.data ||
          (Array.isArray(res.data) ? res.data : []);
        setJobs(jobData);
      } catch (err) {
        console.error("Failed to load public jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesLocation = job.location
      ?.toLowerCase()
      .includes(searchLocation.toLowerCase());
    return matchesTitle && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-indigo-600">
              JobPortal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Find Your Dream Job or Hire Top Talent
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Discover thousands of job opportunities across tech, design, and
            business, or post jobs to recruit skilled professionals.
          </p>

          {/* Search Box */}
          <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-3 text-gray-800 max-w-3xl mx-auto">
            <div className="flex-1 w-full flex items-center px-3 py-2 bg-gray-50 rounded-xl">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Job title, skills, or role"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm"
              />
            </div>

            <div className="flex-1 w-full flex items-center px-3 py-2 bg-gray-50 rounded-xl">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="City, state, or Remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm"
              />
            </div>

            <button
              onClick={() => {}}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Job Openings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Explore available opportunities posted by top companies
            </p>
          </div>

          <Link
            to="/register"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Post a Job &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Loading latest job listings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              No jobs found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                      {job.category || job.jobType || "Full Time"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-500 font-medium mb-3">
                    📍 {job.location || "Remote / Onsite"}
                  </p>

                  {job.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-emerald-600">
                    {job.salary || "Competitive"}
                  </span>

                  <button
                    onClick={() => navigate("/login")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
