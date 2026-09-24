import { RecruiterProfile } from "../models/recruiterProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Recruiter Dashboard Aggregated Stats
const getRecruiterDashboardStats = asyncHandler(async (req, res) => {
  const recruiterProfile = await RecruiterProfile.findOne({
    user: req.user._id,
  });

  if (!recruiterProfile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  // Fetch job counts
  const totalJobsPosted = await Job.countDocuments({
    recruiter: recruiterProfile._id,
  });

  const activeJobs = await Job.countDocuments({
    recruiter: recruiterProfile._id,
    isActive: true,
  });

  // Get array of job ObjectIds created by this recruiter
  const recruiterJobs = await Job.find({
    recruiter: recruiterProfile._id,
  }).select("_id");
  const jobIds = recruiterJobs.map((job) => job._id);

  // Application stats aggregation breakdown
  const applicationStats = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statsSummary = {
    totalApplications: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  applicationStats.forEach((item) => {
    statsSummary.totalApplications += item.count;
    if (Object.prototype.hasOwnProperty.call(statsSummary, item._id)) {
      statsSummary[item._id] = item.count;
    }
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs: {
          total: totalJobsPosted,
          active: activeJobs,
          closed: totalJobsPosted - activeJobs,
        },
        applications: statsSummary,
      },
      "Recruiter dashboard analytics retrieved successfully",
    ),
  );
});

// 1. Create or Update Recruiter Profile
const createRecruiterProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    designation,
    experience,
    phone,
    bio,
    companyWebsite,
    companyDescription,
    location,
    industry,
  } = req.body;

  if (!companyName || companyName.trim() === "") {
    throw new ApiError(400, "Company name is required");
  }

  const profileFields = {
    user: req.user._id,
    companyName: companyName.trim(),
    designation: designation?.trim() || "",
    experience: experience?.trim() || "",
    phone: phone?.trim() || "",
    bio: bio?.trim() || "",
    companyWebsite: companyWebsite?.trim() || "",
    companyDescription: companyDescription?.trim() || "",
    location: location?.trim() || "",
    industry: industry?.trim() || "",
  };

  let profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (profile) {
    // Update existing profile
    profile = await RecruiterProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, runValidators: true },
    ).populate("user", "fullName email username role");
    return res
      .status(200)
      .json(
        new ApiResponse(200, profile, "Recruiter profile updated successfully"),
      );
  }

  // Create new profile
  profile = await RecruiterProfile.create(profileFields);
  profile = await profile.populate("user", "fullName email username role");

  return res
    .status(201)
    .json(
      new ApiResponse(201, profile, "Recruiter profile created successfully"),
    );
});

// 2. Get Logged-in Recruiter Profile
const getRecruiterProfile = asyncHandler(async (req, res) => {
  let profile = await RecruiterProfile.findOne({
    user: req.user._id,
  }).populate("user", "fullName email username role");

  if (!profile) {
    // Auto-create initial blank profile for fresh recruiter account
    profile = await RecruiterProfile.create({
      user: req.user._id,
      companyName: req.user.fullName ? `${req.user.fullName}'s Company` : "My Company",
      designation: "Recruiter / Hiring Manager",
      experience: "",
      phone: "",
      bio: "",
      companyWebsite: "",
      companyDescription: "",
      location: "",
      industry: "Software & Technology",
    });
    profile = await profile.populate("user", "fullName email username role");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Recruiter profile fetched successfully"),
    );
});

