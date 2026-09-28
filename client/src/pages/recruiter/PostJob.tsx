import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles,
  Briefcase,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { usePostJobMutation } from "../../hooks/queries";
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

  const navigate = useNavigate();
  const postJobMutation = usePostJobMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error("Validation Error", { description: "Title, description, and location are required." });
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      jobType: formData.jobType,
      workMode: formData.workMode,
      category: formData.category,
      experienceLevel: formData.experienceLevel,
      salary: formData.salary ? Number(formData.salary) : undefined,
      positions: Number(formData.positions) || 1,
      requirements: formData.requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    postJobMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Job Published Successfully!", {
          description: "Your listing is now active and receiving applicant submissions.",
        });
        navigate("/recruiter/jobs");
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to create job posting.";
        toast.error("Job Creation Failed", { description: msg });
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Manage Jobs</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Opportunity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Post a New Job
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Create an opportunity listing to reach thousands of qualified tech professionals across our verified network.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
      >
        {/* Basic Role Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Briefcase className="w-4 h-4" />
            <span>Role Specifications</span>
          </h2>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        </div>

        {/* Location & Compensation */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <MapPin className="w-4 h-4" />
            <span>Location & Compensation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location"
              name="location"
              required
              placeholder="e.g. Bengaluru / Remote"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              label="Salary (INR / Annual)"
              type="number"
              name="salary"
              required
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
        </div>

        {/* Description & Requirements */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4" />
            <span>Description & Requirements</span>
          </h2>

          <Textarea
            label="Job Description"
            name="description"
            rows={4}
            required
            placeholder="Detail the role responsibilities, team mission, and impact..."
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
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 pt-6 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="justify-center border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={postJobMutation.isPending}
            disabled={postJobMutation.isPending}
            className="justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Publish Job Listing</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
