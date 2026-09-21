import { Job } from "../models/job.model.js";
import { RecruiterProfile } from "../models/recruiterProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// 1. Create a New Job Posting
const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    location,
    jobType,
    workMode,
    category,
    experienceLevel,
    salary,
    positions,
  } = req.body;

  // Validation
  if (
    [title, description, location].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "Title, description, and location are required");
  }

  if (salary === undefined || salary === null) {
    throw new ApiError(400, "Salary is required");
  }

  const salaryValue = Number(salary);
  if (!Number.isFinite(salaryValue) || salaryValue < 0) {
    throw new ApiError(400, "Salary must be a valid non-negative number");
  }

  // Strict Numeric Validation for Positions
  let positionsValue = 1;
  if (positions !== undefined && positions !== null) {
    positionsValue = Number(positions);
    if (!Number.isInteger(positionsValue) || positionsValue < 1) {
      throw new ApiError(
        400,
        "Positions must be a valid positive integer (at least 1)",
      );
    }
  }

  // Ensure recruiter profile exists before posting job
  const recruiterProfile = await RecruiterProfile.findOne({
    user: req.user._id,
  });

  if (!recruiterProfile) {
    throw new ApiError(
      404,
      "Recruiter profile not found. Please create a profile first.",
    );
  }

  // Handle requirements as array if passed as comma-separated string or array
  let parsedRequirements = [];
  if (Array.isArray(requirements)) {
    parsedRequirements = requirements;
  } else if (typeof requirements === "string") {
    parsedRequirements = requirements.split(",").map((req) => req.trim());
  }

  const job = await Job.create({
    title: title.trim(),
    description: description.trim(),
    requirements: parsedRequirements,
    location: location.trim(),
    jobType: jobType || "Full-time",
    workMode: workMode || "On-site",
    category: category || "Other",
    experienceLevel: experienceLevel || "Entry-level",
    salary: salaryValue,
    positions: positionsValue,
    recruiter: recruiterProfile._id,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job posted successfully"));
});

// 2. Get All Jobs (Public Feed with Search, Multi-Filter & Pagination)
const getAllJobs = asyncHandler(async (req, res) => {
  const {
    search,
    keyword,
    location,
    jobType,
    workMode,
    category,
    experienceLevel,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { isActive: true };

  // 1. Text Search across Title, Description, and Requirements
  const searchTerm = search || keyword;
  if (searchTerm && searchTerm.trim() !== "") {
    const searchRegex = new RegExp(searchTerm.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { requirements: searchRegex },
    ];
  }

  // 2. Exact/Case-Insensitive Filters
  if (location && location.trim() !== "") {
    query.location = { $regex: location.trim(), $options: "i" };
  }

  if (jobType && jobType.trim() !== "") {
    query.jobType = jobType.trim();
  }

  if (workMode && workMode.trim() !== "") {
    query.workMode = workMode.trim();
  }

  if (category && category.trim() !== "") {
    query.category = category.trim();
  }

  if (experienceLevel && experienceLevel.trim() !== "") {
    query.experienceLevel = experienceLevel.trim();
  }

  // 3. Pagination calculation
  const numericPage = Math.max(1, parseInt(page, 10) || 1);
  const numericLimit = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (numericPage - 1) * numericLimit;

  const jobs = await Job.find(query)
    .populate({
      path: "recruiter",
      select: "companyName companyLogo location industry",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(numericLimit);

  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / numericLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          totalJobs,
          currentPage: numericPage,
          totalPages,
          hasNextPage: numericPage < totalPages,
          hasPrevPage: numericPage > 1,
        },
      },
      "Jobs fetched successfully",
    ),
  );
});

// 3. Get Recruiter's Posted Jobs
const getMyPostedJobs = asyncHandler(async (req, res) => {
  const recruiterProfile = await RecruiterProfile.findOne({
    user: req.user._id,
  });

  if (!recruiterProfile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  const jobs = await Job.find({ recruiter: recruiterProfile._id })
    .populate("recruiter", "companyName companyLogo location industry")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Posted jobs fetched successfully"));
});

// 4. Get Single Job Details by ID
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id).populate({
    path: "recruiter",
    select:
      "companyName companyLogo companyWebsite companyDescription location industry",
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job details fetched successfully"));
});

// 5. Update Job (Recruiter Only)
const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Authorization check: Only the recruiter who created the job can update it
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { $set: req.body },
    { returnDocument: "after", runValidators: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

// 6. Delete Job (Recruiter Only)
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this job");
  }

  await Job.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully"));
});

// 7. Toggle Job Active/Inactive Status (Recruiter Owner Only)
const toggleJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Authorization check
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this job status");
  }

  job.isActive = !job.isActive;
  await job.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        job,
        `Job listing successfully ${job.isActive ? "reopened" : "closed"}`,
      ),
    );
});

// Clean export update
export {
  postJob,
  getAllJobs,
  getMyPostedJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
};
