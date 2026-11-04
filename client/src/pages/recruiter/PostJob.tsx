import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Layers,
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
      toast.error("Validation error", { description: "Title, description, and location are required." });
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
        toast.success("Job published successfully", {
          description: "Your listing is now live and accepting applicant submissions.",
        });
        navigate("/recruiter/jobs");
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to create job posting.";
        toast.error("Job creation failed", { description: msg });
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Back Link */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to manage jobs</span>
      </Link>

      {/* High-End Header Banner with Subtle Radial Glow & Glass Surface */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
        {/* Ambient Top Glow Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/3 h-48 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Listing Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Post a new job
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Create an engineering or product listing to reach qualified candidates across our verified network.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-xs text-slate-300 font-medium shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Direct candidate pipeline</span>
          </div>
        </div>
      </div>

      {/* Form Container - Linear Style Floating Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-slate-900/40 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-6"
      >
        {/* Basic Role Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Role specifications
              </h2>
              <p className="text-xs text-slate-400">
                Core position title, domain, and work structure
              </p>
            </div>
          </div>

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
              label="Category Domain"
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
              label="Employment Type"
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
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Location & compensation
              </h2>
              <p className="text-xs text-slate-400">
                Geography and annual remuneration package
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location"
              name="location"
              required
              placeholder="e.g. Bengaluru, India / Remote"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              label="Salary (INR / Annual)"
              type="number"
              name="salary"
              required
              placeholder="e.g. 1800000"
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
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/[0.08] text-slate-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Description & requirements
              </h2>
              <p className="text-xs text-slate-400">
                Detailed scope, responsibilities, and screening prerequisites
              </p>
            </div>
          </div>

          <Textarea
            label="Job Description"
            name="description"
            rows={4}
            required
            placeholder="Detail the role impact, engineering roadmap, and day-to-day responsibilities..."
            value={formData.description}
            onChange={handleChange}
          />

          <Textarea
            label="Technical Prerequisites (One per line)"
            name="requirements"
            rows={3}
            placeholder="3+ years of React / Next.js production experience&#10;Deep TypeScript knowledge and performance profiling&#10;Hands-on experience with REST APIs and PostgreSQL"
            value={formData.requirements}
            onChange={handleChange}
            helperText="Each line will be parsed as a filterable skill chip for ATS matching"
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 pt-6 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="justify-center border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium px-4 py-2 rounded-xl"
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={postJobMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {postJobMutation.isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing listing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish job listing</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
