import { asyncHandler } from "../utils/AsyncHandler.js";
import { Candidate } from "../models/candidateProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const createCandidateProfile = asyncHandler(async (req, res) => {
  // 1. req.user se logged-in user lena & check karna user exist karta hai
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // 2. Check karna user.role === "candidate"
  if (user.role !== "candidate") {
    throw new ApiError(403, "Only candidates can create a candidate profile");
  }

  // 3. Check karna us user ka Candidate Profile already bana hua hai ya nahi
  const existingProfile = await Candidate.findOne({
    user: user._id,
  });

  if (existingProfile) {
    throw new ApiError(400, "Candidate profile already exists for this user");
  }

  // 4. Request body se profile data destructure / collect karna
  const {
    phone,
    bio,
    location,
    skills,
    experience,
    education,
    linkedin,
    github,
    portfolio,
  } = req.body;

  // Essential / Required fields validation
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "At least one skill is required");
  }

  // 5. Candidate document create karna
  const candidateProfile = await Candidate.create({
    user: user._id, // User schema se link karne ke liye
    phone,
    bio,
    location,
    skills,
    experience,
    education,
    linkedin,
    github,
    portfolio,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        candidateProfile,
        "Candidate profile created successfully",
      ),
    );
});

const getCandidateProfile = asyncHandler(async (req, res) => {
  const candidateProfile = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidateProfile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        candidateProfile,
        "Candidate profile fetched successfully",
      ),
    );
});

const updateCandidateProfile = asyncHandler(async (req, res) => {
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    throw new ApiError(401, "Invalid User");
  }

  const existedcandidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!existedcandidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const {
    phone,
    bio,
    location,
    skills,
    experience,
    education,
    linkedin,
    github,
    portfolio,
  } = req.body;

  const updateCandidate = await Candidate.findByIdAndUpdate(
    existedcandidate._id,
    {
      $set: {
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(skills !== undefined && { skills }),
        ...(experience !== undefined && { experience }),
        ...(education !== undefined && { education }),
        ...(linkedin !== undefined && { linkedin }),
        ...(github !== undefined && { github }),
        ...(portfolio !== undefined && { portfolio }),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("user", ["fullName", "email"]); // User Details Include karne ke liye

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateCandidate,
        "Candidate profile updated successfully",
      ),
    );
});

const addExperience = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { title, company, location, startDate, endDate, description } =
    req.body;

  if (!company?.trim() || !title?.trim()) {
    throw new ApiError(400, "Company, title are required");
  }

  const newExperience = {
    title,
    company,
    location,
    startDate,
    endDate,
    description,
  };

  candidate.experience.push(newExperience);

  await candidate.save();

  return res
    .status(201)
    .json(new ApiResponse(201, candidate, "Experience added successfully"));
});

const updateExperience = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { experienceId } = req.params;

  const { title, company, location, startDate, endDate, description } =
    req.body;

  const experienceIndex = candidate.experience.findIndex(
    (exp) => exp._id.toString() === experienceId,
  );

  if (experienceIndex === -1) {
    throw new ApiError(404, "Experience not found");
  }

  candidate.experience[experienceIndex] = {
    ...candidate.experience[experienceIndex]._doc,
    title:
      title !== undefined ? title : candidate.experience[experienceIndex].title,
    company:
      company !== undefined
        ? company
        : candidate.experience[experienceIndex].company,
    location:
      location !== undefined
        ? location
        : candidate.experience[experienceIndex].location,
    startDate:
      startDate !== undefined
        ? startDate
        : candidate.experience[experienceIndex].startDate,
    endDate:
      endDate !== undefined
        ? endDate
        : candidate.experience[experienceIndex].endDate,
    description:
      description !== undefined
        ? description
        : candidate.experience[experienceIndex].description,
  };

  await candidate.save();
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Experience updated successfully"));
});

const deleteExperience = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { experienceId } = req.params;

  const experienceIndex = candidate.experience.findIndex(
    (exp) => exp._id.toString() === experienceId,
  );

  if (experienceIndex === -1) {
    throw new ApiError(404, "Experience not found");
  }

  candidate.experience.splice(experienceIndex, 1);

  await candidate.save();
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Experience deleted successfully"));
});

