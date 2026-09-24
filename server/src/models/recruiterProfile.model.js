import mongoose, { Schema } from "mongoose";

const recruiterProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    companyDescription: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    companyLogo: {
      type: String, // Cloudinary URL
      default: "",
    },
    logoPublicId: {
      type: String, // Cloudinary Public ID
      default: "",
    },
  },
  { timestamps: true },
);

export const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema,
);
