import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time", // Exact enum: Full-time, Part-time, Contract, Internship
    workMode: "On-site", // Exact enum: On-site, Hybrid, Remote
    category: "Software Development", // Enum: Software Development, Design, Marketing, Sales, Other
    experienceLevel: "Entry-level", // Enum: Entry-level, Mid-level, Senior-level
    salary: "",
    positions: 1,
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : undefined, // Schema Number type expect karta hai
        positions: Number(formData.positions),
        requirements: formData.requirements
          .split("\n")
          .filter((req) => req.trim() !== ""),
      };

      await api.post("/jobs", payload);
      navigate("/recruiter/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create job posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Software Development">Software Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Mode
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Bangalore / Noida"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary (in INR / USD)
            </label>
            <input
              type="number"
              name="salary"
              placeholder="e.g. 1200000"
              value={formData.salary}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Positions
            </label>
            <input
              type="number"
              name="positions"
              min="1"
              value={formData.positions}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Describe the role responsibilities..."
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements (One per line)
          </label>
          <textarea
            name="requirements"
            rows={3}
            placeholder="3+ years React experience&#10;TypeScript proficiency&#10;Tailwind CSS expertise"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm font-medium"
          >
            {loading ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
};
