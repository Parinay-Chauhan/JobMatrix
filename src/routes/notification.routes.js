import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

// GET /api/v1/notifications
router.route("/").get(getMyNotifications);

// PATCH /api/v1/notifications/:id/read
router.route("/:id/read").patch(markNotificationAsRead);

export default router;