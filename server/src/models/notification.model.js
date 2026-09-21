import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["NEW_APPLICATION", "APPLICATION_STATUS_UPDATED"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedJob: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    relatedApplication: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for optimizing unread notification fetch queries
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
