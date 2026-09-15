import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { getMyNotifications } from "../controllers/notification.controller.js";

const router = Router();

// Secure all notification routes with JWT authentication
router.use(verifyJWT);

// GET /api/v1/notifications
router.route("/").get(getMyNotifications);

export default router;