// 3. Update Recruiter Profile
const updateRecruiterProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    designation,
    experience,
    phone,
    bio,
    companyWebsite,
    companyDescription,
    location,
    industry,
  } = req.body;

  const profileFields = {};

  // 1. Validation for companyName if provided
  if (companyName !== undefined) {
    if (companyName.trim() === "") {
      throw new ApiError(400, "Company name cannot be empty");
    }
    profileFields.companyName = companyName.trim();
  }

  // 2. Only add fields that are explicitly provided in request body
  if (designation !== undefined) profileFields.designation = designation.trim();
  if (experience !== undefined) profileFields.experience = experience.trim();
  if (phone !== undefined) profileFields.phone = phone.trim();
  if (bio !== undefined) profileFields.bio = bio.trim();
  if (companyWebsite !== undefined)
    profileFields.companyWebsite = companyWebsite.trim();
  if (companyDescription !== undefined)
    profileFields.companyDescription = companyDescription.trim();
  if (location !== undefined) profileFields.location = location.trim();
  if (industry !== undefined) profileFields.industry = industry.trim();

  // 3. Update or create in MongoDB
  let profile = await RecruiterProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: profileFields },
    { new: true, runValidators: true },
  ).populate("user", "fullName email username role");

  if (!profile) {
    profile = await RecruiterProfile.create({
      user: req.user._id,
      companyName: profileFields.companyName || "My Company",
      ...profileFields,
    });
    profile = await profile.populate("user", "fullName email username role");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Recruiter profile updated successfully"),
    );
});

// 1. Upload Logo
const uploadCompanyLogo = asyncHandler(async (req, res) => {
  const logoLocalPath = req.file?.path;

  if (!logoLocalPath) {
    throw new ApiError(400, "Company logo file is required");
  }

  const profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  if (profile.logoPublicId) {
    throw new ApiError(
      400,
      "Logo already exists. Use PATCH /recruiters/logo to update it.",
    );
  }

  const logo = await uploadOnCloudinary(logoLocalPath);

  // Cloudinary return structure safe access
  const logoUrl = logo?.secure_url || logo?.url;

  if (!logoUrl) {
    throw new ApiError(500, "Error while uploading logo to Cloudinary");
  }

  // Schema field is companyLogo, not logo
  profile.companyLogo = logoUrl;
  profile.logoPublicId = logo.public_id;
  await profile.save();

  return res
    .status(201)
    .json(new ApiResponse(201, profile, "Company logo uploaded successfully"));
});

// 2. Update Logo
// Update / Replace Company Logo with Safe Rollback Pattern
const updateCompanyLogo = asyncHandler(async (req, res) => {
  const logoLocalPath = req.file?.path;

  // 1. Validate file input
  if (!logoLocalPath) {
    throw new ApiError(400, "Logo image file is required");
  }

  // 2. Fetch recruiter profile
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  // 3. Store old logo public_id for safe cleanup after DB persistence
  const oldLogoPublicId = profile.logoPublicId;

  // 4. Upload NEW logo image first
  const uploadedLogo = await uploadOnCloudinary(logoLocalPath, "image");
  const newLogoUrl = uploadedLogo?.secure_url || uploadedLogo?.url;

  if (!newLogoUrl) {
    throw new ApiError(500, "Failed to upload company logo to Cloudinary");
  }

  // 5. Update DB document with exact schema field names (companyLogo & logoPublicId)
  profile.companyLogo = newLogoUrl;
  profile.logoPublicId = uploadedLogo.public_id;

  try {
    await profile.save();
  } catch (error) {
    // DB Save failed -> Rollback: Delete newly uploaded image from Cloudinary
    await deleteFromCloudinary(uploadedLogo.public_id, "image");
    throw new ApiError(500, "Failed to save company logo details in database");
  }

  // 6. DB update successful -> Safely delete OLD logo from Cloudinary
  if (oldLogoPublicId) {
    try {
      await deleteFromCloudinary(oldLogoPublicId, "image");
    } catch (cleanupError) {
      console.error(
        "Failed to delete old company logo from Cloudinary:",
        cleanupError.message,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Company logo updated successfully"));
});

// 3. Delete Logo
const deleteCompanyLogo = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  if (!profile.logoPublicId) {
    throw new ApiError(400, "No logo found to delete");
  }

  await deleteFromCloudinary(profile.logoPublicId);

  profile.companyLogo = "";
  profile.logoPublicId = "";
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Company logo removed successfully"));
});

export {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  updateCompanyLogo,
  deleteCompanyLogo,
  getRecruiterDashboardStats,
};
