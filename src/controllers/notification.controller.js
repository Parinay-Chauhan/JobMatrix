import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Get logged-in user's notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "relatedJob",
      select: "title location jobType companyName",
    })
    .populate({
      path: "relatedApplication",
      select: "status createdAt",
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications,
      "Notifications fetched successfully"
    )
  );
});

// Mark a single notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Fetch notification ensuring both ID and recipient match (Ownership Check)
  const notification = await Notification.findById(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // Strict Authorization Guard Check
  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to mark this notification as read"
    );
  }

  // Idempotent Check: Avoid unnecessary DB saves if already read
  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save({ validateBeforeSave: false });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      notification,
      "Notification marked as read successfully"
    )
  );
});

// Mark ALL notifications as read for logged-in user
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { modifiedCount: result.modifiedCount },
      "All notifications marked as read successfully"
    )
  );
});

// Get unread notification count (For badge counters in UI)
const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { unreadCount: count },
      "Unread notification count fetched successfully"
    )
  );
});

export {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
