import React, { useEffect, useState, useMemo } from "react";
import type { Job } from "../../types";
import { jobService, applicationService } from "../../services";
import { JobCard, JobCardSkeleton, EmptyState, Input, Select } from "../../components/common";

export const FindJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [jobsData, myApps] = await Promise.all([
          jobService.getAllJobs().catch(() => []),
          applicationService.getMyApplications().catch(() => []),
        ]);

        if (isMounted) {
          setJobs(jobsData);
          const appliedIds = myApps.map((app) =>
            typeof app.job === "object" ? app.job?._id : app.job
          );
          setAppliedJobs(appliedIds.filter((id): id is string => Boolean(id)));
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to load jobs list.";
          setMessage({ type: "error", text: errorMsg });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      setApplyingId(jobId);
      setMessage(null);

      await applicationService.applyForJob(jobId);

      setAppliedJobs((prev) => [...prev, jobId]);
      setMessage({
        type: "success",
        text: "Application submitted successfully! Check 'My Applications' to track its status.",
      });
    } catch (err: unknown) {
      const errResponse = (err as { response?: { data?: { message?: string; error?: string }; status?: number } })?.response;
      const errorMsg =
        errResponse?.data?.message ||
        errResponse?.data?.error ||
        "Failed to apply for this job.";

      setMessage({ type: "error", text: errorMsg });

      if (errResponse?.status === 400 || errorMsg.toLowerCase().includes("already applied")) {
        setAppliedJobs((prev) => [...prev, jobId]);
      }
    } finally {
      setApplyingId(null);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) cats.add(j.category);
    });
    return Array.from(cats);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        !selectedCategory || job.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchType =
        !selectedJobType || job.jobType?.toLowerCase() === selectedJobType.toLowerCase();

      return matchSearch && matchCategory && matchType;
    });
  }, [jobs, searchTerm, selectedCategory, selectedJobType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore Job Opportunities
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover vetted tech, product, and engineering roles matching your profile.
        </p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by title, skill, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          <Select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            options={[
              { value: "", label: "All Job Types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Remote", label: "Remote" },
            ]}
          />
        </div>
      </div>

      {/* Job Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description={
            searchTerm || selectedCategory || selectedJobType
              ? "Try adjusting your search criteria or filters."
              : "There are currently no active job postings available."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);
            return (
              <JobCard
                key={job._id}
                job={job}
                isApplied={isApplied}
                isLoading={applyingId === job._id}
                onAction={handleApply}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindJobs;