const addEducation = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { institution, degree, fieldOfStudy, startYear, endYear } = req.body;

  if (!institution?.trim() || !degree?.trim()) {
    throw new ApiError(400, "institution and degree are required");
  }

  const newEducation = {
    institution,
    degree,
    fieldOfStudy,
    startYear,
    endYear,
  };

  candidate.education.push(newEducation);

  await candidate.save();
  return res
    .status(201)
    .json(new ApiResponse(201, candidate, "Education added successfully"));
});

const updateEducation = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { educationId } = req.params;

  const { institution, degree, fieldOfStudy, startYear, endYear } = req.body;

  const educationIndex = candidate.education.findIndex(
    (edu) => edu._id.toString() === educationId,
  );

  if (educationIndex === -1) {
    throw new ApiError(404, "Education not found");
  }

  candidate.education[educationIndex] = {
    ...candidate.education[educationIndex]._doc,
    institution:
      institution !== undefined
        ? institution
        : candidate.education[educationIndex].institution,
    degree:
      degree !== undefined
        ? degree
        : candidate.education[educationIndex].degree,
    fieldOfStudy:
      fieldOfStudy !== undefined
        ? fieldOfStudy
        : candidate.education[educationIndex].fieldOfStudy,
    startYear:
      startYear !== undefined
        ? startYear
        : candidate.education[educationIndex].startYear,
    endYear:
      endYear !== undefined
        ? endYear
        : candidate.education[educationIndex].endYear,
  };

  await candidate.save();
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Education updated successfully"));
});

const deleteEducation = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const { educationId } = req.params;

  const educationIndex = candidate.education.findIndex(
    (edu) => edu._id.toString() === educationId,
  );

  if (educationIndex === -1) {
    throw new ApiError(404, "Education not found");
  }

  candidate.education.splice(educationIndex, 1);

  await candidate.save();
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Education deleted successfully"));
});

// Upload or Replace Candidate Resume with Rollback Safety
const uploadAndUpdateResume = asyncHandler(async (req, res) => {
  const resumeLocalPath = req.file?.path;

  // 1. Validate incoming file
  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }

  // 2. Fetch candidate profile
  // Change CandidateProfile.findOne to Candidate.findOne
  const profile = await Candidate.findOne({ user: req.user._id });
  if (!profile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  // 3. Store old resume credentials for safe post-cleanup
  const oldResumePublicId = profile.resumePublicId;

  // 4. Upload NEW resume first
  const uploadedResume = await uploadOnCloudinary(resumeLocalPath, "raw");
  const newResumeUrl = uploadedResume?.secure_url || uploadedResume?.url;

  if (!newResumeUrl) {
    throw new ApiError(500, "Failed to upload new resume to Cloudinary");
  }

  // 5. Update DB document with matching schema fields (resume & resumePublicId)
  profile.resume = newResumeUrl;
  profile.resumePublicId = uploadedResume.public_id;

  try {
    await profile.save();
  } catch (error) {
    // DB Save failed -> Rollback: Delete the newly uploaded Cloudinary file to prevent orphan files
    await deleteFromCloudinary(uploadedResume.public_id, "raw");
    throw new ApiError(500, "Failed to save resume details in database");
  }

  // 6. DB update successful -> Safely cleanup OLD resume from Cloudinary
  if (oldResumePublicId) {
    try {
      await deleteFromCloudinary(oldResumePublicId, "raw");
    } catch (cleanupError) {
      console.error(
        "Failed to delete old resume from Cloudinary:",
        cleanupError.message,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Resume updated successfully"));
});

const deleteResume = asyncHandler(async (req, res) => {
  // 1. Candidate profile find karo
  const candidate = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate profile not found");
  }

  // 2. Check karo ki resume exist karta bhi hai ya nahi
  if (!candidate.resumePublicId) {
    throw new ApiError(400, "No resume found to delete");
  }

  // 3. Cloudinary se resume file remove karo
  const resourceType = candidate.resumeResourceType || "raw";
  const deleteResult = await deleteFromCloudinary(
    candidate.resumePublicId,
    resourceType,
  );

  if (!deleteResult) {
    throw new ApiError(500, "Failed to delete resume from Cloudinary");
  }

  // 4. Database fields clear karo
  candidate.resume = "";
  candidate.resumePublicId = "";
  if (candidate.resumeResourceType) {
    candidate.resumeResourceType = "";
  }

  await candidate.save();

  // 5. Response send karo
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Resume deleted successfully"));
});

export {
  createCandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  uploadAndUpdateResume,
  deleteResume,
};
