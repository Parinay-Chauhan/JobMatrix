import { getIO } from "../socket.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// 1. Apply For Job (Candidate Only)
// Apply For Job (with Non-fatal Notification & Socket Emission)
const applyJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const applicantId = req.user._id;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  // 1. Fetch Job
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // 2. Inactive Job Guard Check
  if (!job.isActive) {
    throw new ApiError(
      400,
      "This job listing is no longer accepting applications",
    );
  }

  // 3. Duplicate Application Check
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: applicantId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  // 4. Create Application (Primary Workflow)
  const application = await Application.create({
    job: jobId,
    applicant: applicantId,
  });

  if (!application) {
    throw new ApiError(500, "Failed to apply for job");
  }

  // 5. Non-Fatal Notification Creation & Socket.IO Real-time Emission
  try {
    const notification = await Notification.create({
      recipient: job.createdBy, // Recruiter User ID
      type: "NEW_APPLICATION",
      message: `${req.user.fullName || "A candidate"} applied for your job post: "${job.title}"`,
      relatedJob: jobId,
      relatedApplication: application._id,
    });

    // Real-Time Socket Emission to Recruiter's Room
    try {
      const io = getIO();
      const recruiterRoom = job.createdBy.toString();
      io.to(recruiterRoom).emit("new_notification", notification);
    } catch (socketError) {
      console.error(
        "Socket emission failed for applyJob:",
        socketError.message,
      );
    }
  } catch (notificationError) {
    // Log error only; primary job application creation remains successful
    console.error(
      "Failed to create notification for applyJob:",
      notificationError.message,
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        application,
        "Job application submitted successfully",
      ),
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
      new ApiResponse(200, applications, "Applied jobs fetched successfully"),
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
      select: "fullName email avatar", // Fixed: avatar field select kar rahe hain, profilePicture nahi
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applicants fetched successfully"),
    );
});

// 4. Update Application Status (Recruiter Only)
// Update Application Status (Recruiter Only)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  // 1. Validate Input Status (Includes 'reviewed' as per Schema)
  const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"];
  if (!status || !allowedStatuses.includes(status.toLowerCase())) {
    throw new ApiError(
      400,
      `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
    );
  }

  // 2. Fetch Application and Populate Job (Optimized field selection)
  const application = await Application.findById(applicationId).populate({
    path: "job",
    select: "title createdBy",
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // 3. Recruiter Ownership Authorization Guard Check
  if (application.job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Not authorized to update status for this application",
    );
  }

  // 4. Update Application Status (Primary Workflow)
  application.status = status.toLowerCase();
  await application.save();

  // 5. Non-Fatal Notification Creation & Real-Time Socket Emission
  try {
    const candidateUserId = application.applicant; // Candidate User ID

    const notification = await Notification.create({
      recipient: candidateUserId,
      type: "APPLICATION_STATUS_UPDATED",
      message: `Your application for "${application.job.title}" has been updated to ${status.toUpperCase()}.`,
      relatedJob: application.job._id,
      relatedApplication: application._id,
    });

    // Fire-and-forget Socket Emission to Candidate's Room
    try {
      const io = getIO();
      const candidateRoom = candidateUserId.toString();
      io.to(candidateRoom).emit("application_status_updated", notification);
    } catch (socketError) {
      console.error(
        "Socket emission failed for updateStatus:",
        socketError.message,
      );
    }
  } catch (notificationError) {
    // Log error only; status update remains committed in DB
    console.error(
      "Failed to create notification for updateStatus:",
      notificationError.message,
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status updated successfully",
      ),
    );
});

export { applyJob, getAppliedJobs, getApplicants, updateStatus };
