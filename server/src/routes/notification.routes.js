import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

// GET /api/v1/notifications
router.route("/").get(getMyNotifications);

// GET /api/v1/notifications/unread-count
router.route("/unread-count").get(getUnreadNotificationCount);

// PATCH /api/v1/notifications/read-all
router.route("/read-all").patch(markAllNotificationsAsRead);

// PATCH /api/v1/notifications/:id/read
router.route("/:id/read").patch(markNotificationAsRead);

export default router;