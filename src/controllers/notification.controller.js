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

export { getMyNotifications };