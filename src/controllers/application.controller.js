import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// 1. Apply For Job (Candidate Only)
const applyJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id; // Route: /:id/apply
  const applicantId = req.user._id;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  // Check if job exists and populate recruiter profile to get user ID
  const job = await Job.findById(jobId).populate({
    path: "recruiter",
    select: "user companyName",
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!job.isActive) {
    throw new ApiError(
      400,
      "This job listing is no longer accepting applications"
    );
  }

  // Prevent duplicate applications
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: applicantId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  // Create Application
  const application = await Application.create({
    job: jobId,
    applicant: applicantId,
    status: "pending",
  });

  // Create Recruiter Notification (Non-fatal)
  try {
    const recruiterUserId = job.recruiter?.user;

    if (recruiterUserId) {
      await Notification.create({
        recipient: recruiterUserId,
        type: "NEW_APPLICATION",
        message: `A candidate has applied for your position: ${job.title}`,
        relatedJob: job._id,
        relatedApplication: application._id,
        isRead: false,
      });
    }
  } catch (error) {
    console.error("Failed to generate recruiter notification:", error.message);
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully")
    );
});

// 2. Get All Applied Jobs (Candidate Only)
const getAppliedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      populate: {
        path: "recruiter",
        select: "companyName companyLogo location",
      },
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Applied jobs fetched successfully"
      )
    );
});

// 3. Get Applicants For a Job (Recruiter Only)
const getApplicants = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Verification: Ensure the logged-in recruiter owns this job
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to view applicants for this job");
  }

  const applications = await Application.find({ job: jobId })
    .sort({ createdAt: -1 })
    .populate({
      path: "applicant",
      select: "fullName email avatar",
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Applicants fetched successfully"
      )
    );
});

// 4. Update Application Status (Recruiter Only)
const updateStatus = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
  const normalizedStatus = status.toLowerCase();

  if (!validStatuses.includes(normalizedStatus)) {
    throw new ApiError(400, "Invalid status value");
  }

  const application = await Application.findById(applicationId).populate({
    path: "job",
    select: "title createdBy",
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Authorization check
  if (application.job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this application status");
  }

  application.status = normalizedStatus;
  await application.save();

  // Create Candidate Notification (Non-fatal)
  try {
    const candidateUserId = application.applicant;

    if (candidateUserId) {
      await Notification.create({
        recipient: candidateUserId,
        type: "APPLICATION_STATUS_UPDATED",
        message: `Your application status for "${application.job.title}" has been updated to "${normalizedStatus}".`,
        relatedJob: application.job._id,
        relatedApplication: application._id,
        isRead: false,
      });
    }
  } catch (error) {
    console.error("Failed to generate candidate status notification:", error.message);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application status updated successfully")
    );
});

export { applyJob, getAppliedJobs, getApplicants, updateStatus };