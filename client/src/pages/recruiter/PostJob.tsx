import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services";
import { Input, Select, Textarea, Button } from "../../components/common";

export const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    workMode: "On-site",
    category: "Software Development",
    experienceLevel: "Entry-level",
    salary: "",
    positions: 1,
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        workMode: formData.workMode,
        category: formData.category,
        experienceLevel: formData.experienceLevel,
        salary: formData.salary ? Number(formData.salary) : undefined,
        positions: Number(formData.positions),
        requirements: formData.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
      };

      await jobService.postJob(payload);
      navigate("/recruiter/jobs");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create job posting.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Post a New Job
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create an opportunity listing to reach thousands of qualified tech professionals.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200/80 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            name="title"
            required
            placeholder="e.g. Senior Frontend Engineer"
            value={formData.title}
            onChange={handleChange}
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: "Software Development", label: "Software Development" },
              { value: "Design", label: "Design" },
              { value: "Marketing", label: "Marketing" },
              { value: "Sales", label: "Sales" },
              { value: "Product Management", label: "Product Management" },
              { value: "Other", label: "Other" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Job Type"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            options={[
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
            ]}
          />

          <Select
            label="Work Mode"
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            options={[
              { value: "On-site", label: "On-site" },
              { value: "Hybrid", label: "Hybrid" },
              { value: "Remote", label: "Remote" },
            ]}
          />

          <Select
            label="Experience Level"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            options={[
              { value: "Entry-level", label: "Entry-level" },
              { value: "Mid-level", label: "Mid-level" },
              { value: "Senior-level", label: "Senior-level" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Location"
            name="location"
            placeholder="e.g. Bengaluru / Remote"
            value={formData.location}
            onChange={handleChange}
          />

          <Input
            label="Salary (INR / Annual)"
            type="number"
            name="salary"
            placeholder="e.g. 1500000"
            value={formData.salary}
            onChange={handleChange}
          />

          <Input
            label="Open Positions"
            type="number"
            name="positions"
            min={1}
            value={formData.positions}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Job Description"
          name="description"
          rows={4}
          required
          placeholder="Detail the role responsibilities, mission, and day-to-day impact..."
          value={formData.description}
          onChange={handleChange}
        />

        <Textarea
          label="Requirements (One per line)"
          name="requirements"
          rows={3}
          placeholder="3+ years of React / Next.js&#10;Strong TypeScript foundations&#10;Experience with REST APIs and state management"
          value={formData.requirements}
          onChange={handleChange}
          helperText="Enter each prerequisite skill or experience on a new line"
        />

        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Publish Job Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
